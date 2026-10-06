// AskTrekResponse.mjs — renders structured JSON response blocks as visual DOM.
// Pure vanilla JS — no framework dependencies. Each block type maps to a
// renderer function that builds DOM elements and appends them to a container.

// ── Coordinate helpers ───────────────────────────────────────────────────────

const COORDINATES = {
  'kenya': { lat: -1.2921, lng: 36.8213 },
  'tanzania': { lat: -6.3690, lng: 27.9235 },
  'uganda': { lat: 1.3770, lng: 32.2903 },
  'south-africa': { lat: -30.5595, lng: 22.9375 },
  'morocco': { lat: 31.7881, lng: -7.0924 },
  'bwindi-impenetrable-national-park': { lat: -1.47, lng: 29.583 },
  'maasai-mara-national-reserve': { lat: -1.4941, lng: 35.0078 },
  'serengeti-national-park': { lat: -2.3387, lng: 34.8333 },
  'queen-elizabeth-national-park': { lat: -0.1883, lng: 29.7094 },
  'entebbe': { lat: 0.2366, lng: 32.5033 },
  'amboseli-national-park': { lat: -2.4269, lng: 37.2266 },
  'governors-camp': { lat: -1.4941, lng: 35.0078 },
  'sanctuary-gorilla-forest-camp': { lat: -1.47, lng: 29.583 },
};

// ── Main render entry point ───────────────────────────────────────────────────

/**
 * Render a full Ask Trek response into a container element.
 * @param {HTMLElement} container
 * @param {object} data - { response_type, blocks, suggestions, actions }
 */
export function renderResponse(container, data) {
  container.innerHTML = '';

  // Header with response type
  const header = document.createElement('div');
  header.className = 'ask-trek__response-header';
  const title = document.createElement('h3');
  title.className = 'ask-trek__response-title';
  title.textContent = getResponseTitle(data.response_type);
  header.appendChild(title);
  container.appendChild(header);

  // Render each block
  if (Array.isArray(data.blocks)) {
    for (const block of data.blocks) {
      const el = renderBlock(block);
      if (el) container.appendChild(el);
    }
  }

  // Footer with suggestions
  if (data.suggestions && data.suggestions.length > 0) {
    const footer = document.createElement('div');
    footer.className = 'ask-trek__response-suggestions';
    const label = document.createElement('p');
    label.className = 'ask-trek__suggestion-label';
    label.textContent = 'You might also ask:';
    footer.appendChild(label);
    const chips = document.createElement('div');
    chips.className = 'ask-trek__suggestion-chips';
    for (const s of data.suggestions) {
      const chip = document.createElement('button');
      chip.className = 'ask-trek__suggestion-chip button --small --ghost';
      chip.textContent = s;
      chip.addEventListener('click', () => {
        const form = container.closest('[data-ask-trek]')?.querySelector('[data-ask-trek-form]');
        const input = container.closest('[data-ask-trek]')?.querySelector('[data-ask-trek-input]');
        if (input) {
          input.value = s;
          form?.requestSubmit();
        }
      });
      chips.appendChild(chip);
    }
    footer.appendChild(chips);
    container.appendChild(footer);
  }
}

// ── Block dispatch ────────────────────────────────────────────────────────────

/**
 * Render a single response block based on its type.
 * @returns {HTMLElement|null}
 */
export function renderBlock(block) {
  if (!block || !block.type) return null;

  const renderer = RENDERERS[block.type];
  if (!renderer) {
    console.warn('Unknown block type:', block.type);
    return null;
  }

  const el = renderer(block);
  if (el) {
    el.className = `ask-trek__block ask-trek__block--${block.type}`;
  }
  return el;
}

// ── Block renderers ───────────────────────────────────────────────────────────

function renderText(block) {
  const el = document.createElement('p');
  el.className = 'ask-trek__text';
  el.textContent = block.content || '';
  return el;
}

