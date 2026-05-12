import './bootstrap';

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
