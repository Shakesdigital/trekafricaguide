import './bootstrap';

document.querySelectorAll('[data-search-ribbon]').forEach((ribbon) => {
    const input = ribbon.querySelector('[data-search-input]');
    const list = ribbon.querySelector('[data-search-listbox]');
    const stay = ribbon.querySelector('[data-stay-fields]');
    const suggestions = window.trekSearchSuggestions || [];
    const modes = ribbon.querySelectorAll('[data-search-mode]');
    const setMode = (mode) => {
        modes.forEach((button) => button.classList.toggle('is-active', button.dataset.searchMode === mode));
        if (stay) stay.hidden = mode !== 'accommodations';
        ribbon.action = mode === 'accommodations' ? '/accommodations' : '/attractions';
    };
    modes.forEach((button) => button.addEventListener('click', () => setMode(button.dataset.searchMode)));
    const close = () => { if (list) { list.hidden = true; input?.setAttribute('aria-expanded', 'false'); } };
    input?.addEventListener('input', () => {
        if (!list) return;
        const query = input.value.trim().toLowerCase();
        list.innerHTML = '';
        suggestions.filter((item) => item.toLowerCase().includes(query)).slice(0, 8).forEach((item) => {
            const option = document.createElement('li'); option.textContent = item; option.setAttribute('role', 'option'); option.tabIndex = -1;
            option.addEventListener('click', () => { input.value = item; close(); }); list.append(option);
        });
        list.hidden = !list.children.length; input.setAttribute('aria-expanded', String(!list.hidden));
    });
    input?.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') return close();
        const options = [...(list?.children || [])]; const current = options.indexOf(document.activeElement);
        if (event.key === 'ArrowDown' && options.length) { event.preventDefault(); options[Math.min(current + 1, options.length - 1)].focus(); }
        if (event.key === 'ArrowUp' && options.length) { event.preventDefault(); options[Math.max(current - 1, 0)].focus(); }
        if (event.key === 'Enter' && document.activeElement?.matches('[role="option"]')) { event.preventDefault(); input.value = document.activeElement.textContent; close(); }
    });
    ribbon.querySelectorAll('input[type="date"]').forEach((date) => date.addEventListener('change', () => {
        const checkin = ribbon.querySelector('[name="checkin"]'); const checkout = ribbon.querySelector('[name="checkout"]');
        if (checkin && checkout) { checkout.min = checkin.value || ''; if (checkout.value && checkout.value < checkout.min) checkout.value = checkout.min; }
    }));
    document.addEventListener('click', (event) => { if (!ribbon.contains(event.target)) close(); });
});

const navToggle = document.querySelector('[data-nav-toggle]');
const navMenu = document.querySelector('[data-nav-menu]');

if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('is-open');
        navToggle.setAttribute('aria-expanded', String(navMenu.classList.contains('is-open')));
    });
}

const carousel = document.querySelector('[data-hero-carousel]');
const heroSlides = document.querySelectorAll('[data-hero-slide]');
const heroDots = document.querySelectorAll('[data-hero-dot]');
const heroRegion = document.querySelector('[data-hero-region]');
const heroTitle = document.querySelector('[data-hero-title]');
const heroBody = document.querySelector('[data-hero-body]');

