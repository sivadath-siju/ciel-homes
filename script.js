/* ============================================================
   CIEL HOMES — script.js
   All interactive behaviour for the website.

   SECTIONS:
   1. Villa Data       — edit this to update all villa content
   2. Custom Cursor    — disabled automatically on touch devices
   3. Navigation       — sticky nav + hamburger menu
   4. Scroll Reveal    — fade-in animations on scroll
   5. Progress Bars    — animated on scroll into view
   6. Villa Modal      — image slider + detail popup
   7. Form Submission  — Formspree AJAX
============================================================ */

/* ============================================================
   1. VILLA DATA
   ─────────────────────────────────────────────────────────────
   This is the single source of truth for all villa content.
   Edit the values here to update both the cards AND the modal.

   Each villa entry has:
     name     — displayed as the title
     status   — shown as the badge label
     isUC     — true = Under Construction (changes badge colour)
     images   — array of photo URLs (2–4 recommended)
                CHANGE: replace Unsplash URLs with your real photos
     desc     — full description shown in the modal
     price    — price line in the modal (or "Contact for Pricing")
     specs    — key/value pairs shown as spec tiles
     features — bullet list of included features
     location — shown at the bottom of the modal
============================================================ */
const VILLAS = {

  kunnackal: {
    name:   'Villa 1',
    status: 'Completed — Sold Out',
    isUC:   false,
    /* CHANGE: Replace with real villa photo URLs */
    images: [
      'Images/Villa1_2.png',
      'Images/Villa1_garden.jpeg',
      'Images/Villa1_3.png',
      'Images/Villa1,1.jpeg',
      'Images/Villa1_elevation.jpg',

    ],
    /* CHANGE: Full property description */
    desc: 'A stylish 3BHK villa designed for comfortable living in the peaceful surroundings of Kunnackal, Muvattupuzha. This semi-furnished home features modern glass handrails, premium full body vitrified flooring, and a beautifully landscaped garden with Korean grass and natural plant fencing. All bedrooms come with attached bathrooms and shower partitions. The property includes ample parking space, a spacious yard finished with Bangalore stone, and a ceramic tile truss roof designed for future expansion to 4BHK.',

price: 'Contact Us for Pricing',

specs: {
  'Bedrooms': '3 BHK — All Attached',
  'Built-up': '2000 sq.ft',
  'Land': '8.5 Cents',
  'Location': 'Kunnackal, Muvattupuzha',
},

features: [
  'Semi Furnished (Kitchen & Bedroom Cupboards)',
  'Glass Handrails',
  'Full Body Vitrified Tile Flooring',
  'All Bedrooms with Attached Bathrooms & Shower Partitions',
  'Korean Grass Landscaped Garden',
  'Bangalore Stone Yard Flooring',
  'Plant Fencing',
  'Parking for 3 Cars',
  'Expandable to 4BHK (Ceramic Tile Truss Roof)',
  'European Style Elevation',
  'Well Water Availability',
  'Complete Electrical Works Done',
],
    location: 'Kunnackal, Muvattupuzha, Ernakulam District, Kerala',
  },

  verdant: {
    name:   'Villa 2',
    status: 'Completed — Sold - Out',
    isUC:   false,
    /* CHANGE: Replace with real photos */
    images: [
      'Images/Villa_2/frontview.jpeg',
      'Images/Villa_2/interior.jpg',
      'Images/Villa_2/Elevation.jpg',
    ],
    desc: 'A spacious 4BHK villa designed for modern family living in Kunnackal, Muvattupuzha. The home features premium full body vitrified tile flooring, a stylish gypsum board ceiling, and additional ceramic tile roofing for enhanced durability and aesthetics. The property includes a landscaped garden and a neatly finished yard with hydraulic interlock pavers, offering both beauty and functionality. Semi-furnished interiors ensure convenience while allowing customization to your taste.',

specs: {
  'Bedrooms': '4 BHK',
  'Built-up': '2370 sq.ft',
  'Location': 'Kunnackal, Muvattupuzha',
  'Land': '12 Cents',
},

features: [
  'Full Body Vitrified Tile Flooring',
  'Gypsum Board Ceiling',
  'Extra Roofing with Ceramic Tiles',
  'Landscaped Garden',
  'Hydraulic Interlock Paver Yard',
  'Semi Furnished Interiors',
],
    location: 'Muvattupuzha, Ernakulam District, Kerala',
  },

  serene1: {
    name:   'Villa VI',
    status: 'Under Construction',
    isUC:   true,
    /* CHANGE: Use site progress photos or architectural renders */
    images: [
      'Images/Villa_6/3d_1.jpeg',
      'Images/Villa_6/3d_2.jpeg',
      'Images/Villa_6/3d_3.jpeg',
    ],
    desc: 'Villa VI is currently under construction and will be ready for possession in Mid 2026. It follows the same premium specification as our completed villas — fully furnished, gated community, private garden, and swimming pool access. Pre-launch enquiries are welcome',

price: 'Contact Us for Pricing',

specs: {
  'Bedrooms': '4 BHK',
  'Built-up': '2400 sq.ft',
  'Land': '9 Cents',
  'Location': 'Kunnackal, Muvattupuzha',
  'Status': '50% Completed',
},

features: [
  'Contemporary Style Design',
  'Premium Anjili (Indian Laurel) wood & Teak Wood Construction',
  'Full Body Vitrified Tile Flooring',
  '2 Bedrooms with Wooden Flooring',
  'Fully Furnished (on completion)',
  'Complete Interior Work Done',
  'Direct Road Access',
],
    location: 'Muvattupuzha, Ernakulam District, Kerala',
  },

  serene2: {
    name:   'Villa VII',
    status: 'Under Construction',
    isUC:   true,
    /* CHANGE: Photos */
    images: [
      'Images/Villa_7/elevation.jpeg',
    ],
    desc: 'Ciel Serene II is our latest project, currently in the early stages of construction with an estimated completion in Late 2025. Pre-launch registrations are open. The villa will follow Ciel\'s signature 4BHK specification with all the community amenities you\'d expect.',
    price: 'Pre-launch Pricing Available',
    

specs: {
  'Bedrooms': '4 BHK',
  'Built-up': '2530 sq.ft',
  'Land': '9 Cents',
  'Location': 'Kunnackal, Muvattupuzha',
  'Completion': '75% Completed',
},

features: [
  'Gated Community',
  '5m Wide Internal Road',
  'RCC Compound Wall',
  'Wall-Mounted Closets with Concealed Flush Tank',
  'Full Height Bathroom Tiles',
  'Seasoned Wood Finishes',
  'Fully Furnished (on completion)',
  'Common Swimming Pool',
  '2-Car Parking',
  'Private Garden',
],
    location: 'Muvattupuzha, Ernakulam District, Kerala',
  },
};

