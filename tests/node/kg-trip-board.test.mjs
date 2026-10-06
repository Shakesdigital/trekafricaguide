// Tests for the TripBoard state manager.
// Run: node --test tests/node/kg-trip-board.test.mjs
import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import {
  createTripBoard,
  TripBoard,
  getTripBoard,
  resetTripBoard,
  STORAGE_KEY,
} from '../../src/scripts/trip-board.mjs';

// ── Mock localStorage ───────────────────────────────────────────────────────────

let mockStorage = {};

beforeEach(() => {
  mockStorage = {};
  global.localStorage = {
    getItem: (key) => mockStorage[key] || null,
    setItem: (key, value) => { mockStorage[key] = String(value); },
    removeItem: (key) => { delete mockStorage[key]; },
  };
  resetTripBoard();
});

// ── createTripBoard ─────────────────────────────────────────────────────────────

describe('createTripBoard', () => {
  test('creates an empty trip with UUID and empty days', () => {
    const trip = createTripBoard();
    assert.ok(trip.tripId);
    assert.equal(trip.days.length, 0);
    assert.equal(trip.preferences.budget, null);
    assert.equal(trip.preferences.maxDriveHours, null);
    assert.equal(trip.preferences.style, 'balanced');
  });
});

// ── Day operations ──────────────────────────────────────────────────────────────

describe('TripBoard day operations', () => {
  test('addDay appends a new day', () => {
    const board = new TripBoard();
    board.addDay({ location: 'Kampala', activities: [{ name: 'Arrival' }] });
    const state = board.getState();
    assert.equal(state.days.length, 1);
    assert.equal(state.days[0].day, 1);
    assert.equal(state.days[0].location, 'Kampala');
    assert.deepStrictEqual(state.days[0].activities, [{ name: 'Arrival' }]);
  });

  test('addDay assigns sequential day numbers', () => {
    const board = new TripBoard();
    board.addDay({ location: 'Bwindi' });
    board.addDay({ location: 'Kasenyi' });
    board.addDay({ location: 'Entebbe' });
    const state = board.getState();
    assert.equal(state.days[0].day, 1);
    assert.equal(state.days[1].day, 2);
    assert.equal(state.days[2].day, 3);
  });

  test('addDay accepts activity as string', () => {
    const board = new TripBoard();
    board.addDay({ location: 'Bwindi' });
    board.addActivity(1, 'Gorilla trekking');
    const state = board.getState();
    assert.equal(state.days[0].activities[0].name, 'Gorilla trekking');
  });

  test('addDay accepts activity as object', () => {
    const board = new TripBoard();
    board.addDay({ location: 'Bwindi' });
    board.addActivity(1, { name: 'Birdwatching', duration: '2 hours', entity_slug: 'birding-bwindi' });
    const state = board.getState();
    assert.equal(state.days[0].activities[0].name, 'Birdwatching');
    assert.equal(state.days[0].activities[0].entity_slug, 'birding-bwindi');
  });

  test('removeDay removes the day and renumbers', () => {
    const board = new TripBoard();
    board.addDay({ location: 'A' });
    board.addDay({ location: 'B' });
    board.addDay({ location: 'C' });
    board.removeDay(2);
    const state = board.getState();
    assert.equal(state.days.length, 2);
    assert.equal(state.days[0].day, 1);
    assert.equal(state.days[0].location, 'A');
    assert.equal(state.days[1].day, 2);
    assert.equal(state.days[1].location, 'C');
  });

  test('removeDay on non-existent day is a no-op', () => {
    const board = new TripBoard();
    board.addDay({ location: 'A' });
    board.removeDay(99);
    assert.equal(board.getState().days.length, 1);
  });

  test('moveDay reorders days', () => {
    const board = new TripBoard();
    board.addDay({ location: 'A' });
    board.addDay({ location: 'B' });
    board.addDay({ location: 'C' });
    board.moveDay(0, 2);
    const state = board.getState();
    assert.equal(state.days[0].location, 'B');
    assert.equal(state.days[1].location, 'C');
    assert.equal(state.days[2].location, 'A');
    // Days are renumbered
    assert.equal(state.days[2].day, 3);
  });

  test('moveDay returns false for invalid indices', () => {
    const board = new TripBoard();
    board.addDay({ location: 'A' });
    assert.equal(board.moveDay(-1, 0), false);
    assert.equal(board.moveDay(0, 5), false);
  });
});