function renderRoute(block) {
  const el = document.createElement('section');
  const title = document.createElement('h4');
  title.textContent = `Suggested route (${block.total_days || block.steps?.length || 0} days)`;
  el.appendChild(title);

  if (block.steps && block.steps.length > 0) {
    const list = document.createElement('div');
    list.className = 'ask-trek__route-steps';
    for (let i = 0; i < block.steps.length; i++) {
      const step = block.steps[i];
      const item = document.createElement('div');
      item.className = 'ask-trek__route-step';
      const stepNum = document.createElement('span');
      stepNum.className = 'ask-trek__route-step-num';
      stepNum.textContent = `Day ${i + 1}`;
      item.appendChild(stepNum);
      const name = document.createElement('strong');
      name.textContent = step.stop;
      item.appendChild(name);
      if (step.duration_days) {
        const dur = document.createElement('span');
        dur.className = 'ask-trek__route-duration';
        dur.textContent = `${step.duration_days} day${step.duration_days > 1 ? 's' : ''}`;
        item.appendChild(dur);
      }
      if (step.description) {
        const desc = document.createElement('p');
        desc.textContent = step.description;
        item.appendChild(desc);
      }
      if (step.hero_image_url) {
        const img = document.createElement('img');
        img.src = step.hero_image_url;
        img.alt = step.stop;
        img.loading = 'lazy';
        item.appendChild(img);
      }
      list.appendChild(item);
    }
    el.appendChild(list);
  }

  return el;
}

function renderExperiences(block) {
  const el = document.createElement('section');
  const title = document.createElement('h4');
  title.textContent = 'Experiences';
  el.appendChild(title);

  if (block.items && block.items.length > 0) {
    const grid = document.createElement('div');
    grid.className = 'ask-trek__experience-grid';
    for (const item of block.items) {
      const card = document.createElement('div');
      card.className = 'ask-trek__experience-card listing-card';
      if (item.hero_image_url) {
        const imgLink = document.createElement('a');
        imgLink.href = '#';
        imgLink.className = 'listing-card__image';
        const img = document.createElement('img');
        img.src = item.hero_image_url;
        img.alt = item.hero_image_alt || item.name || '';
        img.loading = 'lazy';
        imgLink.appendChild(img);
        card.appendChild(imgLink);
      }
      const body = document.createElement('div');
      body.className = 'listing-card__body';
      const name = document.createElement('h5');
      name.textContent = item.name || '';
      body.appendChild(name);
      if (item.duration) {
        const dur = document.createElement('small');
        dur.textContent = item.duration;
        body.appendChild(dur);
      }
      if (item.description) {
        const desc = document.createElement('p');
        desc.textContent = item.description;
        body.appendChild(desc);
      }
      card.appendChild(body);
      grid.appendChild(card);
    }
    el.appendChild(grid);
  }

  return el;
}

function renderEntityList(block, entityType) {
  const el = document.createElement('section');
  const title = document.createElement('h4');
  const typeLabel = {
    accommodations: 'Accommodations',
    activities: 'Activities',
    attractions: 'Attractions',
  }[block.type] || block.type;
  title.textContent = typeLabel;
  el.appendChild(title);

  if (block.items && block.items.length > 0) {
    const grid = document.createElement('div');
    grid.className = 'ask-trek__entity-grid listing-grid';
    for (const item of block.items) {
      const card = document.createElement('article');
      card.className = 'listing-card';
      card.dataset.cardType = entityType;

      if (item.hero_image_url) {
        const imgLink = document.createElement('a');
        imgLink.href = item.internal_url || `/${entityType}s/${item.slug}`;
        imgLink.className = 'listing-card__image';
        const img = document.createElement('img');
        img.src = item.hero_image_url;
        img.alt = item.hero_image_alt || item.name || '';
        img.loading = 'lazy';
        imgLink.appendChild(img);
        card.appendChild(imgLink);
      } else {
        const placeholder = document.createElement('div');
        placeholder.className = 'listing-card__image-placeholder';
        placeholder.textContent = 'No image';
        card.appendChild(placeholder);
      }

      const body = document.createElement('div');
      body.className = 'listing-card__body';
      const name = document.createElement('h3');
      const link = document.createElement('a');
      link.href = item.internal_url || `/${entityType}s/${item.slug}`;
      link.textContent = item.name || '';
      name.appendChild(link);
      body.appendChild(name);
      if (item.location_name) {
        const loc = document.createElement('p');
        loc.className = 'listing-card__eyebrow';
        loc.textContent = item.location_name;
        body.appendChild(loc);
      }
      if (item.listing_summary) {
        const summary = document.createElement('p');
        summary.textContent = item.listing_summary;
        body.appendChild(summary);
      }
      const footer = document.createElement('div');
      footer.className = 'listing-card__footer';
      const cta = document.createElement('a');
      cta.className = 'button';
      cta.href = item.internal_url || `/${entityType}s/${item.slug}`;
      cta.textContent = `View ${entityType === 'accommodation' ? 'stay' : entityType === 'activity' ? 'activity detail' : 'detail'}`;
      footer.appendChild(cta);
      body.appendChild(footer);

      card.appendChild(body);
      grid.appendChild(card);
    }
    el.appendChild(grid);
  }

  return el;
}

