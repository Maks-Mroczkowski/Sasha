# Handoff: Sasha — Personal Portfolio Website

## Overview
A single-page, long-scroll personal portfolio for **Sasha**, a freelance website designer who works mostly with hotels, restaurants, bars, and other small-to-large businesses (many in London; based in Brazil). The site's job: create an instant personal connection, then sell "the transformation" through three interactive case-study mockups. Fully bilingual (English + Brazilian Portuguese) with a live toggle.

**Concept:** "a quiet cream gallery wall someone drew all over" — Apple-grade restraint (generous space, big type, calm scroll motion) with a hand-drawn sharpie/ink layer on top (arrows, circled words, margin notes).

## About the Design Files
The bundled `Sasha Portfolio.dc.html` is a **design reference**, not production code to ship as-is. It is authored as a "Design Component" that renders through a companion runtime (`support.js`) and uses template scaffolding — `{{ … }}` holes, `<sc-if>` / `<sc-for>` blocks, and a `data-props` script tag. Your task is to **recreate this exact design as a conventional static website** (a single self-contained `index.html`, or a small Vite/Astro project — your call), preserving every visual detail, interaction, animation, and both languages. The markup and logic are real HTML/CSS/JS; lift them and strip the scaffolding. There is **no backend**.

## Fidelity
**High-fidelity.** Colors, typography, spacing, animations, and copy are final. Recreate pixel-for-pixel. Do not redesign.

## Tech notes for the rebuild
- All styling in the source is **inline styles** (a Design Component constraint). In your rebuild you may keep inline styles or move them to a stylesheet — visual output must be identical either way. The only non-inline CSS lives in one `<style>` block: `@font-face`/`@keyframes`, a few `@media` responsive overrides, and `.mn-*` helper classes. Replicate those.
- **Template holes → real values.** Every `{{ x }}` reads from a bilingual string object (`STR.en` / `STR.pt`) inside the logic class, plus data objects `SITE`, `HSITE`, `rest`, `hotel`, `mobile`. Move these into `en.json` / `pt.json` and render normally.
- **`<sc-if>` → conditional render; `<sc-for>` → list map.** Straightforward to convert to plain JS/template literals or your framework's equivalents.
- **Language toggle:** a small piece of state (`locale: 'en' | 'pt'`) swaps which string object feeds the page and re-renders. Keep the marker-circle active state on the EN/PT switch in the nav and footer. Default locale is currently **pt** (set via a prop; make it configurable, default your choice).

## Sections (in scroll order)
1. **Nav** (sticky, translucent) — "Sasha" wordmark, section anchors (Work / Services & Prices / Process), EN/PT toggle with a hand-drawn circle on the active language, and a "Let's talk" pill CTA.
2. **Hero** — hand-lettered headline "I make websites people actually remember." with a vermilion sharpie circle on "remember"; Sasha's real photo in a hand-drawn frame with a "that's me 👋" note + arrow; sub-line; two CTAs; a bouncing scroll cue.
3. **About** — first-person paragraph with three underlined sharpie words (**artful · intentional · high-quality**, each a different ink color), then a second paragraph (Cambridge engineering background; works with hotels/restaurants/bars but also tech companies, fight clubs, etc.; mostly London clients).
4. **The Transformation (centerpiece)** — intro line + a privacy disclaimer ("these examples are recreations; real client work kept private"), then the three case studies below.
5. **Case 01 — Creation (restaurant "Maresia"):** a story column (01/02/03 steps that stagger in) + result stats (+36 bookings first month, etc.) beside a **scrollable browser mockup** with a **"Live site / The sketch" toggle**.
6. **Case 02 — Alteration & Improvement (hotel "Pousada Vista Azul"):** a **Before/After toggle**. "Before" = a plain, dated template site carrying four numbered sharpie critique cards connected by hand-drawn string (a "murder-board"); "After" = a premium redesign + a result panel (4 days to redesign, +42% bookings, etc.).
7. **Case 03 — Mobile optimisation (surf shop "Maré Alta", Rip Curl–inspired):** a laptop browser mockup beside **two phones** — a crammed "before" phone and a clean "after" phone, both scrollable — plus an add-on panel ("Phone optimisation, +R$ to be discussed") and owner-friendly stats (e.g. 72% arrive on a phone, −22% abandoned carts).
8. **Two services** — Alteration & Improvement (cobalt-led) vs Creation (vermilion-led), each a distinct card, followed by **one shared price line**: "Most fall between R$ 1,500 – R$ 7,000" with a note that price depends on size, complexity, number of changes, and creativity (big sites take up to a week).
9. **Process** — five steps: Listen → Sketch → Build → Launch → Maintain.
10. **Contact** — heading "Let's create the perfect website for you and your customers, together.", a form (name / business / message) + Email and WhatsApp buttons, with a "go on →" sharpie note by the submit button.
11. **Footer** — wordmark, Email + WhatsApp links (NO Instagram/social unless owner provides — currently a social link placeholder), repeat EN/PT toggle, copyright.

