import React from 'react';
import { useFileSystem } from '../context/FileSystemContext';
import { CloseIcon, FileIcon } from '../utils/icons';

export const Tabs: React.FC = () => {
  const { state, setActiveTab, closeTab } = useFileSystem();

  if (state.openTabs.length === 0) return null;

  return (
    <div className="tabs">
      {state.openTabs.map((id) => {
        const node = state.nodes[id];
        if (!node) return null;
        const isActive = state.activeTabId === id;
        return (
          <div
            key={id}
            className={`tab ${isActive ? 'active' : ''}`}
            onClick={() => setActiveTab(id)}
          >
            <FileIcon />
            <span>{node.name}</span>
            <button
              className="tab-close"
              onClick={(e) => {
                e.stopPropagation();
                closeTab(id);
              }}
              title="Close"
            >
              <CloseIcon />
            </button>
          </div>
        );
      })}
    </div>
  );
};