function renderComparison(block) {
  const el = document.createElement('section');
  const title = document.createElement('h4');
  title.textContent = 'Compare options';
  el.appendChild(title);

  if (block.entities && block.entities.length > 0) {
    const table = document.createElement('table');
    table.className = 'ask-trek__comparison-table';

    // Header row with entity names
    const thead = document.createElement('thead');
    const headRow = document.createElement('tr');
    const corner = document.createElement('th');
    corner.textContent = '';
    headRow.appendChild(corner);
    for (const e of block.entities) {
      const th = document.createElement('th');
      const link = document.createElement('a');
      link.href = `/${e.type}s/${e.slug}`;
      link.textContent = e.name || e.slug;
      th.appendChild(link);
      headRow.appendChild(th);
    }
    thead.appendChild(headRow);
    table.appendChild(thead);

    // Field rows
    if (block.fields && block.fields.length > 0) {
      const tbody = document.createElement('tbody');
      for (const f of block.fields) {
        const tr = document.createElement('tr');
        const fieldCell = document.createElement('td');
        fieldCell.textContent = f.field;
        fieldCell.className = 'ask-trek__compare-field';
        tr.appendChild(fieldCell);
        for (const e of block.entities) {
          const td = document.createElement('td');
          td.textContent = f.values?.[e.slug] || f.values?.[e.name] || '—';
          tr.appendChild(td);
        }
        if (f.description) {
          const descRow = document.createElement('tr');
          const descCell = document.createElement('td');
          descCell.colSpan = block.entities.length + 1;
          descCell.className = 'ask-trek__compare-description';
          descCell.textContent = f.description;
          descRow.appendChild(descCell);
          tbody.appendChild(descRow);
        }
        tbody.appendChild(tr);
      }
      table.appendChild(tbody);
    }

    el.appendChild(table);
  }

  return el;
}

function renderMap(block) {
  const el = document.createElement('section');
  const title = document.createElement('h4');
  title.textContent = 'Map';
  el.appendChild(title);

  if (block.markers && block.markers.length > 0) {
    const svg = document.createElement('svg');
    svg.className = 'ask-trek__map-svg';
    svg.setAttribute('viewBox', '0 0 400 300');
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', 'Interactive route map');

    // Compute bounds from markers (or use route_path)
    const points = [];
    if (block.route_path && block.route_path.length > 1) {
      for (const p of block.route_path) {
        points.push({ lat: p[0], lng: p[1] });
      }
    }
    for (const m of block.markers) {
      points.push({ lat: m.lat, lng: m.lng });
    }

    const bounds = computeBounds(points);
    const scale = 280 / (bounds.maxLng - bounds.minLng || 1);
    const scaleLat = 200 / (bounds.maxLat - bounds.minLat || 1);
    const s = Math.min(scale, scaleLat) * 0.9;

    // Draw route path
    if (block.route_path && block.route_path.length > 1) {
      const poly = document.createElement('polyline');
      poly.className = 'ask-trek__route-path';
      const pts = block.route_path.map((p) => {
        const x = (p[1] - bounds.minLng) * s + 50;
        const y = 150 - (p[0] - bounds.minLat) * s;
        return `${x},${y}`;
      }).join(' ');
      poly.setAttribute('points', pts);
      svg.appendChild(poly);
    }

    // Draw markers
    for (const m of block.markers) {
      const x = (m.lng - bounds.minLng) * s + 50;
      const y = 150 - (m.lat - bounds.minLat) * s;
      const g = document.createElement('g');
      g.className = 'ask-trek__map-marker';
      const circle = document.createElement('circle');
      circle.setAttribute('cx', x);
      circle.setAttribute('cy', y);
      circle.setAttribute('r', '5');
      circle.setAttribute('fill', '#2563eb');
      g.appendChild(circle);
      const label = document.createElement('text');
      label.setAttribute('x', x + 8);
      label.setAttribute('y', y - 5);
      label.setAttribute('font-size', '10');
      label.textContent = m.label || '';
      g.appendChild(label);
      const titleEl = document.createElement('title');
      titleEl.textContent = `${m.label || ''} (${m.entity_type || ''})`;
      g.appendChild(titleEl);
      svg.appendChild(g);
    }

    el.appendChild(svg);
  } else {
    el.innerHTML = '<p class="ask-trek__map-placeholder">Map data not available</p>';
  }

  return el;
}

