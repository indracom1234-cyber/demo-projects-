/* CodeArena 2026 — index.js */

// ─── Particle Canvas ────────────────────────────────────────
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const particles = Array.from({ length: 60 }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    r: Math.random() * 1.5 + 0.5,
    alpha: Math.random() * 0.4 + 0.1,
    color: Math.random() > 0.5 ? '6, 214, 208' : '212, 165, 116'
}));

function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${p.alpha})`;
        ctx.fill();
    });
    requestAnimationFrame(drawParticles);
}
drawParticles();

// ─── Sticky Nav ─────────────────────────────────────────────
const nav = document.getElementById('stickyNav');
const header = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const headerH = header.offsetHeight;
    if (window.scrollY > headerH) {
        nav.classList.add('visible');
    } else {
        nav.classList.remove('visible');
    }
});

// ─── Scroll Reveal ──────────────────────────────────────────
const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.classList.add('visible');
            observer.unobserve(e.target);
        }
    });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => observer.observe(el));

// ─── Counter Animation ──────────────────────────────────────
const counters = document.querySelectorAll('.stat-num');
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const target = parseInt(el.dataset.target, 10);
        let start = 0;
        const duration = 1600;
        const step = (timestamp) => {
            if (!start) start = timestamp;
            const progress = Math.min((timestamp - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(eased * target);
            if (progress < 1) requestAnimationFrame(step);
            else el.textContent = target;
        };
        requestAnimationFrame(step);
        counterObserver.unobserve(el);
    });
}, { threshold: 0.5 });

counters.forEach(c => counterObserver.observe(c));

// ─── Gallery Tabs ───────────────────────────────────────────
const tabBtns = document.querySelectorAll('.tab-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const year = btn.dataset.year;

        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        galleryItems.forEach(item => {
            if (item.dataset.year === year) {
                item.classList.remove('hidden');
                // Re-trigger reveal animation
                item.classList.remove('visible');
                setTimeout(() => item.classList.add('visible'), 50);
            } else {
                item.classList.add('hidden');
            }
        });
    });
});

// Initial reveal for visible gallery items
setTimeout(() => {
    document.querySelectorAll('.gallery-item:not(.hidden)').forEach((el, i) => {
        setTimeout(() => el.classList.add('visible'), i * 80);
    });
}, 200);

// ─── Smooth ticker duplication ───────────────────────────────
const ticker = document.querySelector('.ticker-text');
if (ticker) {
    ticker.innerHTML = ticker.textContent.repeat(3);
}
