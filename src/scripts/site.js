document.querySelectorAll('[data-search-ribbon]').forEach((ribbon) => {
  const input = ribbon.querySelector('[data-search-input]');
  const list = ribbon.querySelector('[data-search-listbox]');
  const stay = ribbon.querySelector('[data-stay-fields]');
  const attraction = ribbon.querySelector('[data-attraction-fields]');
  const suggestions = window.trekSearchSuggestions || [];
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
      option.tabIndex = -1;
      option.addEventListener('click', () => {
        input.value = item.label;
        close();
      });
      list.append(option);
    });
    list.hidden = !list.children.length;
    input.setAttribute('aria-expanded', String(!list.hidden));
  });
  document.addEventListener('click', (event) => {
    if (!ribbon.contains(event.target)) close();
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

document.querySelectorAll('[data-listing-carousel]').forEach((listingCarousel) => {
  const track = listingCarousel.querySelector('[data-carousel-track]');
  const previous = listingCarousel.querySelector('[data-carousel-prev]');
  const next = listingCarousel.querySelector('[data-carousel-next]');
  if (!track) return;
  const scrollByCard = (direction) => {
    const firstItem = track.querySelector('.listing-carousel__item');
    const amount = firstItem ? firstItem.getBoundingClientRect().width + 20 : track.clientWidth * 0.85;
    track.scrollBy({ left: amount * direction, behavior: 'smooth' });
  };
  previous?.addEventListener('click', () => scrollByCard(-1));
  next?.addEventListener('click', () => scrollByCard(1));
});
