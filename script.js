// ===================================
// RHYDLE WAITLIST — CINEMATIC PARTICLES
// ===================================

// ── Glimmer Field + Particles ──
(function initParticles() {
    const field = document.getElementById('glimmerField');
    if (!field) return;

    const density = 32;
    const cols = Math.ceil(window.innerWidth / density);
    const rows = Math.ceil(window.innerHeight / density);

    // Grid-aligned glimmer dots
    for (let i = 0; i < 40; i++) {
        const dot = document.createElement('div');
        dot.className = 'glimmer-dot';
        const randX = Math.floor(Math.random() * cols) * density;
        const randY = Math.floor(Math.random() * rows) * density;

        dot.style.left = `${randX - 1.5}px`;
        dot.style.top = `${randY - 1.5}px`;

        const delay = Math.random() * 8;
        const duration = 3 + Math.random() * 4;

        dot.style.animation = `glimmer-pulse ${duration}s ease-in-out ${delay}s infinite`;
        field.appendChild(dot);
    }

    // Cinematic floating particles
    for (let i = 0; i < 25; i++) {
        const particle = document.createElement('div');
        particle.className = 'cinematic-particle';

        const size = 1 + Math.random() * 2;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;

        const startX = Math.random() * 100;
        const startY = Math.random() * 100;
        particle.style.left = `${startX}%`;
        particle.style.top = `${startY}%`;

        const driftX = (Math.random() - 0.5) * 150;
        const driftY = (Math.random() - 0.5) * 150;
        particle.style.setProperty('--drift-x', `${driftX}px`);
        particle.style.setProperty('--drift-y', `${driftY}px`);

        const duration = 15 + Math.random() * 25;
        const delay = Math.random() * -20;

        particle.style.animationDuration = `${duration}s`;
        particle.style.animationDelay = `${delay}s`;

        field.appendChild(particle);
    }
})();

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
    submitBtn.innerHTML = '<span class="loader"></span>';

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
            submitBtn.innerHTML = originalBtnContent;
        })
        .catch(() => {
            showModal();
            form.reset();
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnContent;
        });
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

// ── Console ──
console.log('%cRHYDLE', 'font-size: 24px; font-weight: bold; color: #F9D406;');
console.log('%cYour business. Your numbers. Your truth.', 'font-size: 14px; color: #666;');
