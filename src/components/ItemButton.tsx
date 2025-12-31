import React from 'react';
import type { Item } from '../types';

type ItemButtonProps = {
  item: Item;
  isSelected: boolean;
  onSelect: () => void;
};

export const ItemButton: React.FC<ItemButtonProps> = ({ item, isSelected, onSelect }) => {
  return (
    <button
      onClick={onSelect}
      className={`w-full px-2 py-1 rounded-lg border-2 transition-all text-left ${
        isSelected
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-200 hover:border-gray-300'
      }`}
    >
      <div className="flex items-center gap-2">
        <span className="text-2xl">{item.icon}</span>
        <div className="flex-1">
          <div className="font-medium text-sm">{item.name}</div>
          <div className="text-xs text-gray-500">Range: {item.size}×{item.size}</div>
        </div>
      </div>
    </button>
  );
};