function renderItinerary(block) {
  const el = document.createElement('section');
  const title = document.createElement('h4');
  title.textContent = 'Itinerary';
  el.appendChild(title);

  if (block.days && block.days.length > 0) {
    const list = document.createElement('div');
    list.className = 'ask-trek__itinerary-days';
    for (const day of block.days) {
      const item = document.createElement('div');
      item.className = 'ask-trek__itinerary-day';
      const dayNum = document.createElement('span');
      dayNum.className = 'ask-trek__itinerary-day-num';
      dayNum.textContent = `Day ${day.day}`;
      item.appendChild(dayNum);
      const location = document.createElement('h5');
      location.textContent = day.location || '';
      item.appendChild(location);
      if (day.description) {
        const desc = document.createElement('p');
        desc.textContent = day.description;
        item.appendChild(desc);
      }
      if (day.activities && day.activities.length > 0) {
        const ul = document.createElement('ul');
        ul.className = 'ask-trek__itinerary-activities';
        for (const act of day.activities) {
          const li = document.createElement('li');
          li.textContent = act;
          ul.appendChild(li);
        }
        item.appendChild(ul);
      }
      if (day.accommodation) {
        const acc = document.createElement('p');
        acc.className = 'ask-trek__itinerary-accommodation';
        acc.innerHTML = '<strong>Stay:</strong> ' + day.accommodation;
        item.appendChild(acc);
      }
      list.appendChild(item);
    }
    el.appendChild(list);
  }

  return el;
}

function renderActions(block) {
  const el = document.createElement('div');
  el.className = 'ask-trek__actions';

  if (block.buttons && block.buttons.length > 0) {
    for (const btn of block.buttons) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'ask-trek__action-button button';
      button.textContent = btn.label || '';
      button.addEventListener('click', () => {
        handleAction(btn.action, btn.payload);
      });
      el.appendChild(button);
    }
  }

  return el;
}

function handleAction(action, payload) {
  switch (action) {
    case 'add_to_trip':
      localStorage.setItem('trek_saved_trip', JSON.stringify(payload));
      alert('Added to your trip!');
      break;
    case 'compare':
      alert('Compare mode activated — select items to compare');
      break;
    case 'save':
      localStorage.setItem('trek_saved_item', JSON.stringify(payload));
      alert('Saved!');
      break;
    case 'explore':
      alert('Exploring…');
      break;
    default:
      console.warn('Unknown action:', action);
  }
}

