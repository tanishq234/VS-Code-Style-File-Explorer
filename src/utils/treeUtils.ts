import { FSMap, FSNode } from '../types';

export const uid = (): string =>
  Date.now().toString(36) + Math.random().toString(36).slice(2, 10);

export const getChildren = (nodes: FSMap, parentId: string | null): FSNode[] => {
  const list = Object.values(nodes).filter((n) => n.parentId === parentId);
  return list.sort((a, b) => {
    if (a.type !== b.type) return a.type === 'folder' ? -1 : 1;
    return a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' });
  });
};

export const collectDescendants = (nodes: FSMap, id: string): string[] => {
  const out: string[] = [];
  const stack = [id];
  while (stack.length) {
    const cur = stack.pop()!;
    const kids = Object.values(nodes).filter((n) => n.parentId === cur);
    for (const k of kids) {
      out.push(k.id);
      if (k.type === 'folder') stack.push(k.id);
    }
  }
  return out;
};

export const isNameTaken = (
  nodes: FSMap,
  parentId: string | null,
  name: string,
  ignoreId?: string
): boolean => {
  const t = name.trim().toLowerCase();
  return Object.values(nodes).some(
    (n) =>
      n.parentId === parentId &&
      n.id !== ignoreId &&
      n.name.toLowerCase() === t
  );
};

export const validateName = (name: string): string | null => {
  const t = name.trim();
  if (!t) return 'Name cannot be empty.';
  if (t.length > 100) return 'Name is too long (max 100 chars).';
  if (/[\\/:*?"<>|]/.test(t)) return 'Invalid characters: \\ / : * ? " < > |';
  return null;
};

export const getPath = (nodes: FSMap, id: string): string => {
  const parts: string[] = [];
  let cur: FSNode | undefined = nodes[id];
  while (cur) {
    parts.unshift(cur.name);
    cur = cur.parentId ? nodes[cur.parentId] : undefined;
  }
  return '/' + parts.join('/');
};