// ── Activity operations ────────────────────────────────────────────────────────

describe('TripBoard activity operations', () => {
  test('addActivity adds to the correct day', () => {
    const board = new TripBoard();
    board.addDay({ location: 'Bwindi' });
    board.addActivity(1, 'Gorilla trekking');
    board.addActivity(1, 'Night walk');
    assert.equal(board.getState().days[0].activities.length, 2);
  });

  test('removeActivity removes by name', () => {
    const board = new TripBoard();
    board.addDay({ location: 'Bwindi' });
    board.addActivity(1, 'Gorilla trekking');
    board.addActivity(1, 'Night walk');
    board.removeActivity(1, 'Night walk');
    assert.equal(board.getState().days[0].activities.length, 1);
    assert.equal(board.getState().days[0].activities[0].name, 'Gorilla trekking');
  });

  test('removeActivity returns false for non-existent day', () => {
    const board = new TripBoard();
    assert.equal(board.removeActivity(99, 'test'), false);
  });

  test('replaceActivity swaps activity', () => {
    const board = new TripBoard();
    board.addDay({ location: 'Bwindi' });
    board.addActivity(1, 'Old activity');
    board.replaceActivity(1, 'Old activity', 'New activity');
    assert.equal(board.getState().days[0].activities[0].name, 'New activity');
  });

  test('replaceActivity returns null for non-existent activity', () => {
    const board = new TripBoard();
    board.addDay({ location: 'Bwindi' });
    board.addActivity(1, 'Existing');
    assert.equal(board.replaceActivity(1, 'Nonexistent', 'New'), null);
  });
});

// ── Accommodation operations ────────────────────────────────────────────────────

describe('TripBoard accommodation operations', () => {
  test('changeAccommodation sets accommodation for a day', () => {
    const board = new TripBoard();
    board.addDay({ location: 'Bwindi' });
    const acc = { name: 'Sanctuary Gorilla Forest Camp', slug: 'sanctuary-gorilla-forest-camp' };
    board.changeAccommodation(1, acc);
    assert.equal(board.getState().days[0].accommodation.name, 'Sanctuary Gorilla Forest Camp');
  });

  test('changeAccommodation returns null for non-existent day', () => {
    const board = new TripBoard();
    assert.equal(board.changeAccommodation(99, { name: 'Test' }), null);
  });
});

// ── Preferences ─────────────────────────────────────────────────────────────────

describe('TripBoard preferences', () => {
  test('updatePreferences sets budget', () => {
    const board = new TripBoard();
    board.updatePreferences({ budget: 5000 });
    assert.equal(board.getState().preferences.budget, 5000);
  });

  test('updatePreferences sets maxDriveHours', () => {
    const board = new TripBoard();
    board.updatePreferences({ maxDriveHours: 3 });
    assert.equal(board.getState().preferences.maxDriveHours, 3);
  });

  test('updatePreferences sets style', () => {
    const board = new TripBoard();
    board.updatePreferences({ style: 'luxury' });
    assert.equal(board.getState().preferences.style, 'luxury');
  });

  test('updatePreferences preserves existing values', () => {
    const board = new TripBoard();
    board.updatePreferences({ budget: 5000, style: 'luxury' });
    board.updatePreferences({ maxDriveHours: 4 });
    const prefs = board.getState().preferences;
    assert.equal(prefs.budget, 5000);
    assert.equal(prefs.style, 'luxury');
    assert.equal(prefs.maxDriveHours, 4);
  });
});

// ── Persistence ─────────────────────────────────────────────────────────────────