if (carousel && heroSlides.length && heroDots.length) {
    const activateSlide = (index) => {
        heroSlides.forEach((slide, slideIndex) => {
            slide.classList.toggle('is-active', slideIndex === index);
        });

        heroDots.forEach((dot, dotIndex) => {
            dot.classList.toggle('is-active', dotIndex === index);
        });

        const dot = heroDots[index];
        if (dot) {
            if (heroRegion) heroRegion.textContent = dot.dataset.region || '';
            if (heroTitle) heroTitle.textContent = dot.dataset.title || '';
            if (heroBody) heroBody.textContent = dot.dataset.body || '';
        }
    };

    heroDots.forEach((dot, index) => {
        dot.addEventListener('click', () => activateSlide(index));
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

const openButtons = document.querySelectorAll('[data-modal-open]');
const closeButtons = document.querySelectorAll('[data-modal-close]');

const toTextareaValue = (value) => {
    if (!value) return '';
    if (Array.isArray(value)) return value.join('\n');
    if (typeof value === 'object') {
        return Object.entries(value)
            .map(([key, item]) => `${key}: ${item}`)
            .join('\n');
    }

    return String(value);
};

const updateImagePreview = (scope, fieldName, value) => {
    const preview = scope.querySelector(`[data-preview-target="${fieldName}"]`);
    if (!preview) return;

    const image = preview.querySelector('img');
    const empty = preview.querySelector('.admin-image-preview__empty');
    const normalized = typeof value === 'string' ? value.trim() : '';
    const isImage = normalized.startsWith('http://')
        || normalized.startsWith('https://')
        || normalized.startsWith('/storage/')
        || normalized.startsWith('/build/')
        || normalized.startsWith('/');

    if (image && isImage) {
        image.src = normalized;
        image.hidden = false;
        if (empty) empty.hidden = true;
    } else if (image) {
        image.removeAttribute('src');
        image.hidden = true;
        if (empty) empty.hidden = false;
    }
};

const wirePreviewInputs = (form) => {
    form.querySelectorAll('[data-preview-target]').forEach((preview) => {
        const fieldName = preview.dataset.previewTarget;
        const field = form.querySelector(`[name="${fieldName}"]`);

        if (!field) return;

        updateImagePreview(form, fieldName, field.value);
        field.addEventListener('input', () => updateImagePreview(form, fieldName, field.value));
    });
};

openButtons.forEach((button) => {
    button.addEventListener('click', () => {
        const target = document.querySelector(`[data-modal="${button.dataset.modalOpen}"]`);
        if (!target) return;

        const record = button.dataset.record ? JSON.parse(button.dataset.record) : null;
        const form = target.querySelector('form');
        form.reset();

        const recordIdInput = form.querySelector('[name="record_id"]');
        if (recordIdInput) {
            recordIdInput.value = record?.id ?? '';
        }

        if (record) {
            Object.entries(record).forEach(([key, value]) => {
                const field = form.querySelector(`[name="${key}"]`);
                if (field) {
                    if (field.type === 'checkbox') {
                        field.checked = Boolean(value);
                    } else if (field.type === 'file') {
                        return;
                    } else {
                        field.value = value ?? '';
                    }
                }
            });

            const mappings = {
                gallery_text: record.gallery,
                highlights_text: record.highlights,
                amenities_text: record.amenities,
                specialties_text: record.specialties,
                meta_text: record.meta,
            };

            Object.entries(mappings).forEach(([name, value]) => {
                const field = form.querySelector(`[name="${name}"]`);
                if (field) {
                    field.value = toTextareaValue(value);
                }
            });

            const featuredField = form.querySelector('[name="featured"]');
            if (featuredField) {
                featuredField.checked = Boolean(record.featured);
            }
        }

        wirePreviewInputs(form);
        target.classList.add('is-open');
    });
});

closeButtons.forEach((button) => {
    button.addEventListener('click', () => {
        button.closest('.admin-modal')?.classList.remove('is-open');
    });
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        document.querySelectorAll('.admin-modal.is-open').forEach((modal) => modal.classList.remove('is-open'));
    }
});

/* Gallery lightbox — delegated so it survives runtime re-rendering by cms-sync.js. */
(() => {
    let overlay;
    let imageEl;
    let countEl;
    let sources = [];
    let index = 0;

    const build = () => {
        overlay = document.createElement('div');
        overlay.className = 'lightbox';
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-modal', 'true');
        overlay.setAttribute('aria-label', 'Photo gallery');
        overlay.innerHTML = `
            <button type="button" class="lightbox__btn lightbox__btn--close" data-lb="close" aria-label="Close gallery">&times;</button>
            <button type="button" class="lightbox__btn lightbox__btn--prev" data-lb="prev" aria-label="Previous photo">&#8249;</button>
            <img class="lightbox__img" alt="">
            <button type="button" class="lightbox__btn lightbox__btn--next" data-lb="next" aria-label="Next photo">&#8250;</button>
            <p class="lightbox__count" aria-live="polite"></p>`;
        document.body.appendChild(overlay);
        imageEl = overlay.querySelector('.lightbox__img');
        countEl = overlay.querySelector('.lightbox__count');

        overlay.addEventListener('click', (event) => {
            const action = event.target.closest('[data-lb]')?.dataset.lb;
            if (action === 'next') return step(1);
            if (action === 'prev') return step(-1);
            if (action === 'close' || event.target === overlay) close();
        });
    };

    const render = () => {
        if (!sources.length) return;
        imageEl.src = sources[index];
        countEl.textContent = `${index + 1} / ${sources.length}`;
        overlay.querySelector('[data-lb="prev"]').hidden = sources.length < 2;
        overlay.querySelector('[data-lb="next"]').hidden = sources.length < 2;
    };

    const step = (delta) => {
        index = (index + delta + sources.length) % sources.length;
        render();
    };

    const open = (gallery, startSrc) => {
        if (!overlay) build();
        sources = [...gallery.querySelectorAll('img')].map((img) => img.currentSrc || img.src).filter(Boolean);
        if (!sources.length) return;
        const found = startSrc ? sources.indexOf(startSrc) : 0;
        index = found >= 0 ? found : 0;
        render();
        overlay.classList.add('is-open');
        document.body.style.overflow = 'hidden';
    };

    const close = () => {
        overlay?.classList.remove('is-open');
        document.body.style.overflow = '';
    };

    document.addEventListener('click', (event) => {
        const gallery = event.target.closest('[data-gallery]');
        if (!gallery) return;

        const openButton = event.target.closest('[data-gallery-open]');
        if (openButton) {
            event.preventDefault();
            return open(gallery);
        }

        const clickedImage = event.target.closest('img');
        if (clickedImage) {
            event.preventDefault();
            open(gallery, clickedImage.currentSrc || clickedImage.src);
        }
    });

    document.addEventListener('keydown', (event) => {
        if (!overlay || !overlay.classList.contains('is-open')) return;
        if (event.key === 'Escape') close();
        if (event.key === 'ArrowRight') step(1);
        if (event.key === 'ArrowLeft') step(-1);
    });
})();
