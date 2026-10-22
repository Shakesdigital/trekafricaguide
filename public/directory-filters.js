// Shared by pre-rendered directories and the CMS-rendered directories.
const normalize = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
const keys = ['q', 'region', 'country', 'property_type', 'checkin', 'checkout', 'adults', 'children', 'rooms', 'travel_date'];

export function initDirectoryFilters(root = document) {
  root.querySelectorAll('[data-directory]').forEach(directory => {
    if (directory.dataset.filtersReady) return;
    const form = directory.querySelector('[data-directory-form]');
    if (!form) return;
    directory.dataset.filtersReady = 'true';
    const cards = [...directory.querySelectorAll('[data-directory-item]')].map(element => ({
      element, display: element.style.display,
      text: normalize(element.dataset.search || element.textContent),
    }));
    const field = name => form.elements.namedItem(name);
    const readURL = () => {
      const params = new URLSearchParams(location.search);
      keys.forEach(key => {
        const control = field(key);
        if (!control) return;
        const value = params.get(key) || control.defaultValue || '';
        if (control.tagName === 'SELECT') {
          control.value = [...control.options].find(option => normalize(option.value) === normalize(value) || normalize(option.textContent) === normalize(value))?.value || '';
        } else control.value = value;
      });
    };
    const update = (saveURL = false) => {
      const region = field('region')?.value || '';
      const country = field('country');
      if (country) {
        [...country.options].forEach(option => {
          option.disabled = !!(region && option.value && option.dataset.region !== region);
          option.hidden = option.disabled;
        });
        if (country.selectedOptions[0]?.disabled) country.value = '';
      }
      const tokens = normalize(field('q')?.value).split(/\s+/).filter(Boolean);
      const selectedCountry = country?.value || '';
      const type = field('property_type')?.value || '';
      let count = 0;
      cards.forEach(({ element, display, text }) => {
        const match = (!region || element.dataset.region === region)
          && (!selectedCountry || element.dataset.country === selectedCountry)
          && (!type || element.dataset.propertyType === type)
          && tokens.every(token => text.includes(token));
        element.hidden = !match;
        element.style.display = match ? display : 'none';
        if (match) count++;
      });
      const noun = directory.dataset.directory === 'countries' ? 'destination' : directory.dataset.directory === 'accommodations' ? 'stay' : 'attraction';
      directory.querySelector('[data-directory-count]').textContent = `${count} of ${cards.length} ${noun}${cards.length === 1 ? '' : 's'}`;
      directory.querySelector('[data-directory-empty]').hidden = count > 0;
      if (saveURL) {
        const url = new URL(location.href);
        keys.forEach(key => {
          if (!field(key)) return;
          const value = field(key).value.trim();
          if (value) url.searchParams.set(key, value);
          else url.searchParams.delete(key);
        });
        history.replaceState(history.state, '', url);
      }
    };
    form.addEventListener('input', () => update(true));
    form.addEventListener('change', () => update(true));
    form.addEventListener('submit', event => { event.preventDefault(); update(true); });
    form.addEventListener('reset', event => {
      event.preventDefault();
      keys.forEach(key => { if (field(key)) field(key).value = field(key).defaultValue || ''; });
      update(true);
    });
    window.addEventListener('popstate', () => {
      if (!directory.isConnected) return;
      readURL(); update();
    });
    readURL(); update();
  });
}

initDirectoryFilters();
