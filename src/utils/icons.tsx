import React from 'react';

export const ChevronIcon = ({ open }: { open: boolean }) => (
  <svg width="10" height="10" viewBox="0 0 16 16" fill="currentColor"
    style={{ transform: open ? 'rotate(90deg)' : 'none', transition: 'transform 0.1s' }}>
    <path d="M5.7 3.3a1 1 0 0 1 1.4 0l4 4a1 1 0 0 1 0 1.4l-4 4a1 1 0 0 1-1.4-1.4L9 8 5.7 4.7a1 1 0 0 1 0-1.4z" />
  </svg>
);

export const FolderIcon = ({ open }: { open: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="#dcb67a">
    {open ? (
      <path d="M14.5 3H7.7L6.3 1.6c-.2-.2-.4-.3-.7-.3H1.5c-.6 0-1 .4-1 1v10c0 .6.4 1 1 1h13c.6 0 1-.4 1-1v-8c0-.6-.4-1-1-1zM1.5 2.3h4l1.4 1.4c.2.2.4.3.7.3h6.9V5H1.5V2.3z" />
    ) : (
      <path d="M14.5 3H7.7L6.3 1.6c-.2-.2-.4-.3-.7-.3H1.5c-.6 0-1 .4-1 1v10c0 .6.4 1 1 1h13c.6 0 1-.4 1-1V4c0-.6-.4-1-1-1z" />
    )}
  </svg>
);

export const FileIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="#75beff">
    <path d="M13.7 4.3l-3-3c-.2-.2-.4-.3-.7-.3H3.5c-.6 0-1 .4-1 1v12c0 .6.4 1 1 1h9c.6 0 1-.4 1-1V5c0-.3-.1-.5-.3-.7zM10 2.4L12.6 5H10V2.4z" />
  </svg>
);

export const NewFileIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M13.7 4.3l-3-3c-.2-.2-.4-.3-.7-.3H3.5c-.6 0-1 .4-1 1v12c0 .6.4 1 1 1h9c.6 0 1-.4 1-1V5c0-.3-.1-.5-.3-.7zM12.5 14h-9V2H9v3.5c0 .3.2.5.5.5H12.5v8zM10 2.7L12.3 5H10V2.7z" />
    <path d="M8.5 8h-1v2h-2v1h2v2h1v-2h2v-1h-2z" />
  </svg>
);

export const NewFolderIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M14.5 3H7.7L6.3 1.6c-.2-.2-.4-.3-.7-.3H1.5c-.6 0-1 .4-1 1v10c0 .6.4 1 1 1h13c.6 0 1-.4 1-1V4c0-.6-.4-1-1-1zm0 9.7H1.5V2.3h4l1.4 1.4c.2.2.4.3.7.3h6.9v8.7z" />
    <path d="M8.5 6h-1v2h-2v1h2v2h1V9h2V8h-2z" />
  </svg>
);

export const CloseIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
    <path d="M8 8.7l3.5 3.5.7-.7L8.7 8l3.5-3.5-.7-.7L8 7.3 4.5 3.8l-.7.7L7.3 8l-3.5 3.5.7.7z" />
  </svg>
);

export const EditIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
    <path d="M13.2 1.8L14.2 2.8c.4.4.4 1 0 1.4L5.5 12.9l-3 1 1-3 8.3-8.3c.4-.4 1-.4 1.4 0z" />
  </svg>
);

export const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
    <path d="M10 3V2c0-.6-.4-1-1-1H7c-.6 0-1 .4-1 1v1H3v1h1v9c0 .6.4 1 1 1h6c.6 0 1-.4 1-1V4h1V3h-3zM7 2h2v1H7V2zm4 11H5V4h6v9z" />
  </svg>
);

export const ExplorerIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.5 0h-9L7 1.5V6H2.5L1 7.5v15.07L2.5 24h12.07L16 22.57V18h4.7l1.3-1.43V4.5L17.5 0zm0 2.12l2.38 2.38H17.5V2.12zm-3 20.38h-12v-15H7v9.07L8.5 18h6v4.5zm6-6h-12v-15H16V6h4.5v10.5z" />
  </svg>
);
