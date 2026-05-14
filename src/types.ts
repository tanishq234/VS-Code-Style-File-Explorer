export type NodeType = 'file' | 'folder';

export interface FSNode {
  id: string;
  name: string;
  type: NodeType;
  parentId: string | null;
  content?: string;
  createdAt: number;
  updatedAt: number;
}

export type FSMap = Record<string, FSNode>;

export interface FileSystemState {
  nodes: FSMap;
  openTabs: string[];
  activeTabId: string | null;
  expanded: Record<string, boolean>;
}
