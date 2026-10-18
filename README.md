# AI Hristov

A task-oriented directory of 40 AI products across eight categories. Static HTML, CSS and JavaScript: no API key, build step, tracking scripts or paid backend.

## Run

From this directory:

```sh
python3 -m http.server 4200 --bind 127.0.0.1
```

Open http://127.0.0.1:4200. Serve over HTTP; opening index.html as a file cannot load the JSON catalog reliably. This local address only works on the Mac running the server. For public hosting, upload index.html, style.css, app.js, favicon.svg and catalog.json to a static host (including GitHub Pages).

## Features

- Task-keyword search and eight category filters
- Curated or alphabetical ordering
- Saved tools stored only in the current browser
- Compare two or three tools side by side
- Practical use cases, considerations and official links
- Responsive layout, keyboard-operable dialogs, loading-error recovery

Search is keyword matching, not an AI model or exhaustive recommendation system. No affiliate links. Tool plans, regional availability and licensing are deliberately not presented as fixed facts. Recheck provider terms before use.

## Maintain

Edit scripts/make_catalog.py and regenerate with `python3 scripts/make_catalog.py`. Keep the review dates accurate and the count labels in index.html in sync when adding tools. `python3 scripts/check_links.py` writes link-checks.json. Some sites block automated HTTP requests; a 403 is not proof of a dead URL. Official web research supplemented those checks on 2026-10-18. Current names for Mistral Vibe and Gemini Notebook were checked against official sources:

- https://help.mistral.ai/en/articles/682992-le-chat-is-now-vibe
- https://notebook.google/

## Browser verification

With the local server running and Playwright installed:

```sh
PLAYWRIGHT_PATH=/path/to/node_modules/playwright node tests/browser.cjs
```

Checks all 40 destinations for unique HTTPS URLs (not external authentication flows), eight categories, task search, saved persistence, compare limits, keyboard dialogs, mobile overflow and fetch failure/retry. Automated URL checks do not certify every provider's availability or product claims.
