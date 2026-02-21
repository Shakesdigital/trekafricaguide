import './bootstrap';

/* ─── Mobile Nav Toggle ────────────────────────────────────────────── */
const navToggle = document.querySelector('[data-nav-toggle]');
const navMenu = document.querySelector('[data-nav-menu]');

if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('is-open');
    });

    /* Close menu when clicking a nav link on mobile */
    navMenu.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('is-open');
        });
    });
}

/* ─── Reveal-on-scroll (IntersectionObserver) ──────────────────────── */
const revealItems = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                revealObserver.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.08, rootMargin: '0px 0px -40px 0px' },
);

revealItems.forEach((item) => revealObserver.observe(item));

/* ─── Scroll Progress Bar ──────────────────────────────────────────── */
const scrollProgress = document.querySelector('.scroll-progress');
const siteHeader = document.querySelector('.site-header');

function updateScrollProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollProgress && docHeight > 0) {
        const percent = Math.min((scrollTop / docHeight) * 100, 100);
        scrollProgress.style.width = percent + '%';
    }

    /* Header shadow on scroll */
    if (siteHeader) {
        siteHeader.classList.toggle('scrolled', scrollTop > 20);
    }
}

/* ─── Back to Top ──────────────────────────────────────────────────── */
const backToTop = document.querySelector('.back-to-top');

function updateBackToTop() {
    if (backToTop) {
        backToTop.classList.toggle('is-visible', window.scrollY > 400);
    }
}

if (backToTop) {
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/* ─── Optimized Scroll Listener ────────────────────────────────────── */
let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            updateScrollProgress();
            updateBackToTop();
            ticking = false;
        });
        ticking = true;
    }
}, { passive: true });

/* Initial call */
updateScrollProgress();
updateBackToTop();

/* ─── Interactive Map ──────────────────────────────────────────────── */
const mapRegions = document.querySelectorAll('.map-region');
const regionCards = document.querySelectorAll('[data-region-card]');

const resetMapState = () => {
    mapRegions.forEach((region) => region.classList.remove('is-active'));
    regionCards.forEach((card) => card.classList.remove('is-active'));
};

mapRegions.forEach((regionLink) => {
    regionLink.addEventListener('mouseenter', () => {
        const region = regionLink.dataset.region;
        resetMapState();
        regionLink.classList.add('is-active');
        const card = document.querySelector(`[data-region-card="${region}"]`);
        if (card) {
            card.classList.add('is-active');
        }
    });
});

/* ─── Smooth Scroll for Anchor Links ───────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
        const targetId = anchor.getAttribute('href');
        if (targetId !== '#') {
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    });
});
