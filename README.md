# Faysal Ferdous — Cybersecurity Portfolio

Professional static portfolio for GitHub Pages.

## Local preview

```bash
python3 -m http.server 8000
```

Open:

```text
http://localhost:8000
```

## Publish

Upload the contents of this folder to the root of:

```text
https://github.com/faysalferdous/faysalferdous.github.io
```

Required repository structure:

```text
faysalferdous.github.io/
├── index.html
├── styles.css
├── script.js
├── robots.txt
├── sitemap.xml
└── assets/
```

Then configure:

```text
Settings → Pages → Deploy from a branch → main → / (root)
```

Published URL:

```text
https://faysalferdous.github.io/
```

## Add a real profile photo

Place the photo at:

```text
assets/profile.jpg
```

Then change this line in `index.html`:

```html
<img src="assets/profile-placeholder.svg" alt="Abstract digital identity illustration">
```

to:

```html
<img src="assets/profile.jpg" alt="Faysal Ferdous">
```

## Security note

Do not upload credentials, API keys, VPN files, private reports, restricted evidence, unpublished CTF flags or sensitive personal information.
