# File Explorer — Storebox Frontend Take-Home

A VS Code–style file explorer built as a single-page web app. Supports creating, editing, renaming, and deleting files and folders, with unlimited nesting. State persists to `localStorage`.

## Tech Stack

- **React 18** + **TypeScript**
- **Vite** (bundler + dev server)
- Plain CSS (no UI library)
- No ready-made file-tree libraries — the tree is implemented from scratch

## Features

- Home screen with two primary buttons: **Create File** and **Create Folder**
- VS Code-like sidebar with explorer panel, activity bar, tabs, and editor
- Create / rename / delete files and folders
- Nested folders (unlimited depth)
- File content editing with debounced autosave
- Tabs (open multiple files, switch between them, close them)
- Inline rename + inline creation in the tree (like VS Code)
- Right-click context menu on tree nodes (New File, New Folder, Rename, Delete)
- Sidebar resizing
- Name validation (no empty names, no duplicates per folder, no illegal chars)
- Confirmation modal before deleting
- Persists to `localStorage` so your tree survives reloads
- Fully responsive dark theme matching VS Code's look

## Setup

Prerequisites: **Node.js 18+** and **npm**.

```bash
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

## Build

```bash
npm run build
npm run preview
```

The production build is output to the `dist/` folder.

## Deployment

This project deploys with zero config to any static host.

### Vercel
1. Push to a GitHub repo.
2. Import the repo on [vercel.com](https://vercel.com).
3. Framework preset: **Vite**. Build command: `npm run build`. Output: `dist`.
4. Done — `vercel.json` is included.

### Netlify
1. Push to a GitHub repo.
2. New site from Git on [netlify.com](https://netlify.com).
3. Build command: `npm run build`. Publish directory: `dist`.
4. `netlify.toml` is included.

### GitHub Pages
1. `npm run build`
2. Push the `dist/` folder to a `gh-pages` branch, or use a GH Action.
3. `base: './'` is set in `vite.config.ts` so it works on subpaths.

### Render
- New Static Site → build command `npm run build`, publish directory `dist`.

## Project Structure

```
file-explorer/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── vercel.json
├── netlify.toml
├── README.md
├── chat-history.md
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── App.css
    ├── index.css
    ├── types.ts
    ├── context/
    │   └── FileSystemContext.tsx
    ├── utils/
    │   ├── treeUtils.ts
    │   └── icons.tsx
    └── components/
        ├── Sidebar.tsx
        ├── TreeNode.tsx
        ├── HomeScreen.tsx
        ├── Editor.tsx
        ├── Tabs.tsx
        ├── ContextMenu.tsx
        └── Modal.tsx
```

## Rules Compliance

- ✅ No ready-made file-tree libraries used (no react-arborist, rc-tree, react-complex-tree, etc.). The tree is implemented from scratch using React + a normalized id-based data model.
- ✅ Only `react` and `react-dom` as runtime dependencies.
- ✅ Source code is original.
- ✅ `chat-history.md` included.

## Notes

State is stored in a flat normalized map (`{ id -> node }`) with `parentId` references. This makes operations like rename / delete / move efficient and avoids the pitfalls of deeply nested mutations.
