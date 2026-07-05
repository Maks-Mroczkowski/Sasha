# Sasha — Portfolio site

A single-page, bilingual (EN / PT-BR) static website. No framework, no build step:
plain `index.html` + CSS + JS + per-locale JSON. Host it anywhere that serves static
files.

## What's here

```
site/                     ← this folder is the whole website; deploy it as-is
  index.html              markup (Portuguese baked in for first paint + no-JS + SEO)
  favicon.svg
  netlify.toml            deploy config (publish = this folder)
  assets/
    css/style.css         keyframes, media queries, reduced-motion fallback
    js/main.js            all behaviour: i18n, toggles, scroll animations, form
    i18n/en.json          English copy   ← edit text here
    i18n/pt.json          Portuguese copy ← edit text here
    img/                  all photos, stored locally (no external hot-links)
```

## Preview it locally

JSON is loaded over HTTP, so open it through a tiny local server (not `file://`):

```bash
cd site
python3 -m http.server 8091
# then open http://localhost:8091
```

## How to change things

- **Text / wording:** edit `assets/i18n/en.json` and `assets/i18n/pt.json`. Keys match
  between the two files. The Portuguese also appears in `index.html` (first-paint copy);
  keep it roughly in sync, but the JSON is what the language toggle uses.
- **Contact email:** search `index.html` for `mmroczkowski628@gmail.com` (2 places:
  the Email button and the footer).
- **WhatsApp number:** search `index.html` for `wa.me/447563510096` (2 places). Use the
  international format with no `+` or spaces.
- **Photos:** replace files in `assets/img/` (keep the same filenames), or add new ones
  and update the `src` in `index.html`.
- **Social link:** the footer has a commented-out slot — uncomment it and add the URL.

## Contact form (Web3Forms)

