---
name: frontend-design
description: Ciel Homes design system — luxury nature theme. Use whenever building or restyling any UI in this project (tokens, type, spacing, motion, accessibility).
---

# Ciel Homes — frontend design rules

Static site (index.html, styles.css, script.js, motion.js). No build step. Do not add frameworks.

## Aesthetic
Quiet luxury + nature: deep forest green, antique gold, ivory. Editorial serif headlines, calm sans body.
Avoid: purple/blue gradients, emoji icons, rounded "SaaS" cards, drop-shadow soup, centered-everything layouts.

## Tokens (styles.css `:root` — never hard-code hex elsewhere)
- Surfaces: `--deep` (page), `--forest` (raised), `--mid`
- Text: `--cream` (headings), `--text` (body, 11:1), `--muted` (secondary, 7.7:1)
- Accent: `--gold` / `--gold-lt` (CTAs, numerals), `--leaf` (small labels), `--sage` (decorative lines only)
- Motion: `--ease-out: cubic-bezier(.22,1,.36,1)`, `--dur: .7s`

## Type
- Display: Cormorant Garamond, 400, lining numerals; italic + `--gold-lt` for the one emphasised word.
- Body: DM Sans 400 (never 300). Body 17–18px, nothing under 14px.
- Eyebrows: 13–14px, uppercase, 2.5px tracking.

## Spacing
8px base grid. Section padding 120px desktop / 72px mobile. Hairline borders `rgba(74,122,90,.25)`.

## Accessibility (primary audience is 30–60 on phones)
- Text contrast >= 4.5:1; touch targets >= 48px; visible focus ring (3px gold).
- Text never sits directly on photos on mobile.
- Every animation must respect `prefers-reduced-motion`.

## Motion
- Library: `motion` (Framer Motion's vanilla engine) loaded as ES module in motion.js.
- Scroll reveals ease-out, 24px travel, staggered 80–120ms. Hover: 200–300ms, transform/opacity only.
- Motion is progressive enhancement: the page must be fully usable if motion.js fails to load.

## Components
Buttons: gold solid (primary), outlined (ghost). Cards: photo first, hairline border, subtle lift on hover.
