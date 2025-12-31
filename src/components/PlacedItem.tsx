import React from 'react';
import type { PlacedItem as PlacedItemType } from '../types';

type PlacedItemProps = {
  item: PlacedItemType;
  gridSize: number;
};

export const PlacedItem: React.FC<PlacedItemProps> = ({ item, gridSize }) => {
  return (
    <div
      className="absolute border-2 pointer-events-none flex items-center justify-center"
      style={{
        left: item.x * gridSize,
        top: item.y * gridSize,
        width: item.size * gridSize,
        height: item.size * gridSize,
        backgroundColor: `${item.color}30`,
        borderColor: `${item.color}60`,
        zIndex: 10,
      }}
    >
      <div
        className="flex items-center justify-center"
        style={{
          width: gridSize,
          height: gridSize,
          backgroundColor: item.color,
          border: '2px solid white',
          borderRadius: '4px',
          zIndex: 30,
        }}
      >
        <span className="text-xl">{item.icon}</span>
      </div>
    </div>
  );
};

