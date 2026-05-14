import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Tabs } from './components/Tabs';
import { Editor } from './components/Editor';
import { HomeScreen } from './components/HomeScreen';
import { ExplorerIcon } from './utils/icons';
import { useFileSystem } from './context/FileSystemContext';
import './App.css';

const App: React.FC = () => {
  const { state } = useFileSystem();
  const hasContent = Object.keys(state.nodes).length > 0;
  const hasActiveFile = state.activeTabId && state.nodes[state.activeTabId]?.type === 'file';

  const [sidebarWidth, setSidebarWidth] = useState<number>(280);
  const resizingRef = useRef(false);

  const onMouseDown = useCallback(() => {
    resizingRef.current = true;
    document.body.style.cursor = 'col-resize';
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!resizingRef.current) return;
      const w = Math.max(180, Math.min(500, e.clientX - 48));
      setSidebarWidth(w);
    };
    const onUp = () => {
      resizingRef.current = false;
      document.body.style.cursor = '';
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, []);

  return (
    <div className="app">
      <div className="activity-bar">
        <div className="activity-icon" title="Explorer">
          <ExplorerIcon />
        </div>
      </div>
      <div style={{ width: sidebarWidth, display: 'flex' }}>
        <Sidebar />
      </div>
      <div className="resizer" onMouseDown={onMouseDown} />
      <div className="main">
        <Tabs />
        {hasActiveFile ? <Editor /> : hasContent ? <Editor /> : <HomeScreen />}
      </div>
    </div>
  );
};

export default App;
