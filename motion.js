/* ============================================================
   CIEL HOMES — motion.js
   Premium motion layer built on "motion" (Framer Motion's
   framework-free engine). Progressive enhancement: if this file
   or the CDN fails, the site still works with the CSS fallbacks.

   1. Scroll progress bar
   2. Hero headline word-by-word reveal
   3. Hero background parallax
   4. Count-up numbers
   5. Magnetic buttons (mouse devices only)
   6. Soft image drift on villa cards (mouse devices only)
============================================================ */
import { animate, stagger, scroll } from 'https://cdn.jsdelivr.net/npm/motion@11/+esm';

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(hover:hover) and (pointer:fine)').matches;
const EASE = [0.22, 1, 0.36, 1];

document.documentElement.classList.add('motion-on');
if (reduce) { document.documentElement.classList.add('motion-reduced'); }

/* 1. Scroll progress ---------------------------------------- */
const bar = document.getElementById('scrollProgress');
if (bar && !reduce) {
  scroll(animate(bar, { scaleX: [0, 1] }, { ease: 'linear' }));
}

/* 2. Hero headline: split into words, reveal with a soft rise */
function splitWords(el) {
  const walk = node => {
    [...node.childNodes].forEach(n => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(part => {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.append(' '); return; }
          const mask = document.createElement('span');
          mask.className = 'w-mask';
          const w = document.createElement('span');
          w.className = 'w';
          w.textContent = part;
          mask.append(w);
          frag.append(mask);
        });
        n.replaceWith(frag);
      } else if (n.nodeType === 1 && n.tagName !== 'BR') {
        walk(n);
      }
    });
  };
  walk(el);
  return el.querySelectorAll('.w');
}

const title = document.querySelector('.hero-title');
if (title && !reduce) {
  const words = splitWords(title);
  title.setAttribute('aria-label', title.textContent.replace(/\s+/g, ' ').trim());
  words.forEach(w => w.setAttribute('aria-hidden', 'true'));
  title.classList.add('split-ready');
  animate(words, { y: ['110%', '0%'], opacity: [0, 1] },
    { duration: 1.1, delay: stagger(0.09, { startDelay: 0.35 }), ease: EASE });
  animate('.hero-eyebrow, .hero-sub, .hero-actions',
    { opacity: [0, 1], y: [24, 0] },
    { duration: 0.9, delay: stagger(0.15, { startDelay: 0.9 }), ease: EASE });
}

/* 3. Hero parallax (uses the independent `translate` property so it
      never fights the CSS zoom on .hero-bg) ------------------ */
const heroBg = document.getElementById('heroBg');
const hero = document.getElementById('home');
if (heroBg && hero && !reduce) {
  scroll(p => { heroBg.style.translate = `0 ${p * 14}%`; },
    { target: hero, offset: ['start start', 'end start'] });
}

/* 4. Count-up numbers --------------------------------------- */
document.querySelectorAll('.stat-num').forEach(el => {
  const end = parseInt(el.textContent, 10);
  if (!/^\d+$/.test(el.textContent.trim()) || reduce) return;
  el.textContent = '0';
  const io = new IntersectionObserver(([e]) => {
    if (!e.isIntersecting) return;
    io.disconnect();
    animate(0, end, {
      duration: 1.6, delay: 1.2, ease: EASE,
      onUpdate: v => { el.textContent = Math.round(v); }
    });
  }, { threshold: 0.4 });
  io.observe(el);
});

/* 5. Magnetic buttons + 6. soft image drift on cards.
      Both use `translate` (CSS transitions in styles.css smooth them). */
if (finePointer && !reduce) {
  document.querySelectorAll('.btn-primary, .btn-ghost, .nav-cta, .directions-btn').forEach(btn => {
    btn.addEventListener('pointermove', e => {
      const r = btn.getBoundingClientRect();
      btn.style.translate = `${(e.clientX - r.left - r.width / 2) * 0.16}px ${(e.clientY - r.top - r.height / 2) * 0.26}px`;
    });
    btn.addEventListener('pointerleave', () => { btn.style.translate = ''; });
  });

  document.querySelectorAll('.villa-card, .uc-card').forEach(card => {
    const img = card.querySelector('img');
    if (!img) return;
    card.addEventListener('pointermove', e => {
      const r = card.getBoundingClientRect();
      img.style.translate = `${((e.clientX - r.left) / r.width - 0.5) * -14}px ${((e.clientY - r.top) / r.height - 0.5) * -14}px`;
    });
    card.addEventListener('pointerleave', () => { img.style.translate = ''; });
  });
}
