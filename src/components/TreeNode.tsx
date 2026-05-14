import React, { useEffect, useRef, useState } from 'react';
import { FSNode } from '../types';
import { useFileSystem } from '../context/FileSystemContext';
import { getChildren, isNameTaken, validateName } from '../utils/treeUtils';
import { ChevronIcon, FolderIcon, FileIcon } from '../utils/icons';

interface Props {
  node: FSNode;
  depth: number;
  onContextMenu: (e: React.MouseEvent, node: FSNode) => void;
  renamingId: string | null;
  setRenamingId: (id: string | null) => void;
  creatingIn: { parentId: string | null; type: 'file' | 'folder' } | null;
  setCreatingIn: (v: { parentId: string | null; type: 'file' | 'folder' } | null) => void;
}

export const TreeNode: React.FC<Props> = ({
  node,
  depth,
  onContextMenu,
  renamingId,
  setRenamingId,
  creatingIn,
  setCreatingIn,
}) => {
  const { state, toggleExpand, openTab, renameNode, createNode } = useFileSystem();
  const isExpanded = !!state.expanded[node.id];
  const isActive = state.activeTabId === node.id;
  const isRenaming = renamingId === node.id;

  const [editValue, setEditValue] = useState(node.name);
  const [editError, setEditError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isRenaming) {
      setEditValue(node.name);
      setEditError(null);
      setTimeout(() => {
        inputRef.current?.focus();
        const dot = node.name.lastIndexOf('.');
        if (node.type === 'file' && dot > 0) {
          inputRef.current?.setSelectionRange(0, dot);
        } else {
          inputRef.current?.select();
        }
      }, 0);
    }
  }, [isRenaming, node.name, node.type]);

  const handleClick = () => {
    if (isRenaming) return;
    if (node.type === 'folder') {
      toggleExpand(node.id);
    } else {
      openTab(node.id);
    }
  };

  const commitRename = () => {
    const v = editValue.trim();
    if (v === node.name) {
      setRenamingId(null);
      return;
    }
    const validation = validateName(v);
    if (validation) {
      setEditError(validation);
      return;
    }
    if (isNameTaken(state.nodes, node.parentId, v, node.id)) {
      setEditError('A file or folder with that name already exists.');
      return;
    }
    renameNode(node.id, v);
    setRenamingId(null);
  };

  const cancelRename = () => {
    setRenamingId(null);
    setEditError(null);
  };

  const children = node.type === 'folder' ? getChildren(state.nodes, node.id) : [];
  const indent = depth * 12 + 8;

  return (
    <>
      <div
        className={`tree-node ${isActive ? 'active' : ''}`}
        style={{ paddingLeft: indent }}
        onClick={handleClick}
        onContextMenu={(e) => onContextMenu(e, node)}
      >
        {node.type === 'folder' ? (
          <span className="tree-node-chevron">
            <ChevronIcon open={isExpanded} />
          </span>
        ) : (
          <span className="tree-node-chevron" />
        )}
        <span className="tree-node-icon">
          {node.type === 'folder' ? <FolderIcon open={isExpanded} /> : <FileIcon />}
        </span>
        {isRenaming ? (
          <>
            <input
              ref={inputRef}
              className={`tree-node-input ${editError ? 'error' : ''}`}
              value={editValue}
              onChange={(e) => {
                setEditValue(e.target.value);
                setEditError(null);
              }}
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => {
                if (e.key === 'Enter') commitRename();
                if (e.key === 'Escape') cancelRename();
              }}
              onBlur={commitRename}
            />
            {editError && <div className="tree-input-error">{editError}</div>}
          </>
        ) : (
          <span className="tree-node-label" title={node.name}>
            {node.name}
          </span>
        )}
      </div>
      {node.type === 'folder' && isExpanded && (
        <>
          {creatingIn && creatingIn.parentId === node.id && (
            <InlineCreator
              depth={depth + 1}
              type={creatingIn.type}
              parentId={node.id}
              onDone={() => setCreatingIn(null)}
              onCreate={(name) => createNode(name, creatingIn.type, node.id)}
            />
          )}
          {children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              depth={depth + 1}
              onContextMenu={onContextMenu}
              renamingId={renamingId}
              setRenamingId={setRenamingId}
              creatingIn={creatingIn}
              setCreatingIn={setCreatingIn}
            />
          ))}
        </>
      )}
    </>
  );
};

interface InlineCreatorProps {
  depth: number;
  type: 'file' | 'folder';
  parentId: string | null;
  onDone: () => void;
  onCreate: (name: string) => void;
}

export const InlineCreator: React.FC<InlineCreatorProps> = ({
  depth,
  type,
  parentId,
  onDone,
  onCreate,
}) => {
  const { state } = useFileSystem();
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const committedRef = useRef(false);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const commit = () => {
    if (committedRef.current) return;
    const v = value.trim();
    if (!v) {
      onDone();
      return;
    }
    const validation = validateName(v);
    if (validation) {
      setError(validation);
      return;
    }
    if (isNameTaken(state.nodes, parentId, v)) {
      setError('A file or folder with that name already exists.');
      return;
    }
    committedRef.current = true;
    onCreate(v);
    onDone();
  };

  const indent = depth * 12 + 8;

  return (
    <div className="tree-node" style={{ paddingLeft: indent }}>
      <span className="tree-node-chevron" />
      <span className="tree-node-icon">
        {type === 'folder' ? <FolderIcon open={false} /> : <FileIcon />}
      </span>
      <input
        ref={inputRef}
        className={`tree-node-input ${error ? 'error' : ''}`}
        value={value}
        placeholder={type === 'folder' ? 'folder name' : 'file name'}
        onChange={(e) => {
          setValue(e.target.value);
          setError(null);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') commit();
          if (e.key === 'Escape') onDone();
        }}
        onBlur={commit}
      />
      {error && <div className="tree-input-error">{error}</div>}
    </div>
  );
};