function renderFilters(block) {
  const el = document.createElement('div');
  el.className = 'ask-trek__filters';
  const label = document.createElement('span');
  label.className = 'ask-trek__filter-label';
  label.textContent = 'Filter by:';
  el.appendChild(label);
  if (block.options && block.options.length > 0) {
    const select = document.createElement('select');
    select.className = 'ask-trek__filter-select';
    select.addEventListener('change', () => {
      // Dispatch a custom event for the parent to handle
      container?.dispatchEvent(new CustomEvent('ask-trek-filter-change', {
        detail: { value: select.value },
      }));
    });
    for (const opt of block.options) {
      const option = document.createElement('option');
      option.value = opt.value;
      option.textContent = opt.label;
      select.appendChild(option);
    }
    el.appendChild(select);
  }
  return el;
}

// ── Booking & itinerary-actions renderers ───────────────────────────────────────

function renderBookingOptions(block) {
  const el = document.createElement('section');
  el.className = 'ask-trek__booking-options';

  const title = document.createElement('h4');
  title.textContent = 'Booking options';
  el.appendChild(title);

  if (block.items && block.items.length > 0) {
    const list = document.createElement('div');
    list.className = 'ask-trek__booking-list';
    for (const item of block.items) {
      const link = document.createElement('a');
      link.href = item.href || '#';
      link.className = 'ask-trek__booking-link button --small';
      link.target = '_blank';
      link.rel = item.rel || 'nofollow noopener';
      link.textContent = item.label || item.providerDisplay || 'Book now';
      if (item.priceLabel) {
        const price = document.createElement('span');
        price.className = 'ask-trek__booking-price';
        price.textContent = item.priceLabel;
        link.appendChild(price);
      }
      list.appendChild(link);

      if (item.disclosure) {
        const disclosure = document.createElement('p');
        disclosure.className = 'ask-trek__booking-disclosure';
        disclosure.textContent = item.disclosure;
        list.appendChild(disclosure);
      }
    }
    el.appendChild(list);
  }

  return el;
}

function renderItineraryActions(block) {
  const el = document.createElement('div');
  el.className = 'ask-trek__itinerary-actions';

  const labelEl = document.createElement('p');
  labelEl.className = 'ask-trek__itinerary-actions-label';
  labelEl.textContent = 'Adjust your trip:';
  el.appendChild(labelEl);

  const chips = document.createElement('div');
  chips.className = 'ask-trek__itinerary-action-chips';
  const suggestions = block.suggestions || [];
  for (const s of suggestions) {
    const chip = document.createElement('button');
    chip.className = 'ask-trek__itinerary-action-chip button --small --ghost';
    chip.textContent = s;
    chip.addEventListener('click', () => {
      container?.dispatchEvent(new CustomEvent('ask-trek-restructure-request', {
        detail: { query: s },
      }));
    });
    chips.appendChild(chip);
  }
  el.appendChild(chips);

  return el;
}

// ── Registry ─────────────────────────────────────────────────────────────────

const RENDERERS = {
  text: renderText,
  route: renderRoute,
  experiences: renderExperiences,
  accommodations: (block) => renderEntityList(block, 'accommodation'),
  activities: (block) => renderEntityList(block, 'activity'),
  attractions: (block) => renderEntityList(block, 'attraction'),
  comparison: renderComparison,
  map: renderMap,
  itinerary: renderItinerary,
  actions: renderActions,
  filters: renderFilters,
  booking: renderBookingOptions,
  itinerary_actions: renderItineraryActions,
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function getResponseTitle(responseType) {
  const titles = {
    plan: 'Trip Plan',
    compare: 'Comparison',
    recommend: 'Recommendations',
    other: 'Here\'s what I found',
  };
  return titles[responseType] || 'Ask Trek';
}

function computeBounds(points) {
  if (!points || points.length === 0) {
    return { minLat: -35, maxLat: 37, minLng: -20, maxLng: 52 };
  }
  let minLat = points[0].lat, maxLat = points[0].lat;
  let minLng = points[0].lng, maxLng = points[0].lng;
  for (const p of points) {
    if (p.lat < minLat) minLat = p.lat;
    if (p.lat > maxLat) maxLat = p.lat;
    if (p.lng < minLng) minLng = p.lng;
    if (p.lng > maxLng) maxLng = p.lng;
  }
  return { minLat, maxLat, minLng, maxLng };
}

// Re-export COORDINATES for testing (renderBlock is already exported above)
export { COORDINATES };
