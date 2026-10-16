document.querySelectorAll('[data-search-ribbon]').forEach((ribbon) => {
  const input = ribbon.querySelector('[data-search-input]');
  const list = ribbon.querySelector('[data-search-listbox]');
  const stay = ribbon.querySelector('[data-stay-fields]');
  const attraction = ribbon.querySelector('[data-attraction-fields]');
  const suggestions = window.trekSearchSuggestions || [];
  const destinationUrl = (item) => item?.type === 'destination' && /^\/countries\/[a-z0-9-]+\/[a-z0-9-]+$/.test(item.url || '') ? item.url : '';
  const modes = ribbon.querySelectorAll('[data-search-mode]');
  const setMode = (mode) => {
    modes.forEach((button) => button.classList.toggle('is-active', button.dataset.searchMode === mode));
    if (stay) {
      stay.hidden = mode !== 'accommodations';
      stay.querySelectorAll('input').forEach((field) => {
        field.disabled = mode !== 'accommodations';
      });
    }
    if (attraction) {
      attraction.hidden = mode === 'accommodations';
      attraction.querySelectorAll('input').forEach((field) => {
        field.disabled = mode === 'accommodations';
      });
    }
    ribbon.action = mode === 'accommodations' ? '/accommodations' : '/attractions';
  };
  modes.forEach((button) => button.addEventListener('click', () => setMode(button.dataset.searchMode)));
  setMode(ribbon.querySelector('[data-search-mode].is-active')?.dataset.searchMode || 'accommodations');
  const close = () => {
    if (list) {
      list.hidden = true;
      input?.setAttribute('aria-expanded', 'false');
    }
  };
  input?.addEventListener('input', () => {
    if (!list) return;
    const query = input.value.trim().toLowerCase();
    list.innerHTML = '';
    const ranked = suggestions
      .map((item) => (typeof item === 'string' ? { label: item } : item))
      .filter((item) => item.label.toLowerCase().includes(query))
      .sort((a, b) => {
        const rank = (item) => (item.label.toLowerCase() === query ? 0 : item.label.toLowerCase().startsWith(query) ? 1 : 2);
        return rank(a) - rank(b) || a.label.localeCompare(b.label);
      });
    ranked.slice(0, 8).forEach((item) => {
      const option = document.createElement('li');
      option.textContent = item.context ? `${item.label} · ${item.context}` : item.label;
      option.dataset.label = item.label;
      option.setAttribute('role', 'option');
      option.tabIndex = 0;
      const choose = () => {
        input.value = item.label;
        close();
        const url = destinationUrl(item);
        if (url) window.location.assign(url);
      };
      option.addEventListener('click', choose);
      option.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); choose(); }
        if (event.key === 'Escape') { close(); input.focus(); }
      });
      list.append(option);
    });
    list.hidden = !list.children.length;
    input.setAttribute('aria-expanded', String(!list.hidden));
  });
  ribbon.addEventListener('submit', (event) => {
    const query = input?.value.trim().toLowerCase();
    const item = suggestions.find((suggestion) => destinationUrl(suggestion) && suggestion.label.toLowerCase() === query);
    if (item) { event.preventDefault(); window.location.assign(destinationUrl(item)); }
  });
  document.addEventListener('click', (event) => {
    if (!ribbon.contains(event.target)) close();
  });
});

document.querySelectorAll('[data-listing-archive]').forEach((archive) => {
  const select = archive.querySelector('[data-country-filter]');
  const cards = [...archive.querySelectorAll('[data-card-type]')];
  const update = () => {
    let count = 0;
    cards.forEach((card) => { card.hidden = !!select.value && card.dataset.country !== select.value; if (!card.hidden) count++; });
    archive.querySelector('[data-listing-count]').textContent = count + (count === 1 ? ' activity' : ' activities');
    archive.querySelector('[data-listing-empty]').hidden = count > 0 || cards.length === 0;
  };
  const country = new URLSearchParams(location.search).get('country');
  if (country && [...select.options].some((option) => option.value === country)) select.value = country;
  select.addEventListener('change', update);
  archive.querySelector('form').addEventListener('submit', (event) => { event.preventDefault(); update(); });
  update();
});
document.querySelectorAll('[data-story-archive]').forEach((archive) => {
  const select = archive.querySelector('[data-story-topic]');
  select.addEventListener('change', () => {
    const rows = [...archive.querySelectorAll('[data-story-category]')];
    rows.forEach((row) => { row.hidden = !!select.value && row.dataset.storyCategory !== select.value; });
    archive.querySelector('[data-story-empty]').hidden = rows.some((row) => !row.hidden);
  });
});

const navToggle = document.querySelector('[data-nav-toggle]');
const navMenu = document.querySelector('[data-nav-menu]');

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(navMenu.classList.contains('is-open')));
  });
}

document.querySelectorAll('[data-listing-carousel]').forEach((carousel) => {
  const track = carousel.querySelector('[data-carousel-track]');
  const controls = carousel.querySelector('[data-carousel-controls]');
  if (!track) return;
  const move = (direction) => {
    const first = track.firstElementChild;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    const step = first ? first.getBoundingClientRect().width + gap : track.clientWidth;
    const max = Math.max(0, track.scrollWidth - track.clientWidth);
    const atStart = track.scrollLeft <= 2;
    const atEnd = track.scrollLeft >= max - 2;
    const left = direction > 0 && atEnd ? 0 : direction < 0 && atStart ? max
      : Math.max(0, Math.min(max, track.scrollLeft + step * direction));
    track.scrollTo({ left, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  };
  carousel.querySelector('[data-carousel-prev]')?.addEventListener('click', () => move(-1));
  carousel.querySelector('[data-carousel-next]')?.addEventListener('click', () => move(1));
  track.addEventListener('keydown', (event) => {
    if (event.target !== track || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    move(event.key === 'ArrowRight' ? 1 : -1);
  });
  const update = () => { if (controls) controls.hidden = track.scrollWidth <= track.clientWidth + 2; };
  new ResizeObserver(update).observe(track);
  update();
});
