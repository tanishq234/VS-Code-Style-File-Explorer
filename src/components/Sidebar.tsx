import React, { useState } from 'react';
import { useFileSystem } from '../context/FileSystemContext';
import { getChildren } from '../utils/treeUtils';
import { FSNode } from '../types';
import { TreeNode, InlineCreator } from './TreeNode';
import { ContextMenu, MenuItem } from './ContextMenu';
import { ConfirmModal } from './Model';
import { NewFileIcon, NewFolderIcon } from '../utils/icons';

export const Sidebar: React.FC = () => {
  const { state, deleteNode, openTab, createNode, toggleExpand, setExpanded } = useFileSystem();
  const rootNodes = getChildren(state.nodes, null);

  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [creatingIn, setCreatingIn] = useState<
    { parentId: string | null; type: 'file' | 'folder' } | null
  >(null);
  const [menu, setMenu] = useState<{ x: number; y: number; node: FSNode } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<FSNode | null>(null);

  const handleContextMenu = (e: React.MouseEvent, node: FSNode) => {
    e.preventDefault();
    e.stopPropagation();
    setMenu({ x: e.clientX, y: e.clientY, node });
  };

  const startCreate = (type: 'file' | 'folder', parentId: string | null) => {
    if (parentId) {
      const node = state.nodes[parentId];
      if (node && node.type === 'folder' && !state.expanded[parentId]) {
        setExpanded(parentId, true);
      }
    }
    setCreatingIn({ parentId, type });
  };

  const menuItems = (node: FSNode): MenuItem[] => {
    const items: MenuItem[] = [];
    if (node.type === 'folder') {
      items.push({ label: 'New File', onClick: () => startCreate('file', node.id) });
      items.push({ label: 'New Folder', onClick: () => startCreate('folder', node.id) });
    } else {
      items.push({ label: 'Open', onClick: () => openTab(node.id) });
    }
    items.push({
      label: 'Rename',
      shortcut: 'F2',
      onClick: () => setRenamingId(node.id),
      separatorBefore: true,
    });
    items.push({
      label: 'Delete',
      shortcut: 'Del',
      onClick: () => setConfirmDelete(node),
      danger: true,
    });
    return items;
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <span>EXPLORER</span>
      </div>
      <div className="section-title">
        <span>WORKSPACE</span>
        <span className="section-actions">
          <button className="icon-btn" title="New File" onClick={() => startCreate('file', null)}>
            <NewFileIcon />
          </button>
          <button className="icon-btn" title="New Folder" onClick={() => startCreate('folder', null)}>
            <NewFolderIcon />
          </button>
        </span>
      </div>

      <div className="tree">
        {creatingIn && creatingIn.parentId === null && (
          <InlineCreator
            depth={0}
            type={creatingIn.type}
            parentId={null}
            onDone={() => setCreatingIn(null)}
            onCreate={(name) => createNode(name, creatingIn.type, null)}
          />
        )}

        {rootNodes.length === 0 && !creatingIn && (
          <div className="tree-empty">
            No files in workspace.<br />
            Use the buttons above or in the main area to create files and folders.
          </div>
        )}

        {rootNodes.map((n) => (
          <TreeNode
            key={n.id}
            node={n}
            depth={0}
            onContextMenu={handleContextMenu}
            renamingId={renamingId}
            setRenamingId={setRenamingId}
            creatingIn={creatingIn}
            setCreatingIn={setCreatingIn}
          />
        ))}
      </div>

      {menu && (
        <ContextMenu
          x={menu.x}
          y={menu.y}
          items={menuItems(menu.node)}
          onClose={() => setMenu(null)}
        />
      )}

      {confirmDelete && (
        <ConfirmModal
          title="Delete"
          message={
            confirmDelete.type === 'folder'
              ? `Are you sure you want to delete '${confirmDelete.name}' and all of its contents? This cannot be undone.`
              : `Are you sure you want to delete '${confirmDelete.name}'? This cannot be undone.`
          }
          confirmText="Delete"
          danger
          onConfirm={() => {
            deleteNode(confirmDelete.id);
            setConfirmDelete(null);
          }}
          onClose={() => setConfirmDelete(null)}
        />
      )}
    </div>
  );
};
