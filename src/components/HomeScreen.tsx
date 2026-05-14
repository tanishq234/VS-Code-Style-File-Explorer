import React, { useState } from 'react';
import { useFileSystem } from '../context/FileSystemContext';
import { PromptModal } from './Model';
import { isNameTaken, validateName } from '../utils/treeUtils';
import { NewFileIcon, NewFolderIcon } from '../utils/icons';

export const HomeScreen: React.FC = () => {
  const { state, createNode, openTab } = useFileSystem();
  const [prompt, setPrompt] = useState<'file' | 'folder' | null>(null);

  const handleConfirm = (value: string): string | null => {
    if (!prompt) return null;
    const validation = validateName(value);
    if (validation) return validation;
    if (isNameTaken(state.nodes, null, value)) {
      return 'A file or folder with that name already exists at the root.';
    }
    const before = Object.keys(state.nodes);
    createNode(value, prompt, null);
    setPrompt(null);
    if (prompt === 'file') {
      setTimeout(() => {
        const after = Object.values(state.nodes).find(
          (n) => !before.includes(n.id) && n.name === value.trim()
        );
        if (after) openTab(after.id);
      }, 0);
    }
    return null;
  };

  return (
    <div className="home-screen">
      <div className="home-title">File Explorer</div>
      <div className="home-subtitle">
        A VS Code-style file explorer. Create files and folders, nest them, edit
        file contents, rename and delete — everything is saved to your browser.
      </div>
      <div className="home-actions">
        <button className="btn" onClick={() => setPrompt('file')}>
          <NewFileIcon /> Create File
        </button>
        <button className="btn secondary" onClick={() => setPrompt('folder')}>
          <NewFolderIcon /> Create Folder
        </button>
      </div>
      <div className="home-hint">
        Tip: right-click any folder in the sidebar for more actions.
      </div>

      {prompt && (
        <PromptModal
          title={prompt === 'file' ? 'New File' : 'New Folder'}
          label={
            prompt === 'file'
              ? 'Enter a name for the new file (e.g., notes.txt).'
              : 'Enter a name for the new folder.'
          }
          initialValue={prompt === 'file' ? 'untitled.txt' : 'new-folder'}
          confirmText="Create"
          onConfirm={handleConfirm}
          onClose={() => setPrompt(null)}
        />
      )}
    </div>
  );
};
