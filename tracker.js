/* ============================================================
   CIEL HOMES — tracker.js
   Tracks page visits, section views, clicks, villa opens,
   time on page. Sends data to Google Sheets with
   session color-coding and full geolocation.
============================================================ */

(function () {

  const SHEET_URL = 'https://script.google.com/macros/s/AKfycbzos0t2bKAomrajwJ4thnk8jk2l5w0L4VBqonfczVJGvFk5He8nwxKSzg0TCmrCxSup/exec';

  /* ── SESSION ── */
  const sessionId = 'sess_' + Math.random().toString(36).slice(2, 10) + '_' + Date.now();
  const pageStart = Date.now();

  /* ── DEVICE INFO ── */
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

  /* ── GEOLOCATION (city, region, country, lat, lng) ── */
  let geoCity    = 'Fetching';
  let geoRegion  = 'Fetching';
  let geoCountry = 'Fetching';
  let geoLat     = '';
  let geoLng     = '';

  fetch('https://ipapi.co/json/')
    .then(r => r.json())
    .then(d => {
      geoCity    = d.city         || 'Unknown';
      geoRegion  = d.region       || 'Unknown';
      geoCountry = d.country_name || 'Unknown';
      geoLat     = d.latitude     || '';
      geoLng     = d.longitude    || '';
    })
    .catch(() => {
      geoCity = geoRegion = geoCountry = 'Unavailable';
    });

  /* ── CORE SEND FUNCTION ── */
  function send(eventType, details) {
    if (!SHEET_URL || SHEET_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') return;

    const payload = {
      sessionId,
      timestamp:  new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      eventType,
      details:    details || '',
      city:       geoCity,
      region:     geoRegion,
      country:    geoCountry,
      lat:        geoLat,
      lng:        geoLng,
      deviceType: device.type,
      browser:    device.browser,
      screen:     device.screen,
      language:   device.language,
      referrer:   device.referrer,
    };

    fetch(SHEET_URL, {
      method:  'POST',
      mode:    'no-cors',
      headers: { 'Content-Type': 'text/plain' },
      body:    JSON.stringify(payload),
    }).catch(() => {});
  }

  /* ── EVENT 1: PAGE VISIT ── */
  window.addEventListener('load', () => {
    send('Page Visit', 'User landed on the website');
  });

  /* ── EVENT 2: TIME ON PAGE ── */
  window.addEventListener('pagehide', () => {
    const seconds = Math.round((Date.now() - pageStart) / 1000);
    const mins    = Math.floor(seconds / 60);
    const secs    = seconds % 60;
    send('Time on Page', mins > 0 ? mins + 'm ' + secs + 's' : secs + 's');
  });

  /* ── EVENT 3: SECTION SCROLL ── */
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
        send('Section Viewed', sectionNames[entry.target.id] || entry.target.id);
        sectionObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  Object.keys(sectionNames).forEach(id => {
    const el = document.getElementById(id);
    if (el) sectionObs.observe(el);
  });

  /* ── EVENT 4: VILLA CARD CLICKS ── */
  const villaLabels = {
    kunnackal: 'Villa 1 (Kunnackal)',
    verdant:   'Villa 2 (Verdant)',
    serene1:   'Villa VI (Serene I)',
    serene2:   'Villa VII (Serene II)',
  };

  document.querySelectorAll('.villa-card, .uc-card').forEach(card => {
    card.addEventListener('click', () => {
      send('Villa Opened', villaLabels[card.dataset.villa] || card.dataset.villa);
    });
  });

  /* ── EVENT 5: CTA CLICKS ── */
  [
    { selector: '.nav-cta',                       label: 'Nav — Enquire Now' },
    { selector: '.mobile-nav-cta',                label: 'Mobile Nav — Enquire Now' },
    { selector: 'a[href="#villas"].btn-primary',  label: 'Hero — Explore Villas' },
    { selector: 'a[href="#contact"].btn-ghost',   label: 'Hero — Book Consultation' },
    { selector: '#modalEnquireBtn',               label: 'Modal — Enquire About Villa' },
    { selector: '.fsubmit',                       label: 'Form — Submit Enquiry' },
  ].forEach(function(item) {
    document.querySelectorAll(item.selector).forEach(function(el) {
      el.addEventListener('click', function() { send('CTA Clicked', item.label); });
    });
  });

  /* ── EVENT 6: NAV CLICKS ── */
  document.querySelectorAll('.nav-links a, .mobile-nav-link').forEach(function(link) {
    link.addEventListener('click', function() { send('Nav Click', link.textContent.trim()); });
  });

  /* ── EVENT 7: WHATSAPP & CALL ── */
  document.querySelectorAll('.fab-whatsapp, .mobile-cta-btn.whatsapp').forEach(function(el) {
    el.addEventListener('click', function() { send('WhatsApp Clicked', 'WhatsApp button'); });
  });
  document.querySelectorAll('.mobile-cta-btn.call, a[href^="tel:"]').forEach(function(el) {
    el.addEventListener('click', function() { send('Call Clicked', el.href); });
  });

  /* ── EVENT 8: SOCIAL CLICKS ── */
  document.querySelectorAll('.f-social a').forEach(function(link) {
    link.addEventListener('click', function() { send('Social Clicked', link.textContent.trim()); });
  });

})();
