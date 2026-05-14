import React, { useEffect, useRef } from 'react';

export interface MenuItem {
  label: string;
  onClick: () => void;
  shortcut?: string;
  danger?: boolean;
  separatorBefore?: boolean;
  disabled?: boolean;
}

interface Props {
  x: number;
  y: number;
  items: MenuItem[];
  onClose: () => void;
}

export const ContextMenu: React.FC<Props> = ({ x, y, items, onClose }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('mousedown', handleClick);
    window.addEventListener('keydown', handleKey);
    return () => {
      window.removeEventListener('mousedown', handleClick);
      window.removeEventListener('keydown', handleKey);
    };
  }, [onClose]);

  const adjustedX = Math.min(x, window.innerWidth - 220);
  const adjustedY = Math.min(y, window.innerHeight - items.length * 32 - 20);

  return (
    <div
      ref={ref}
      className="context-menu"
      style={{ left: adjustedX, top: adjustedY }}
    >
      {items.map((item, i) => (
        <React.Fragment key={i}>
          {item.separatorBefore && <div className="context-menu-separator" />}
          <div
            className={`context-menu-item ${item.danger ? 'danger' : ''}`}
            onClick={() => {
              if (item.disabled) return;
              item.onClick();
              onClose();
            }}
            style={item.disabled ? { opacity: 0.4, pointerEvents: 'none' } : {}}
          >
            <span>{item.label}</span>
            {item.shortcut && <span style={{ opacity: 0.6 }}>{item.shortcut}</span>}
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};
