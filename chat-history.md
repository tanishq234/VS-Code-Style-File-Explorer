
I used **Claude (Anthropic)** to help me scaffold and build this assignment.

## Prompt 1

> Read the Storebox frontend take-home PDF. Build a VS Code–style file explorer as a web app supporting: create file, create folder, edit file, edit folder, delete file, delete folder. Home screen must have two buttons (create file / create folder). Folders must nest. No ready-made tree libraries (no react-arborist, rc-tree, react-complex-tree). Must be deployable to Vercel/Netlify/GH Pages.

### Claude's response (summary)

Recommended **React + Vite + TypeScript** because it is:
- A simple, well-known stack reviewers can run instantly.
- Builds to a static `dist/` folder → trivial to deploy on Vercel, Netlify, Render, or GitHub Pages.
- TypeScript adds clarity for the data model.

Proposed an architecture:
- A **normalized state shape**: `{ nodes: { [id]: FSNode }, openTabs, activeTabId, expanded }` instead of a recursively nested tree. This makes create/rename/delete O(1) on the node and avoids deep cloning.
- A **reducer + context** pattern for state.
- The tree is built **from scratch** in `TreeNode.tsx` using recursive React components.
- LocalStorage persistence via `useEffect`.

## Prompt 2

> Mirror VS Code's UX — activity bar, explorer panel, tabs, editor, inline rename, inline create, right-click context menu, confirmation on delete, name validation.

### Claude's response (summary)

Implemented:
- `Sidebar` with section header buttons (New File / New Folder icons that appear like VS Code).
- `TreeNode` recursively renders folders and files; folder click toggles expand; file click opens a tab.
- `InlineCreator` is rendered as a child of a folder (or at the root) when the user clicks "New File/Folder". It auto-focuses an input. On Enter it commits, on Escape it cancels, on blur it commits silently if the name is valid.
- Rename uses the same pattern: clicking "Rename" puts the node into inline edit mode and selects the basename (not the extension) — same as VS Code.
- `ContextMenu` is a portal-less absolutely-positioned div that listens for outside clicks and Escape.
- `PromptModal` and `ConfirmModal` are used from the Home Screen (since there is no tree yet) and for the delete confirmation.
- Validation: empty names rejected, illegal characters `\ / : * ? " < > |` rejected, duplicate names per parent rejected.

## Prompt 3

> Make sure the deletion of a folder also deletes all descendants, removes them from open tabs, and resets the active tab if needed.

### Claude's response (summary)

Wrote a `collectDescendants` utility that walks the tree iteratively. The `DELETE` action removes all descendant IDs from `nodes`, filters them out of `openTabs`, and falls back the active tab to the nearest remaining tab.

## Prompt 4

> Make sure it deploys cleanly. Add `vercel.json` and `netlify.toml`. Use `base: './'` so it also works on GitHub Pages and other subpath hosts.

### Claude's response (summary)

Added both config files, set `base: './'` in `vite.config.ts`, and verified the build outputs to `dist/`.

## Prompt 5

> Final pass: remove all code comments and double-check there are no unused imports or React anti-patterns.

### Claude's response (summary)

- Removed all inline code comments.
- Fixed a stale-closure issue in `Sidebar` where a helper was calling `useFileSystem()` inside a callback — refactored to lift the hook call to the top of the component.
- Verified `useEffect` dependencies are correct (debounced editor save).

## Decisions & Trade-offs

- **Normalized state** chosen over nested tree → faster updates, easier to reason about, no deep-clone bugs.
- **LocalStorage persistence** chosen for simplicity. A backend was out of scope.
- **Plain CSS** chosen over Tailwind/styled-components to keep bundle small and dependencies minimal.
- **No drag-and-drop** to keep scope focused on the required CRUD operations.
- **Debounced autosave** instead of explicit Save button — feels more modern and matches VS Code's editor model (since we don't have a real file system).

## Summary

The full implementation was done by me with Claude as a pair-programming assistant. All architectural decisions, file structure, validation rules, and UI choices were reviewed and adjusted by me before being committed.
