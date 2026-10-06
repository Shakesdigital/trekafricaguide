// TripBoard — progressive, editable trip construction state manager.
// A singleton that persists to localStorage and emits change events so the
// Astro UI can react to state changes. No framework dependencies.

import { randomUUID } from 'node:crypto';

const STORAGE_KEY = 'trek_trip_board';

// ── Factory ─────────────────────────────────────────────────────────────────────

/**
 * Create a new empty trip board.
 */
export function createTripBoard() {
  return {
    tripId: randomUUID(),
    days: [],
    preferences: {
      budget: null,
      maxDriveHours: null,
      style: 'balanced',
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

// ── State management class ──────────────────────────────────────────────────────

export class TripBoard {
  constructor(state = null) {
    this.state = state || createTripBoard();
    this._dispatchChange();
  }

  // ── Day operations ───────────────────────────────────────────────────────────

  /**
   * Add a new day to the itinerary. Days are automatically numbered sequentially.
   * @param {object} day - { location, activities?, accommodation?, notes? }
   * @param {number} [insertAt] - optional index to insert at (default: append)
   */
  addDay(day, insertAt) {
    const newDay = {
      day: this.state.days.length + 1,
      location: day.location || '',
      activities: [...(day.activities || [])],
      accommodation: day.accommodation || null,
      notes: day.notes || null,
    };

    if (insertAt !== undefined) {
      this.state.days.splice(insertAt, 0, newDay);
    } else {
      this.state.days.push(newDay);
    }

    this._renumberDays();
    this._touch();
    return newDay;
  }

  /**
   * Remove a day by its day number.
   * @param {number} dayNum - the day number to remove
   */
  removeDay(dayNum) {
    this.state.days = this.state.days.filter((d) => d.day !== dayNum);
    this._renumberDays();
    this._touch();
    return this.state.days.length;
  }

  /**
   * Move a day from one position to another.
   * @param {number} fromIndex - current index
   * @param {number} toIndex - target index
   */
  moveDay(fromIndex, toIndex) {
    if (fromIndex < 0 || fromIndex >= this.state.days.length) return false;
    if (toIndex < 0 || toIndex >= this.state.days.length) return false;

    const [removed] = this.state.days.splice(fromIndex, 1);
    this.state.days.splice(toIndex, 0, removed);
    this._renumberDays();
    this._touch();
    return true;
  }

  // ── Activity operations ──────────────────────────────────────────────────────

  /**
   * Add an activity to a specific day.
   * @param {number} dayNum
   * @param {string|object} activity - string or { name, entity_slug?, entity_type?, duration? }
   */
  addActivity(dayNum, activity) {
    const day = this.state.days.find((d) => d.day === dayNum);
    if (!day) return null;

    const act = typeof activity === 'string'
      ? { name: activity }
      : { ...activity };

    day.activities.push(act);
    this._touch();
    return act;
  }

  /**
   * Remove an activity from a day by name.
   */
  removeActivity(dayNum, activityName) {
    const day = this.state.days.find((d) => d.day === dayNum);
    if (!day) return false;

    day.activities = day.activities.filter((a) => a.name !== activityName);
    this._touch();
    return true;
  }

  /**
   * Replace an activity on a day.
   */
  replaceActivity(dayNum, oldActivityName, newActivity) {
    const day = this.state.days.find((d) => d.day === dayNum);
    if (!day) return null;

    const idx = day.activities.findIndex((a) => a.name === oldActivityName);
    if (idx === -1) return null;

    const newAct = typeof newActivity === 'string'
      ? { name: newActivity }
      : { ...newActivity };

    day.activities[idx] = newAct;
    this._touch();
    return newAct;
  }

  // ── Accommodation operations ────────────────────────────────────────────────

  /**
   * Change the accommodation for a day.
   */
  changeAccommodation(dayNum, accommodation) {
    const day = this.state.days.find((d) => d.day === dayNum);
    if (!day) return null;

    day.accommodation = accommodation;
    this._touch();
    return accommodation;
  }

  // ── Preferences ──────────────────────────────────────────────────────────────

  /**
   * Update trip preferences.
   * @param {object} prefs - { budget?, maxDriveHours?, style? }
   */
  updatePreferences(prefs) {
    this.state.preferences = {
      budget: prefs.budget ?? this.state.preferences.budget,
      maxDriveHours: prefs.maxDriveHours ?? this.state.preferences.maxDriveHours,
      style: prefs.style || this.state.preferences.style,
    };
    this._touch();
    return this.state.preferences;
  }

  // ── Persistence ──────────────────────────────────────────────────────────────

  /**
   * Save the current trip state to localStorage.
   */
  save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      window.dispatchEvent(new CustomEvent('trip-board-save'));
    } catch (e) {
      console.warn('TripBoard: failed to save to localStorage', e);
    }
    return this.state;
  }

  /**
   * Load trip state from localStorage. Returns true if loaded.
   */
  load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        this.state = JSON.parse(raw);
        this._dispatchChange();
        return true;
      }
    } catch (e) {
      console.warn('TripBoard: failed to load from localStorage', e);
    }
    return false;
  }

  /**
   * Clear the trip board (removes from localStorage).
   */
  clear() {
    this.state = createTripBoard();
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      // ignore
    }
    this._dispatchChange();
  }

  // ── Serialization ────────────────────────────────────────────────────────────

  /**
   * Return a plain JSON-serializable copy of the state.
   */
  toJSON() {
    return JSON.parse(JSON.stringify(this.state));
  }

  /**
   * Load from a JSON object (e.g. from server response).
   */
  fromJSON(json) {
    this.state = {
      tripId: json.tripId || randomUUID(),
      days: (json.days || []).map((d) => ({
        day: d.day,
        location: d.location,
        activities: (d.activities || []).map((a) =>
          typeof a === 'string' ? { name: a } : { ...a }
        ),
        accommodation: d.accommodation || null,
        notes: d.notes || null,
      })),
      preferences: { ...createTripBoard().preferences, ...(json.preferences || {}) },
      createdAt: json.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this._dispatchChange();
  }

  // ── Queries ──────────────────────────────────────────────────────────────────

  /**
   * Get a deep copy of the current state.
   */
  getState() {
    return this.toJSON();
  }

  /**
   * Get summary stats (day count, total activities, etc.)
   */
  getStats() {
    const totalActivities = this.state.days.reduce((sum, d) => sum + (d.activities?.length || 0), 0);
    return {
      dayCount: this.state.days.length,
      totalActivities,
      hasAccommodations: this.state.days.some((d) => d.accommodation),
      hasPreferences: this.state.preferences.budget !== null
        || this.state.preferences.maxDriveHours !== null,
    };
  }

  // ── Internal ─────────────────────────────────────────────────────────────────

  _renumberDays() {
    this.state.days.forEach((d, i) => {
      d.day = i + 1;
    });
  }

  _touch() {
    this.state.updatedAt = new Date().toISOString();
    this._dispatchChange();
  }

  _dispatchChange() {
    if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
      window.dispatchEvent(new CustomEvent('trip-board-change', {
        detail: this.toJSON(),
      }));
    }
  }
}

// ── Singleton accessor ─────────────────────────────────────────────────────────

let instance = null;

/**
 * Get (or create) the singleton TripBoard instance.
 */
export function getTripBoard() {
  if (!instance) {
    instance = new TripBoard();
  }
  return instance;
}

/**
 * Reset the singleton (useful in tests).
 */
export function resetTripBoard() {
  instance = null;
}

export { STORAGE_KEY };
