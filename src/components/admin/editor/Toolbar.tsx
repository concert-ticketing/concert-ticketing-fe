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

export default function Toolbar({ setSelectedTool, selectedTool }: ToolbarProps) {
  return (
    <div className={styles.toolbar}>
      <button
        onClick={() => setSelectedTool('rect')}
        className={selectedTool === 'rect' ? styles.active : ''}
      >
        <Image src={squareIcon} alt='square icon' priority />
      </button>
      <button
        onClick={() => setSelectedTool('circle')}
        className={selectedTool === 'circle' ? styles.active : ''}
      >
        <Image src={circleIcon} alt='circle icon' priority />
      </button>
      <button
        onClick={() => setSelectedTool('text')}
        className={selectedTool === 'text' ? styles.active : ''}
      >
        <Image src={textIcon} alt='text icon' priority />
      </button>
      <button
        onClick={() => setSelectedTool('polygon')}
        className={selectedTool === 'polygon' ? styles.active : ''}
      >
        <Image src={polygonIcon} alt='polygon icon' priority />
      </button>
      <button
        onClick={() => setSelectedTool(null)}
        className={selectedTool === null ? styles.active : ''}
      >
        <Image src={pointerIcon} alt='pointer icon' priority />
      </button>
    </div>
  );
}