/* ============================================================
   2. CUSTOM CURSOR
   Disabled automatically on touch/mobile devices.
   No changes needed here.
============================================================ */
const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
const cursorEl = document.getElementById('cursor');
const ringEl   = document.getElementById('cursorRing');

if (isTouchDevice) {
  cursorEl.style.display = 'none';
  ringEl.style.display   = 'none';
  document.body.style.cursor = 'auto';
} else {
  let mx = 0, my = 0, rx = 0, ry = 0;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  (function loopCursor() {
    cursorEl.style.left = mx + 'px';
    cursorEl.style.top  = my + 'px';
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ringEl.style.left = rx + 'px';
    ringEl.style.top  = ry + 'px';
    requestAnimationFrame(loopCursor);
  })();
}

/* ============================================================
   3. NAVIGATION
   – Sticky: adds .scrolled class when page is scrolled
   – Hamburger: toggles mobile fullscreen menu
   – Mobile links: close the menu on click
============================================================ */
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');

/* Sticky nav */
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* Open/close hamburger */
hamburger.addEventListener('click', () => {
  const isOpen = hamburger.classList.toggle('open');
  mobileNav.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', String(isOpen));
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

/* Close menu when any mobile nav link is clicked */
document.querySelectorAll('.mobile-nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileNav.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

/* Hero background zoom on page load */
window.addEventListener('load', () => {
  const heroBg = document.getElementById('heroBg');
  if (heroBg) heroBg.classList.add('loaded');
});

/* ============================================================
   4. SCROLL REVEAL
   Elements with class .reveal fade up when they enter the viewport.
   Children inside grid sections get a staggered delay.
============================================================ */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), 60);
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

/* Stagger grid children */
document.querySelectorAll('.why-grid, .steps, .built-grid, .uc-grid, .testi-grid').forEach(parent => {
  [...parent.querySelectorAll('.reveal')].forEach((child, i) => {
    child.style.transitionDelay = (i * 0.12) + 's';
  });
});

/* ============================================================
   5. PROGRESS BARS
   Animate from 0% to the target width when scrolled into view.
   The target width comes from data-width="" on each .prog-fill element.
============================================================ */
const progObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const fill = entry.target.querySelector('.prog-fill');
      if (fill) fill.style.width = fill.dataset.width + '%';
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.uc-card').forEach(card => {
  const fill = card.querySelector('.prog-fill');
  if (fill) {
    fill.style.width = '0%'; /* start at 0 */
    progObs.observe(card);
  }
});

/* ============================================================
   6. VILLA MODAL
   Opens when a villa card or UC card is clicked.
   Populates content from the VILLAS data object above.
   Includes an image slider with dot navigation.
============================================================ */
const backdrop        = document.getElementById('modalBackdrop');
const modalClose      = document.getElementById('modalClose');
const sliderTrack     = document.getElementById('sliderTrack');
const sliderDots      = document.getElementById('sliderDots');
const sliderPrev      = document.getElementById('sliderPrev');
const sliderNext      = document.getElementById('sliderNext');
const modalBadge      = document.getElementById('modalBadge');
const modalTitle      = document.getElementById('modalTitle');
const modalDesc       = document.getElementById('modalDesc');
const modalPrice      = document.getElementById('modalPrice');
const modalSpecs      = document.getElementById('modalSpecs');
const modalFeatures   = document.getElementById('modalFeatures');
const modalEnquireBtn = document.getElementById('modalEnquireBtn');
const modalLocation   = document.getElementById('modalLocation');

