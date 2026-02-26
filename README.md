# Creative Hub

A personal hub to store and organize your creative works with links to Google Drive.

## Features

- Add creative works with title, type, description, and Google Drive URL
- Filter by type (Writing, Music, Art, Video, Design, Other)
- Edit and delete works
- Data persists in your browser (LocalStorage)
- Installable as a PWA
- Responsive, accessible design

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Build

```bash
npm run build
```

Output is in `dist/`. Serve with any static host or `npm run preview`.

## Deploy to GitHub Pages

1. Create a new GitHub repo named `creative-hub` (or update `base` in `vite.config.ts` to match your repo name).
2. Push the code to GitHub.
3. In the repo: **Settings → Pages → Source** → select **GitHub Actions**.
4. Pushes to `main` will trigger deployment. The app will be available at `https://<username>.github.io/creative-hub/`.

## Google Drive links

Paste standard share URLs, e.g.:

- `https://drive.google.com/file/d/...`
- `https://drive.google.com/drive/folders/...`
- `https://docs.google.com/...`