describe('TripBoard persistence', () => {
  test('save() persists to localStorage', () => {
    const board = new TripBoard();
    board.addDay({ location: 'Bwindi' });
    board.updatePreferences({ budget: 3000 });
    board.save();
    assert.ok(mockStorage[STORAGE_KEY]);
    const saved = JSON.parse(mockStorage[STORAGE_KEY]);
    assert.equal(saved.days.length, 1);
    assert.equal(saved.preferences.budget, 3000);
  });

  test('load() restores from localStorage', () => {
    mockStorage[STORAGE_KEY] = JSON.stringify({
      tripId: 'test-id',
      days: [{ day: 1, location: 'Kampala', activities: [{ name: 'Arrival' }], accommodation: null, notes: null }],
      preferences: { budget: 2000, maxDriveHours: 4, style: 'balanced' },
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z',
    });
    const board = new TripBoard();
    assert.equal(board.load(), true);
    assert.equal(board.getState().days[0].location, 'Kampala');
    assert.equal(board.getState().preferences.budget, 2000);
  });

  test('load() returns false when no saved state', () => {
    const board = new TripBoard();
    assert.equal(board.load(), false);
  });

  test('clear() removes from localStorage', () => {
    const board = new TripBoard();
    board.addDay({ location: 'Test' });
    board.save();
    assert.ok(mockStorage[STORAGE_KEY]);
    board.clear();
    assert.equal(board.getState().days.length, 0);
    assert.equal(mockStorage[STORAGE_KEY], undefined);
  });
});

// ── Serialization ───────────────────────────────────────────────────────────────

describe('TripBoard serialization', () => {
  test('toJSON returns a plain copy', () => {
    const board = new TripBoard();
    board.addDay({ location: 'Bwindi' });
    board.addActivity(1, 'Gorilla trekking');
    const json = board.toJSON();
    assert.equal(json.days[0].location, 'Bwindi');
    assert.equal(json.days[0].activities[0].name, 'Gorilla trekking');
  });

  test('fromJSON loads from a plain object', () => {
    const board = new TripBoard();
    board.fromJSON({
      tripId: 'external-id',
      days: [
        { day: 1, location: 'Kampala', activities: [{ name: 'Arrival' }], accommodation: null, notes: null },
        { day: 2, location: 'Bwindi', activities: [], accommodation: null, notes: null },
      ],
      preferences: { budget: 5000, maxDriveHours: 3, style: 'luxury' },
    });
    const state = board.getState();
    assert.equal(state.tripId, 'external-id');
    assert.equal(state.days.length, 2);
    assert.equal(state.days[1].day, 2);
    assert.equal(state.preferences.budget, 5000);
  });

  test('fromJSON converts string activities to objects', () => {
    const board = new TripBoard();
    board.fromJSON({
      days: [{ day: 1, location: 'Test', activities: ['Just a string'], accommodation: null, notes: null }],
    });
    assert.equal(board.getState().days[0].activities[0].name, 'Just a string');
  });
});

// ── Stats ───────────────────────────────────────────────────────────────────────

describe('TripBoard stats', () => {
  test('getStats returns correct counts', () => {
    const board = new TripBoard();
    board.addDay({ location: 'A' });
    board.addDay({ location: 'B', activities: ['Activity 1', 'Activity 2'] });
    const stats = board.getStats();
    assert.equal(stats.dayCount, 2);
    assert.equal(stats.totalActivities, 2);
  });

  test('getStats reflects preferences', () => {
    const board = new TripBoard();
    board.updatePreferences({ budget: 5000 });
    const stats = board.getStats();
    assert.equal(stats.hasPreferences, true);
  });
});

// ── Singleton ───────────────────────────────────────────────────────────────────

describe('getTripBoard singleton', () => {
  test('returns the same instance', () => {
    const a = getTripBoard();
    const b = getTripBoard();
    assert.equal(a, b);
  });

  test('resetTripBoard creates a new instance', () => {
    const a = getTripBoard();
    resetTripBoard();
    const b = getTripBoard();
    assert.notEqual(a, b);
  });
});
