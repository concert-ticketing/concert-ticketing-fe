import React from 'react';
import Image from 'next/image';

import {
  circleIcon,
  pointerIcon,
  polygonIcon,
  squareIcon,
  textIcon,
} from '@public/icons';

import styles from './toolbar.module.css';

interface ToolbarProps {
  setSelectedTool: (
    tool: 'rect' | 'circle' | 'text' | 'group' | 'polygon' | null,
  ) => void;
  selectedTool: 'rect' | 'circle' | 'text' | 'group' | 'polygon' | null;
}

const tools = [
  { type: 'rect', icon: squareIcon, alt: 'Rectangle', label: '사각형' },
  { type: 'circle', icon: circleIcon, alt: 'Circle', label: '원형' },
  { type: 'text', icon: textIcon, alt: 'Text', label: '텍스트' },
  { type: 'polygon', icon: polygonIcon, alt: 'Polygon', label: '다각형' },
  { type: null, icon: pointerIcon, alt: 'Select', label: '선택' },
] as const;

export default function Toolbar({ setSelectedTool, selectedTool }: ToolbarProps) {
  return (
    <div className={styles.toolbar}>
      <div className={styles.toolbarContainer}>
        {tools.map((tool) => (
          <button
            key={tool.type || 'select'}
            onClick={() => setSelectedTool(tool.type)}
            className={`${styles.toolButton} ${
              selectedTool === tool.type ? styles.active : ''
            }`}
            title={tool.label}
            data-tool={tool.type || 'select'}
          >
            <div className={styles.iconWrapper}>
              <Image
                src={tool.icon}
                alt={tool.alt}
                priority
                className={styles.toolIcon}
              />
            </div>
            <div className={styles.ripple} />
          </button>
        ))}
      </div>
    </div>
  );
}
