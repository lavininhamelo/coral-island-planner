import React from 'react';
import { ItemButton } from './ItemButton';
import type { Item, PlacedItem as PlacedItemType } from '../types';

type SidebarProps = {
  items: Item[];
  selectedItem: Item | null;
  placedItems: PlacedItemType[];
  gridWidth: number;
  gridHeight: number;
  onSelectItem: (item: Item) => void;
  onDeselectItem: () => void;
  onClearAll: () => void;
  deleteMode: boolean;
  onToggleDeleteMode: () => void;
};

export const Sidebar: React.FC<SidebarProps> = ({
  items,
  selectedItem,
  placedItems,
  onSelectItem,
  onDeselectItem,
  onClearAll,
  deleteMode,
  onToggleDeleteMode,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4 lg:w-64 shrink-0">
      <h2 className="text-xl font-semibold mb-3 text-gray-700">Items</h2>
      <div className="space-y-1">
        {items.map(item => (
          <ItemButton
            key={item.id}
            item={item}
            isSelected={selectedItem?.id === item.id}
            onSelect={() => onSelectItem(item)}
          />
        ))}
      </div>

      {selectedItem && (
        <button
          onClick={onDeselectItem}
          className="w-full mt-4 p-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm font-medium"
        >
          Deselect
        </button>
      )}

      <button
        onClick={onClearAll}
        className="w-full mt-2 p-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm font-medium"
      >
        Clear All
      </button>

      <button
        onClick={onToggleDeleteMode}
        className="w-full mt-2 p-2 bg-orange-100 hover:bg-orange-200 text-orange-700 rounded-lg text-sm font-medium"
      >
        {deleteMode ? 'Disable Delete Mode' : 'Enable Delete Mode'}
      </button>

   
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <h2 className="text-xs text-gray-700 font-bold">Placed Items List</h2>
        <ul className="text-xs text-gray-700 list-disc list-inside py-1">
          {items.map(item => {
            const count = placedItems.filter(pi => pi.id.startsWith(item.id)).length;
            return count > 0 ? (
              <li key={item.id}>
                {item.name}: <span className="font-semibold">{count}</span>
              </li>
            ) : null;
          })}
        </ul>
      </div>
    </div>
  );
};

