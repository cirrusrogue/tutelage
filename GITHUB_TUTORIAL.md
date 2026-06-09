# GitHub Tutorial — Lumina Studio / Interactive Trainer

This guide covers everything you need to manage your project on GitHub using Command Prompt on Windows. No VS Code or other tools required.

---

## Prerequisites

- **Git installed** — verify by running `git --version` in Command Prompt. Download from [git-scm.com](https://git-scm.com) if needed.
- **GitHub account** — [github.com](https://github.com)
- **Your repository** — already set up at `https://github.com/cirrusrogue/tutelage`

---

## Opening a Terminal in Your Project Folder

1. Open **File Explorer**
2. Navigate to `C:\Users\cndro\OneDrive\Desktop\gamified-training-experience-generator`
3. Click the **address bar** at the top
4. Type `cmd` and press **Enter**

Command Prompt opens directly in your project folder. All git commands below assume you're in this folder.

---

## Daily Workflow — Saving Your Changes to GitHub

Every time you make changes to the project, run these three commands:

```
git add .
git commit -m "Brief description of what you changed"
git push
```

### What each command does

| Command | What it does |
|---|---|
| `git add .` | Stages all changed files, telling Git "I want to save these" |
| `git commit -m "..."` | Creates a snapshot of your changes with a label |
| `git push` | Uploads the snapshot to GitHub |

### Good commit message examples
```
git commit -m "Fixed quiz button colors"
git commit -m "Added narration to section 3"
git commit -m "Updated course title and description"
git commit -m "Fixed flashcard overflow on mobile"
```

---

## Checking What's Changed Before You Commit

See which files have been modified since your last commit:
```
git status
```

See the exact line-by-line changes:
```
git diff
```

See your commit history:
```
git log --oneline
```

---

## Building and Deploying the App

### Run the development server (builder UI)
```
npm run dev
```
Then open your browser to `http://localhost:5173`

### Build the static site for deployment
```
npm run build
```
This creates a `dist/` folder with the deployable files.

### Deploy to GitHub Pages (free hosting)

First time only — install the deploy tool:
```
npm install --save-dev gh-pages
```

Then open `package.json` and add this line inside the `"scripts"` section:
```json
"deploy": "gh-pages -d dist"
```

After that, to deploy any time:
```
npm run build
npm run deploy
```

Your live site will be at: `https://cirrusrogue.github.io/tutelage/`

---

## If You Work on a Different Computer

To download the project onto another computer:
```
git clone https://github.com/cirrusrogue/tutelage.git
cd tutelage
npm install
npm run dev
```

---

## Undoing Mistakes

### Undo changes to a file you haven't committed yet
```
git checkout -- src/components/SimulatorPlayer.tsx
```
Replace the filename with whichever file you want to revert.

### Undo ALL uncommitted changes (be careful — permanent)
```
git checkout -- .
```

### See what a file looked like in a previous commit
```
git log --oneline
```
Copy the short commit ID (e.g., `a3f9c12`), then:
```
git show a3f9c12:src/utils/exportBundle.ts
```

### Go back to a previous version entirely (creates a new commit that undoes changes)
```
git revert HEAD
```

---

## Keeping GitHub and Your Computer in Sync

If you ever edit files directly on GitHub.com, pull those changes down before working locally:
```
git pull
```

Always `git pull` before starting work if you've made any changes on GitHub.com or another computer.

---

## Key Files in This Project

| File | What it does |
|---|---|
| `src/App.tsx` | Main builder interface |
| `src/components/SimulatorPlayer.tsx` | In-browser preview of the training |
| `src/components/SectionEditor.tsx` | Section editing panel |
| `src/utils/exportBundle.ts` | Generates the standalone exported HTML training |
| `src/types.ts` | TypeScript type definitions |
| `src/sampleCourse.ts` | Default course that loads on first open |
| `vite.config.ts` | Build configuration |
| `package.json` | Project dependencies and scripts |

---

## Quick Reference Card

```
# Open terminal in project folder
  → File Explorer → address bar → type "cmd" → Enter

# Save changes to GitHub
  git add .
  git commit -m "what you changed"
  git push

# Check what's changed
  git status

# Download latest from GitHub
  git pull

# Run the builder locally
  npm run dev   →   open localhost:5173

# Build for deployment
  npm run build

# Deploy to GitHub Pages
  npm run deploy
```

---

## Troubleshooting

**"not a git repository"** — You're in the wrong folder. Navigate to `C:\Users\cndro\OneDrive\Desktop\gamified-training-experience-generator` first.

**"rejected — fetch first"** — Run `git pull origin main --allow-unrelated-histories` then `git push`.

**"Author identity unknown"** — Run:
```
git config --global user.email "curvesmiddletown@aol.com"
git config --global user.name "Christina"
```

**Login prompt when pushing** — Sign in with your GitHub username and password. If password fails, use a Personal Access Token: GitHub → Settings → Developer Settings → Personal Access Tokens → Generate new token (classic) → check `repo` → use the token as your password.

**`npm run dev` not working** — Make sure you ran `npm install` first.
