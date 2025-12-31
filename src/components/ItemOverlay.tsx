import React from 'react';
import { Trash2 } from 'lucide-react';
import type { PlacedItem as PlacedItemType } from '../types';

type ItemOverlayProps = {
  item: PlacedItemType;
  gridSize: number;
  deleteMode: boolean;
  hasSelectedItem: boolean;
  onRemove: (itemId: string) => void;
  onMove: (item: PlacedItemType) => void;
};

export const ItemOverlay: React.FC<ItemOverlayProps> = ({
  item,
  gridSize,
  deleteMode,
  hasSelectedItem,
  onRemove,
  onMove,
}) => {
  const centerX = item.x + Math.floor(item.size / 2);
  const centerY = item.y + Math.floor(item.size / 2);

  const shouldCaptureEvents = !hasSelectedItem || deleteMode;

  return (
    <>
      <div
        className="absolute group"
        style={{
          left: item.x * gridSize,
          top: item.y * gridSize,
          width: item.size * gridSize,
          height: item.size * gridSize,
          zIndex: 35,
          pointerEvents: shouldCaptureEvents ? 'auto' : 'none',
        }}
        onClick={(e) => {
          if (!shouldCaptureEvents) return;
          e.stopPropagation();
          if (deleteMode) {
            onRemove(item.id);
          } else {
            onMove(item);
          }
        }}
      >
        {deleteMode && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove(item.id);
            }}
            className="absolute bg-red-500 text-white p-1 rounded-full shadow-lg z-40"
            style={{
              left: centerX * gridSize - item.x * gridSize - 8,
              top: centerY * gridSize - item.y * gridSize - 8,
            }}
          >
            <Trash2 size={12} />
          </button>
        )}
      </div>
      
      {!hasSelectedItem && !deleteMode && (
        <div
          className="absolute cursor-pointer hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onMove(item);
          }}
          style={{
            left: centerX * gridSize - gridSize / 4,
            top: centerY * gridSize - gridSize / 4,
            width: gridSize / 2,
            height: gridSize / 2,
            zIndex: 36,
            pointerEvents: 'auto',
          }}
        />
      )}
    </>
  );
};

