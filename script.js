// ===================================
// RHYDLE WAITLIST — v2.0
// Clean animations, no particles
// ===================================

// ── Google Apps Script URL ──
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzHifRBXrusxlDgNzr91NDkB8PBm8YP1SxakOs-YyFLVJi2r7SlfIw30Zr1Q9F3Rz6_/exec';

// ── Form Submission ──
function handleSubmit(event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);
    const email = formData.get('email');

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnContent = submitBtn.innerHTML;
    submitBtn.disabled = true;

    // Create loader via DOM API
    submitBtn.textContent = '';
    const loader = document.createElement('span');
    loader.className = 'loader';
    submitBtn.appendChild(loader);

    const data = {
        email: email,
        timestamp: new Date().toISOString(),
        page: 'Waitlist Form'
    };

    fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
        .then(() => {
            const signups = JSON.parse(localStorage.getItem('waitlist_signups') || '[]');
            signups.push(data);
            localStorage.setItem('waitlist_signups', JSON.stringify(signups));

            showModal();
            form.reset();
            submitBtn.disabled = false;
            restoreButton(submitBtn, originalBtnContent);
        })
        .catch(() => {
            showModal();
            form.reset();
            submitBtn.disabled = false;
            restoreButton(submitBtn, originalBtnContent);
        });
}

// Safely restore button content
function restoreButton(btn, content) {
    btn.textContent = '';
    const temp = document.createElement('template');
    temp.innerHTML = content;
    btn.appendChild(temp.content);
}

// ── Modal ──
function showModal() {
    const modal = document.getElementById('successModal');
    modal.classList.add('active');
    setTimeout(() => closeModal(), 3000);
}

function closeModal() {
    const modal = document.getElementById('successModal');
    modal.classList.remove('active');
}

// ── Scroll to CTA ──
function scrollToCTA() {
    const cta = document.getElementById('final-cta');
    if (cta) cta.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// ── Event Listeners ──
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

// ── ANIMATION ENGINE ──
(function initAnimations() {
    'use strict';

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // ── 1. Nav compact on scroll ──
    const nav = document.getElementById('mainNav');
    if (nav) {
        window.addEventListener('scroll', () => {
            nav.classList.toggle('nav-scrolled', window.scrollY > 80);
        }, { passive: true });
    }

    // ── 2. Auto-tag elements for scroll reveal ──

    // Quote section
    const quoteSection = document.querySelector('#start + section');
    if (quoteSection) {
        const inner = quoteSection.querySelector('.max-w-3xl');
        if (inner) inner.classList.add('reveal-up');
    }

    // Key section headings only (problem, how-it-works, personas, social)
    ['#skepticism', '#how-it-works', '#personas', '#social', '#final-cta'].forEach(id => {
        const section = document.querySelector(id);
        if (!section) return;
        const h2 = section.querySelector('h2');
        if (h2) h2.classList.add('reveal-up');
        const sub = section.querySelector('.section-sub');
        if (sub) sub.classList.add('reveal-up', 'delay-100');
    });

    // Step cards only — staggered (how-it-works)
    const howSection = document.querySelector('#how-it-works');
    if (howSection) {
        howSection.querySelectorAll('.card').forEach((card, i) => {
            card.classList.add('reveal-up');
            if (i > 0) card.classList.add('delay-' + Math.min(i * 100, 300));
        });
    }

    // Testimonial cards — simple reveal, no stagger
    const socialSection = document.querySelector('#social');
    if (socialSection) {
        socialSection.querySelectorAll('.card').forEach(card => {
            card.classList.add('reveal-up');
        });
    }

    // The Difference section content
    const diffContent = document.querySelector('.profit-watermark');
    if (diffContent) {
        const section = diffContent.closest('section');
        if (section) {
            const content = section.querySelector('.relative.z-10');
            if (content) content.classList.add('reveal-up');
        }
    }

    // ── 3. IntersectionObserver ──
    function setupRevealObserver() {
        const revealEls = document.querySelectorAll('.reveal-up, .profit-watermark');
        if (!revealEls.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

        revealEls.forEach(el => observer.observe(el));
    }

    requestAnimationFrame(() => requestAnimationFrame(setupRevealObserver));

})();

// ── Console ──
console.log('%cRHYDLE', 'font-size: 24px; font-weight: 800; color: #EF6D28;');
console.log('%cYour business. Your numbers. Your truth.', 'font-size: 14px; color: #6E706E;');
