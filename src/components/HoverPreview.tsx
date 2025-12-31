import React from 'react';
import type { Item, Cell } from '../types';

type HoverPreviewProps = {
  hoveredCell: Cell;
  selectedItem: Item;
  isValid: boolean;
  gridSize: number;
};

export const HoverPreview: React.FC<HoverPreviewProps> = ({
  hoveredCell,
  selectedItem,
  isValid,
  gridSize,
}) => {
  return (
    <>
      <div
        className="absolute pointer-events-none border-2"
        style={{
          left: hoveredCell.x * gridSize,
          top: hoveredCell.y * gridSize,
          width: selectedItem.size * gridSize,
          height: selectedItem.size * gridSize,
          backgroundColor: isValid
            ? `${selectedItem.color}40`
            : '#ff000040',
          borderColor: isValid ? selectedItem.color : '#ff0000',
          zIndex: 15,
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          left: (hoveredCell.x + Math.floor(selectedItem.size / 2)) * gridSize,
          top: (hoveredCell.y + Math.floor(selectedItem.size / 2)) * gridSize,
          width: gridSize,
          height: gridSize,
          backgroundColor: isValid ? selectedItem.color : '#ff0000',
          border: '2px solid white',
          zIndex: 25,
        }}
      >
        <div className="flex items-center justify-center h-full text-xl">
          {selectedItem.icon}
        </div>
      </div>
    </>
  );
};

