# Lumina Studio — Interactive Trainer

A fully client-side app for building gamified, responsive training courses with custom layouts, flashcards, quizzes, quick-reference summaries, printable certificates, and SCORM 1.2 / 2004 LMS export.

No API keys or server required. Everything runs in the browser.

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   `npm install`
2. Start the dev server:
   `npm run dev`
3. Open http://localhost:3000

## Deploy

Build a production-ready static bundle:

```
npm run build
```

The `dist/` folder contains a fully standalone static site. Deploy it to any static host:
- **Netlify**: drag-and-drop the `dist/` folder at netlify.com/drop
- **GitHub Pages**: push `dist/` contents to a `gh-pages` branch
- **Vercel**: `vercel --prod` from the project root
- **Any web server**: copy `dist/` to your server's public directory

## Features

- 8 interactive section layout types (video, table, flip-cards, bento grid, timeline, code/quote spotlight, tabbed dive, Q&A accordion)
- Quiz assessments with XP scoring and auto-progression
- Flippable study flashcards
- Dark/light mode + 3 WCAG-compliant color themes
- Drag-and-drop section reordering
- Export as standalone HTML file or SCORM 1.2 / 2004 ZIP
- Import/export course drafts as JSON
- Printable completion certificate