## Interactions & Behavior (all must be preserved)
- **Scroll reveals:** elements fade + rise in as they enter the viewport (ease-out, ~600ms). They re-hide/re-reveal on scroll up as well (not one-shot).
- **Hand-drawn ink:** SVG sharpie strokes (circles, underlines, arrows, frames) that draw themselves in via `stroke-dashoffset` when their target enters view. A marker-texture SVG filter (`feTurbulence`+`feDisplacementMap`) gives the rough edge.
- **Case toggles** (Maresia Live/Sketch, hotel Before/After): big bordered segmented controls with a sharpie "tap to switch" note + arrow. On first scroll-into-view each performs a **one-time "peek"** — auto-flips to the second state and back — so users see the content changes. (Implemented by programmatically clicking the toggle buttons with a delayed return; re-query the button before the return click since the DOM re-renders.)
- **Scrollable mockups:** each scroll frame has a **bottom fade gradient**, a bouncing **"scroll to explore ↕" pill**, and a **one-time gentle scroll-nudge** when it enters view (scrolls down ~74px and springs back). The cue hides once the user actually scrolls that frame.
- **Cursor ink-trail:** subtle colored dots trailing the cursor on desktop (fine pointer only); make it toggleable.
- **Hover states:** dish/room/product cards lift slightly with a shadow on hover; CTA buttons have marker-underline / glow accents.
- **Ken Burns:** slow zoom on hero background photos (`data-kenburns`).
- **`prefers-reduced-motion`:** a full fallback exists — static reveals, no draw-on animations, no nudge/peek, no ken-burns, no cursor trail. **Keep it.**
- **Responsive:** grids collapse to single column on tablet/phone; the hotel "murder-board" cards reflow below the mockup; phones stay centered. A `@media (max-width:600px)` block bumps small secondary text up for mobile legibility and sets form inputs to 16px (prevents iOS zoom). The audience browses primarily on phones — **test mobile carefully.**

## Design Tokens
**Colors** — Paper `#F4EEE2` (bg), Sand `#EBE3D4` (alt bg), Charcoal `#1A1815` (ink/text), Vermilion `#FF4A26` (primary accent/CTAs), Cobalt `#1D4ED8` (secondary/links), Marigold `#FFB22C` (fills/highlights only — never body text), Violet `#7C3AED` (nightlife accent, used sparingly). Distribution ≈ 80% cream+charcoal, 20% accent.

**Typography** —
- Display / hand-lettered headlines + sharpie annotations: **Shantell Sans** (Google Fonts).
- Body / UI / longform: **General Sans** (Fontshare) with **Inter** (Google) fallback.
- Marker scrawl labels: **Permanent Marker** (Google Fonts).
- Serif used inside the restaurant + hotel mockups: **Cormorant Garamond** (Google Fonts).
- Condensed display inside the surf-shop mockup: **Bebas Neue** (Google Fonts).
- Load order and exact `<link>`s are in the source `<head>`; replicate them.

**Type rules:** headlines huge with tight leading; body ≥16–18px, line-height ~1.6; PT strings run ~15–30% longer, so headline/button containers must flex without clipping. Both languages must be tested.

**Radius/shadow:** pill buttons/toggles (border-radius 22–30px); cards 6–18px; mockup browser frames 12–14px; soft long shadows like `0 30px 70px -34px rgba(26,24,21,0.4)`.

## Assets
**Sasha's portrait (real):** `uploads/Maks-Final.jpg` — used in the hero frame. Ship this locally.

**Mockup photos (currently hot-linked from Wikimedia Commons — DOWNLOAD ALL and repoint to local `/assets/img/`):** each URL is `https://commons.wikimedia.org/wiki/Special:FilePath/<FILE>?width=<n>`. Files used:
- `Sand beach at sunset (Unsplash).jpg`
- `Praia de Manguinhos - Búzios RJ.jpg`
- `Buzios RJ Brasil - Orla Bardot - panoramio.jpg`
- `Hotel Room.jpg`, `Hotel room.jpg`
- `Big wave.jpg`, `Wave.jpg`, `Beach surf.jpg`
- `Wetsuit.jpg`, `Boardshorts.jpg`, `T-shirt.jpg`, `G-Shock.jpg`, `Ray-Ban sunglasses.jpg`, `Sweatshirt.jpg`

These are Creative-Commons stand-ins for the mockups. Check each file's license page on Wikimedia and keep attribution if required, **or** (better) replace them with the owner's own photos. Nothing here is real client work — the three businesses (Maresia, Pousada Vista Azul, Maré Alta) are fictional recreations.

**Icons/graphics:** all hand-drawn elements are inline SVG in the markup — no icon library. No emoji beyond the "👋" in the hero note.

## Placeholders to replace with real details
- Contact **email**, **WhatsApp** number, **social** link(s) — currently placeholder text/links.
- Contact **form** — currently only shows a thank-you message; wire to Formspree/Getform/Web3Forms or a mailto/WhatsApp handoff.
- Confirm the **price range** and the **case-study stats** (they're plausible placeholders).

## Files in this bundle
- `Sasha Portfolio.dc.html` — the full design (all sections, logic, both languages).
- `support.js` — the Design Component runtime the `.dc.html` needs to render **as a reference in the browser**. Do not ship it; it's here only so you can open and study the design.
- `AGENT_PROMPT.md` — the task prompt to drive the build.
- `uploads/Maks-Final.jpg` — Sasha's real portrait photo.

## Deployment
Static hosting: Netlify, Vercel, Cloudflare Pages, or GitHub Pages (all have free tiers). Drag-drop the built output or connect a repo. Point the owner's custom domain via one DNS record. Produce a live URL and test on a real phone.
