import React, { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import { FSMap, FSNode, FileSystemState, NodeType } from '../types';
import { collectDescendants, uid } from '../utils/treeUtils';

const STORAGE_KEY = 'storebox-file-explorer-v1';

type Action =
  | { type: 'CREATE'; payload: { name: string; nodeType: NodeType; parentId: string | null } }
  | { type: 'RENAME'; payload: { id: string; name: string } }
  | { type: 'DELETE'; payload: { id: string } }
  | { type: 'UPDATE_CONTENT'; payload: { id: string; content: string } }
  | { type: 'OPEN_TAB'; payload: { id: string } }
  | { type: 'CLOSE_TAB'; payload: { id: string } }
  | { type: 'SET_ACTIVE_TAB'; payload: { id: string | null } }
  | { type: 'TOGGLE_EXPAND'; payload: { id: string } }
  | { type: 'SET_EXPANDED'; payload: { id: string; value: boolean } }
  | { type: 'HYDRATE'; payload: FileSystemState };

const initialState: FileSystemState = {
  nodes: {},
  openTabs: [],
  activeTabId: null,
  expanded: {},
};

const reducer = (state: FileSystemState, action: Action): FileSystemState => {
  switch (action.type) {
    case 'HYDRATE':
      return action.payload;

    case 'CREATE': {
      const { name, nodeType, parentId } = action.payload;
      const id = uid();
      const now = Date.now();
      const node: FSNode = {
        id,
        name: name.trim(),
        type: nodeType,
        parentId,
        content: nodeType === 'file' ? '' : undefined,
        createdAt: now,
        updatedAt: now,
      };
      const nodes: FSMap = { ...state.nodes, [id]: node };
      const expanded = parentId
        ? { ...state.expanded, [parentId]: true }
        : state.expanded;
      return { ...state, nodes, expanded };
    }

    case 'RENAME': {
      const { id, name } = action.payload;
      const existing = state.nodes[id];
      if (!existing) return state;
      const updated: FSNode = { ...existing, name: name.trim(), updatedAt: Date.now() };
      return { ...state, nodes: { ...state.nodes, [id]: updated } };
    }

    case 'DELETE': {
      const { id } = action.payload;
      if (!state.nodes[id]) return state;
      const descendants = collectDescendants(state.nodes, id);
      const removeIds = new Set<string>([id, ...descendants]);
      const nodes: FSMap = {};
      for (const k of Object.keys(state.nodes)) {
        if (!removeIds.has(k)) nodes[k] = state.nodes[k];
      }
      const openTabs = state.openTabs.filter((t) => !removeIds.has(t));
      const activeTabId =
        state.activeTabId && removeIds.has(state.activeTabId)
          ? openTabs[openTabs.length - 1] ?? null
          : state.activeTabId;
      const expanded: Record<string, boolean> = {};
      for (const k of Object.keys(state.expanded)) {
        if (!removeIds.has(k)) expanded[k] = state.expanded[k];
      }
      return { ...state, nodes, openTabs, activeTabId, expanded };
    }

    case 'UPDATE_CONTENT': {
      const { id, content } = action.payload;
      const existing = state.nodes[id];
      if (!existing || existing.type !== 'file') return state;
      const updated: FSNode = { ...existing, content, updatedAt: Date.now() };
      return { ...state, nodes: { ...state.nodes, [id]: updated } };
    }

    case 'OPEN_TAB': {
      const { id } = action.payload;
      const node = state.nodes[id];
      if (!node || node.type !== 'file') return state;
      const openTabs = state.openTabs.includes(id) ? state.openTabs : [...state.openTabs, id];
      return { ...state, openTabs, activeTabId: id };
    }

    case 'CLOSE_TAB': {
      const { id } = action.payload;
      const idx = state.openTabs.indexOf(id);
      if (idx === -1) return state;
      const openTabs = state.openTabs.filter((t) => t !== id);
      let activeTabId = state.activeTabId;
      if (activeTabId === id) {
        activeTabId = openTabs[idx] ?? openTabs[idx - 1] ?? null;
      }
      return { ...state, openTabs, activeTabId };
    }

    case 'SET_ACTIVE_TAB':
      return { ...state, activeTabId: action.payload.id };

    case 'TOGGLE_EXPAND': {
      const { id } = action.payload;
      return { ...state, expanded: { ...state.expanded, [id]: !state.expanded[id] } };
    }

    case 'SET_EXPANDED': {
      const { id, value } = action.payload;
      return { ...state, expanded: { ...state.expanded, [id]: value } };
    }

    default:
      return state;
  }
};

interface ContextValue {
  state: FileSystemState;
  createNode: (name: string, type: NodeType, parentId: string | null) => void;
  renameNode: (id: string, name: string) => void;
  deleteNode: (id: string) => void;
  updateContent: (id: string, content: string) => void;
  openTab: (id: string) => void;
  closeTab: (id: string) => void;
  setActiveTab: (id: string | null) => void;
  toggleExpand: (id: string) => void;
  setExpanded: (id: string, value: boolean) => void;
}

const FileSystemContext = createContext<ContextValue | null>(null);

export const FileSystemProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as FileSystemState;
        if (parsed && typeof parsed === 'object' && parsed.nodes) {
          dispatch({ type: 'HYDRATE', payload: parsed });
        }
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore
    }
  }, [state]);

  const value = useMemo<ContextValue>(
    () => ({
      state,
      createNode: (name, type, parentId) =>
        dispatch({ type: 'CREATE', payload: { name, nodeType: type, parentId } }),
      renameNode: (id, name) => dispatch({ type: 'RENAME', payload: { id, name } }),
      deleteNode: (id) => dispatch({ type: 'DELETE', payload: { id } }),
      updateContent: (id, content) =>
        dispatch({ type: 'UPDATE_CONTENT', payload: { id, content } }),
      openTab: (id) => dispatch({ type: 'OPEN_TAB', payload: { id } }),
      closeTab: (id) => dispatch({ type: 'CLOSE_TAB', payload: { id } }),
      setActiveTab: (id) => dispatch({ type: 'SET_ACTIVE_TAB', payload: { id } }),
      toggleExpand: (id) => dispatch({ type: 'TOGGLE_EXPAND', payload: { id } }),
      setExpanded: (id, value) =>
        dispatch({ type: 'SET_EXPANDED', payload: { id, value } }),
    }),
    [state]
  );

  return <FileSystemContext.Provider value={value}>{children}</FileSystemContext.Provider>;
};

export const useFileSystem = (): ContextValue => {
  const ctx = useContext(FileSystemContext);
  if (!ctx) throw new Error('useFileSystem must be used inside FileSystemProvider');
  return ctx;
};