The form posts to [Web3Forms](https://web3forms.com) (free, no account needed).

**One setup step remains:** open `assets/js/main.js`, find

```js
const WEB3FORMS_ACCESS_KEY = 'REPLACE_WITH_YOUR_WEB3FORMS_ACCESS_KEY';
```

and paste in the access key. To get one: go to web3forms.com, enter
`mmroczkowski628@gmail.com`, and the key is emailed to you. Until the key is added, the
form shows a friendly "please email me directly" message instead of sending.

Submissions arrive in that Gmail inbox. A hidden honeypot field filters out bots.

## Deploy

The site is static files, so any of these work (all have free tiers). **Netlify** is the
simplest.

### Netlify (recommended)
1. Create/sign in at [netlify.com](https://www.netlify.com).
2. Easiest: drag the **`site/`** folder onto the "Sites" area of the Netlify dashboard.
   You get a live `*.netlify.app` URL immediately.
3. Or connect the Git repo and set **publish directory = `site`** (already in
   `netlify.toml`). Netlify redeploys on every push.

### Cloudflare Pages / GitHub Pages (alternatives)
- **Cloudflare Pages:** connect the repo, build command = *(none)*, output directory = `site`.
- **GitHub Pages:** push the repo, enable Pages, serve from `/site` (or move the contents
  of `site/` to the repo root first).

### Custom domain
Deploy to the default subdomain first, then add the domain in your host's dashboard and
point DNS at it:
- Apex/root domain → an `A` (or `ALIAS`/`ANAME`) record to the host's IP/target.
- `www` subdomain → a `CNAME` to the host's target.

Netlify/Cloudflare both show the exact record to add and provision HTTPS automatically.

## Notes

- **The three mockups (Maresia, Pousada Vista Azul, Maré Alta) are always in Portuguese**
  by design — they depict Brazilian client sites. Only Sasha's own copy switches with the
  EN/PT toggle.
- **Reduced motion:** visitors with "reduce motion" enabled get a static version (no
  draw-on ink, nudges, peeks, ken-burns, or cursor trail). Don't remove the
  `prefers-reduced-motion` rules.
- **Still worth checking before launch:** a wide-desktop pass (verified on a Retina laptop
  capped at 736 CSS px during the build) and a real-phone pass — the audience browses
  mostly on phones.

## Image credits

The mockup photos are Creative-Commons / public-domain stand-ins from Wikimedia Commons
(the businesses are fictional). Attribution required by the licenses:

| File | Author | License | Source |
|------|--------|---------|--------|
| `buzios-hero.jpg` | larivzn | CC BY-SA 3.0 | [Commons](https://commons.wikimedia.org/wiki/File:Arma%C3%A7%C3%A3o_dos_B%C3%BAzios.jpg) |
| `sand-beach-sunset.jpg` | Manuel Inglez | CC0 | [Commons](https://commons.wikimedia.org/wiki/File:Sand_beach_at_sunset_(Unsplash).jpg) |
| `praia-manguinhos.jpg` | Luis Eduardo Souza | CC BY-SA 4.0 | [Commons](https://commons.wikimedia.org/wiki/File:Praia_de_Manguinhos_-_B%C3%BAzios_RJ.jpg) |
| `seafood-plate.jpg` | Ossewa | CC BY-SA 4.0 | [Commons](https://commons.wikimedia.org/wiki/File:Plate_of_seafood,_Mozambique.jpg) |
| `moqueca-frutos-do-mar.jpg` | "Just a Brazilian man from Brazil" | CC BY 2.0 | [Commons](https://commons.wikimedia.org/wiki/File:Moqueca_de_frutos_do_mar_(seafood_stew,_Brazilian_style)_(51338403464).jpg) |
| `moqueca-cacao.jpg` | Thiago MTB | CC BY-SA 4.0 | [Commons](https://commons.wikimedia.org/wiki/File:Moqueca_de_Ca%C3%A7%C3%A3o.jpg) |
| `orla-bardot.jpg` | Josue Marinho | CC BY 3.0 | [Commons](https://commons.wikimedia.org/wiki/File:Buzios_RJ_Brasil_-_Orla_Bardot_-_panoramio.jpg) |
| `big-wave.jpg` | Dani Tic | CC BY-SA 2.0 | [Commons](https://commons.wikimedia.org/wiki/File:Big_wave.jpg) |
| `wave.jpg` | ESO/Max Alexander (der. MariaCasandra) | CC BY 4.0 | [Commons](https://commons.wikimedia.org/wiki/File:Wave.jpg) |
| `hotel-room-1.jpg` | VasoPlevneshi | CC BY-SA 4.0 | [Commons](https://commons.wikimedia.org/wiki/File:Hotel_Room.jpg) |
| `hotel-room-2.jpg` | Dale Cruse | CC BY 2.0 | [Commons](https://commons.wikimedia.org/wiki/File:Hotel_room.jpg) |
| `beach-surf.jpg` | Debivort | CC BY-SA 3.0 | [Commons](https://commons.wikimedia.org/wiki/File:Beach_surf.jpg) |
| `wetsuit.jpg` | Martijn. (Dutch Wikipedia) | Public domain | [Commons](https://commons.wikimedia.org/wiki/File:Wetsuit.jpg) |
| `t-shirt.jpg` | Lateiner | CC BY-SA 3.0 | [Commons](https://commons.wikimedia.org/wiki/File:T-shirt.jpg) |
| `sweatshirt.jpg` | Ravi312 | CC BY-SA 4.0 | [Commons](https://commons.wikimedia.org/wiki/File:Sweatshirt.jpg) |
| `ray-ban-sunglasses.jpg` | Luxottica | CC BY-SA 3.0 | [Commons](https://commons.wikimedia.org/wiki/File:Ray-Ban_sunglasses.jpg) |
| `g-shock.jpg` | (see file page) | CC BY-SA 3.0 | [Commons](https://commons.wikimedia.org/wiki/File:G-Shock.jpg) |
| `boardshorts.jpg` | Josh Stevenson | CC BY 1.0 | [Commons](https://commons.wikimedia.org/wiki/File:Boardshorts.jpg) |

`assets/img/maks-final.jpg` is Sasha's own portrait (not from Commons).

Best long-term option: swap these stand-ins for the client's / Sasha's own photos, which
removes the attribution requirement entirely.

Fonts load from Google Fonts + Fontshare CDNs (Shantell Sans, Permanent Marker, Cormorant
Garamond, Bebas Neue, Inter, General Sans).
