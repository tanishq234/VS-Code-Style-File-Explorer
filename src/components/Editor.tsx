import React, { useEffect, useRef, useState } from 'react';
import { useFileSystem } from '../context/FileSystemContext';
import { getPath } from '../utils/treeUtils';

export const Editor: React.FC = () => {
  const { state, updateContent } = useFileSystem();
  const activeId = state.activeTabId;
  const node = activeId ? state.nodes[activeId] : null;
  const [local, setLocal] = useState<string>('');
  const debounceRef = useRef<number | null>(null);

  useEffect(() => {
    if (node && node.type === 'file') {
      setLocal(node.content ?? '');
    }
  }, [activeId, node?.id]);

  useEffect(() => {
    if (!node || node.type !== 'file') return;
    if (local === (node.content ?? '')) return;
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => {
      updateContent(node.id, local);
    }, 200);
    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, [local]);

  if (!node || node.type !== 'file') {
    return <div className="editor-placeholder">Storebox</div>;
  }

  const lineCount = local.split('\n').length;
  const charCount = local.length;

  return (
    <div className="editor">
      <textarea
        className="editor-textarea"
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        spellCheck={false}
        placeholder={`Start typing in ${node.name}...`}
      />
      <div className="editor-status">
        <span>{getPath(state.nodes, node.id)}</span>
        <span>
          {lineCount} {lineCount === 1 ? 'line' : 'lines'} · {charCount} {charCount === 1 ? 'char' : 'chars'}
        </span>
      </div>
    </div>
  );
};