let currentSlide = 0;
let totalSlides  = 0;

/* Move to a specific slide index */
function goToSlide(n) {
  currentSlide = Math.max(0, Math.min(n, totalSlides - 1));
  sliderTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
  document.querySelectorAll('.slider-dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === currentSlide);
  });
}

sliderPrev.addEventListener('click', () => goToSlide(currentSlide - 1));
sliderNext.addEventListener('click', () => goToSlide(currentSlide + 1));

/* Open modal and populate with villa data */
function openModal(villaKey) {
  const v = VILLAS[villaKey];
  if (!v) return;

  modalBadge.textContent = v.status;
  modalBadge.className   = 'modal-badge' + (v.isUC ? ' gold' : '');
  modalTitle.textContent = v.name;
  modalDesc.textContent  = v.desc;
  modalPrice.textContent = v.price;

  /* Spec tiles */
  modalSpecs.innerHTML = Object.entries(v.specs).map(([key, val]) =>
    `<div class="spec-item">
       <div class="spec-label">${key}</div>
       <div class="spec-val">${val}</div>
     </div>`
  ).join('');

  /* Feature bullets */
  modalFeatures.innerHTML = v.features.map(f =>
    `<div class="modal-feat">${f}</div>`
  ).join('');

  /* Location footer */
  modalLocation.textContent = v.location;

  /* Image slider */
  totalSlides = v.images.length;
  sliderTrack.innerHTML = v.images.map(src =>
    `<img class="slider-img" src="${src}" alt="${v.name}" loading="lazy">`
  ).join('');
  sliderDots.innerHTML = v.images.map((_, i) =>
    `<div class="slider-dot${i === 0 ? ' active' : ''}" data-i="${i}"></div>`
  ).join('');
  sliderDots.querySelectorAll('.slider-dot').forEach(dot =>
    dot.addEventListener('click', () => goToSlide(+dot.dataset.i))
  );
  goToSlide(0);

  /* Show/hide prev-next arrows */
  sliderPrev.style.display = totalSlides > 1 ? 'flex' : 'none';
  sliderNext.style.display = totalSlides > 1 ? 'flex' : 'none';

  /* "Enquire About This Villa" button:
     closes modal, pre-selects the villa in the contact form dropdown,
     and scrolls to the contact section */
  modalEnquireBtn.onclick = () => {
    closeModalWithHistory();
    setTimeout(() => {
      const select = document.getElementById('interest');
      if (select) {
        for (const opt of select.options) {
          if (opt.value === v.name) { opt.selected = true; break; }
        }
      }
      document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
    }, 350);
  };

  backdrop.classList.add('open');
  document.body.style.overflow = 'hidden';

  /* Push a history entry so the mobile back button closes the modal
     instead of navigating away from the page */
  history.pushState({ villaModal: true }, '');
}

function closeModal() {
  backdrop.classList.remove('open');
  document.body.style.overflow = '';
}

/* Intercept the browser Back button — if our modal state is active,
   close the modal instead of leaving the page */
window.addEventListener('popstate', e => {
  if (backdrop.classList.contains('open')) {
    closeModal();
  }
});

/* Attach click and keyboard handlers to all villa cards */
document.querySelectorAll('.villa-card, .uc-card').forEach(card => {
  const open = () => openModal(card.dataset.villa);
  card.addEventListener('click', open);
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
  });
});

/* Close modal via button, backdrop click, or Escape key.
   history.back() triggers popstate which calls closeModal(),
   so we only need to call history.back() when the modal is open. */
function closeModalWithHistory() {
  if (backdrop.classList.contains('open')) {
    history.back(); /* triggers popstate → closeModal() */
  }
}

modalClose.addEventListener('click', closeModalWithHistory);
backdrop.addEventListener('click', e => { if (e.target === backdrop) closeModalWithHistory(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModalWithHistory(); });

/* ============================================================
   7. FORMSPREE AJAX SUBMISSION
   Sends the form to Formspree without a page reload.
   Shows inline success or error message.
   No changes needed here — edit the form action URL in index.html.
============================================================ */
const form       = document.getElementById('contactForm');
const submitBtn  = document.getElementById('submitBtn');
const successMsg = document.getElementById('formSuccess');
const errorMsg   = document.getElementById('formError');

form.addEventListener('submit', async e => {
  e.preventDefault();

  /* Loading state */
  submitBtn.disabled    = true;
  submitBtn.textContent = 'Sending…';
  successMsg.className  = 'form-msg'; /* hide previous messages */
  errorMsg.className    = 'form-msg';

  try {
    const response = await fetch(form.action, {
      method:  'POST',
      body:    new FormData(form),
      headers: { 'Accept': 'application/json' },
    });

    if (response.ok) {
      successMsg.className  = 'form-msg success';
      form.reset();
      submitBtn.textContent = 'Enquiry Sent';
    } else {
      throw new Error('Formspree returned an error');
    }
  } catch {
    errorMsg.className    = 'form-msg error';
    submitBtn.disabled    = false;
    submitBtn.textContent = 'Send Enquiry';
  }
});
