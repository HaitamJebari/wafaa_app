# WAFAA — HTML / CSS / JavaScript

This is the standalone static version of the WAFAA website.

## Files

- `index.html` — page structure and content
- `styles.css` — responsive visual design and scroll animations
- `script.js` — mobile navigation, accordions, form tabs and interactions
- `assets/` — WAFAA images and logo

## Run locally

Open `index.html` directly in a browser, or start a simple local server:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

The visual website works as a static site. The contact form requires the original Express backend endpoint `/api/follow-up` to send owner notifications; without that backend, the form still shows the confirmation experience.
