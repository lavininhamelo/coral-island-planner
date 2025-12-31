import React from 'react';
import type { Cell } from '../types';

type GridCellProps = {
  x: number;
  y: number;
  gridSize: number;
  terrainColor: string;
  isBuildable: boolean;
  borderTop?: boolean;
  borderRight?: boolean;
  borderBottom?: boolean;
  borderLeft?: boolean;
  onClick: (x: number, y: number) => void;
  onMouseEnter: (cell: Cell) => void;
  onMouseLeave: () => void;
};

export const GridCell: React.FC<GridCellProps> = ({
  x,
  y,
  gridSize,
  terrainColor,
  isBuildable,
  borderTop = false,
  borderRight = false,
  borderBottom = false,
  borderLeft = false,
  onClick,
  onMouseEnter,
  onMouseLeave,
}) => {
  const borderStyle: React.CSSProperties = {
    boxShadow: `
      ${borderTop ? 'inset 0 2px 0 #4c2902' : 'inset 0 1px 0 rgba(255,255,255,0.3)'},
      ${borderRight ? 'inset -2px 0 0 #4c2902' : 'inset -1px 0 0 rgba(255,255,255,0.3)'},
      ${borderBottom ? 'inset 0 -2px 0 #4c2902' : 'inset 0 -1px 0 rgba(255,255,255,0.3)'},
      ${borderLeft ? 'inset 2px 0 0 #4c2902' : 'inset 1px 0 0 rgba(255,255,255,0.3)'}
    `,
  };
  

  return (
    <div
      onClick={() => onClick(x, y)}
      onMouseEnter={() => onMouseEnter({ x, y })}
      onMouseLeave={onMouseLeave}
      className={`absolute cursor-pointer transition-colors ${
        isBuildable ? 'hover:bg-green-50' : 'opacity-60 cursor-not-allowed'
      }`}
      style={{
        left: x * gridSize,
        top: y * gridSize,
        width: gridSize,
        height: gridSize,
        backgroundColor: terrainColor,
        ...borderStyle,
      }}
    />
  );
};

