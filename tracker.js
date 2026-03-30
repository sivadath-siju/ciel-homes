/* ============================================================
   CIEL HOMES — tracker.js
   Visitor analytics: tracks page visits, section views,
   clicks, villa opens, and time on page.
   Data is sent automatically to Google Sheets.

   SETUP: Set your Google Apps Script Web App URL below.
   See the setup guide for instructions.
============================================================ */

(function () {

  /* ──────────────────────────────────────────────
     CONFIG — CHANGE THIS after setting up your
     Google Apps Script Web App URL.
  ────────────────────────────────────────────── */
  const SHEET_URL = 'https://script.google.com/macros/s/AKfycbwQhRfMglZmr-58S_cpmRn5I9rOwEzjm87p24d1FmPBJttAbvVcE_DwOPP811MrpSXV/exec';

  /* ──────────────────────────────────────────────
     SESSION SETUP
     A unique ID per visit so you can group events
     from the same user together in the sheet.
  ────────────────────────────────────────────── */
  const sessionId = 'sess_' + Math.random().toString(36).slice(2, 10) + '_' + Date.now();
  const pageStart = Date.now();

  /* ──────────────────────────────────────────────
     DEVICE INFO
  ────────────────────────────────────────────── */
  const device = {
    type:     window.matchMedia('(pointer: coarse)').matches ? 'Mobile' : 'Desktop',
    browser:  getBrowser(),
    screen:   window.screen.width + 'x' + window.screen.height,
    language: navigator.language || 'unknown',
    referrer: document.referrer ? new URL(document.referrer).hostname : 'Direct / None',
  };

  function getBrowser() {
    const ua = navigator.userAgent;
    if (ua.includes('Edg'))     return 'Edge';
    if (ua.includes('Chrome'))  return 'Chrome';
    if (ua.includes('Firefox')) return 'Firefox';
    if (ua.includes('Safari'))  return 'Safari';
    if (ua.includes('OPR'))     return 'Opera';
    return 'Other';
  }

  /* ──────────────────────────────────────────────
     IP GEOLOCATION (free, no API key needed)
     Fetches approximate city & country.
  ────────────────────────────────────────────── */
  let geoCity    = 'Fetching…';
  let geoCountry = 'Fetching…';

  fetch('https://ipapi.co/json/')
    .then(r => r.json())
    .then(d => {
      geoCity    = d.city    || 'Unknown';
      geoCountry = d.country_name || 'Unknown';
    })
    .catch(() => {
      geoCity    = 'Unavailable';
      geoCountry = 'Unavailable';
    });

  /* ──────────────────────────────────────────────
     CORE SEND FUNCTION
     Packages an event and POSTs it to the sheet.
  ────────────────────────────────────────────── */
  function send(eventType, details) {
    if (!SHEET_URL || SHEET_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') return;

    const payload = {
      sessionId,
      timestamp:   new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      eventType,
      details:     details || '',
      city:        geoCity,
      country:     geoCountry,
      deviceType:  device.type,
      browser:     device.browser,
      screen:      device.screen,
      language:    device.language,
      referrer:    device.referrer,
    };

    /* Use sendBeacon for reliability (especially on page unload) */
    const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
    if (navigator.sendBeacon) {
      navigator.sendBeacon(SHEET_URL, blob);
    } else {
      fetch(SHEET_URL, { method: 'POST', body: JSON.stringify(payload), keepalive: true })
        .catch(() => {});
    }
  }

  /* ──────────────────────────────────────────────
     EVENT 1: PAGE VISIT
     Fires immediately on load.
  ────────────────────────────────────────────── */
  window.addEventListener('load', () => {
    send('Page Visit', 'User landed on the website');
  });

  /* ──────────────────────────────────────────────
     EVENT 2: TIME ON PAGE
     Fires when the user leaves / closes the tab.
  ────────────────────────────────────────────── */
  window.addEventListener('pagehide', () => {
    const seconds = Math.round((Date.now() - pageStart) / 1000);
    const mins    = Math.floor(seconds / 60);
    const secs    = seconds % 60;
    const label   = mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
    send('Time on Page', label);
  });

  /* ──────────────────────────────────────────────
     EVENT 3: SECTION SCROLL (which sections they browsed)
     Uses IntersectionObserver to fire once per section.
  ────────────────────────────────────────────── */
  const sectionNames = {
    'home':     'Hero / Home',
    'about':    'About / Philosophy',
    'villas':   'Our Villas',
    'why':      'Why Ciel',
    'location': 'Location',
    'process':  'Our Process',
    'contact':  'Contact Form',
  };

  const sectionObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id    = entry.target.id;
        const label = sectionNames[id] || id;
        send('Section Viewed', label);
        sectionObs.unobserve(entry.target); /* only track once per session */
      }
    });
  }, { threshold: 0.3 });

  Object.keys(sectionNames).forEach(id => {
    const el = document.getElementById(id);
    if (el) sectionObs.observe(el);
  });

  /* ──────────────────────────────────────────────
     EVENT 4: VILLA CARD CLICKS
     Detects which villa modal was opened.
  ────────────────────────────────────────────── */
  const villaLabels = {
    kunnackal: 'Villa 1 (Kunnackal)',
    verdant:   'Villa 2 (Verdant)',
    serene1:   'Villa VI (Serene I)',
    serene2:   'Villa VII (Serene II)',
  };

  document.querySelectorAll('.villa-card, .uc-card').forEach(card => {
    card.addEventListener('click', () => {
      const key   = card.dataset.villa;
      const label = villaLabels[key] || key;
      send('Villa Opened', label);
    });
  });

  /* ──────────────────────────────────────────────
     EVENT 5: CTA BUTTON CLICKS
  ────────────────────────────────────────────── */
  const ctaSelectors = [
    { selector: '.nav-cta',             label: 'Nav — Enquire Now' },
    { selector: '.mobile-nav-cta',      label: 'Mobile Nav — Enquire Now' },
    { selector: 'a[href="#villas"].btn-primary', label: 'Hero — Explore Villas' },
    { selector: 'a[href="#contact"].btn-ghost',  label: 'Hero — Book Consultation' },
    { selector: '#modalEnquireBtn',     label: 'Modal — Enquire About Villa' },
    { selector: '.fsubmit',             label: 'Form — Submit Enquiry' },
  ];

  ctaSelectors.forEach(({ selector, label }) => {
    document.querySelectorAll(selector).forEach(el => {
      el.addEventListener('click', () => send('CTA Clicked', label));
    });
  });

  /* ──────────────────────────────────────────────
     EVENT 6: NAV LINK CLICKS
  ────────────────────────────────────────────── */
  document.querySelectorAll('.nav-links a, .mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => {
      send('Nav Click', link.textContent.trim());
    });
  });

  /* ──────────────────────────────────────────────
     EVENT 7: WHATSAPP & CALL CLICKS
  ────────────────────────────────────────────── */
  document.querySelectorAll('.fab-whatsapp, .mobile-cta-btn.whatsapp').forEach(el => {
    el.addEventListener('click', () => send('WhatsApp Clicked', 'WhatsApp button'));
  });

  document.querySelectorAll('.mobile-cta-btn.call, a[href^="tel:"]').forEach(el => {
    el.addEventListener('click', () => send('Call Clicked', el.href));
  });

  /* ──────────────────────────────────────────────
     EVENT 8: SOCIAL LINK CLICKS
  ────────────────────────────────────────────── */
  document.querySelectorAll('.f-social a').forEach(link => {
    link.addEventListener('click', () => {
      send('Social Clicked', link.textContent.trim());
    });
  });

})();
