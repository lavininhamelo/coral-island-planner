import React from 'react';
import { GridCell } from './GridCell';
import { PlacedItem } from './PlacedItem';
import { HoverPreview } from './HoverPreview';
import { ItemOverlay } from './ItemOverlay';
import type { Item, PlacedItem as PlacedItemType, Cell } from '../types';

type FarmGridProps = {
  gridWidth: number;
  gridHeight: number;
  gridSize: number;
  terrainArr: number[][];
  terrainType: Record<number, { type: string; color: string; buildable: boolean }>;
  placedItems: PlacedItemType[];
  selectedItem: Item | null;
  hoveredCell: Cell | null;
  deleteMode: boolean;
  isHoveredValid: boolean;
  onCellClick: (x: number, y: number) => void;
  onCellHover: (cell: Cell) => void;
  onCellHoverLeave: () => void;
  onRemoveItem: (itemId: string) => void;
  onMoveItem: (item: PlacedItemType) => void;
};

export const FarmGrid: React.FC<FarmGridProps> = ({
  gridWidth,
  gridHeight,
  gridSize,
  terrainArr,
  terrainType,
  placedItems,
  selectedItem,
  hoveredCell,
  deleteMode,
  isHoveredValid,
  onCellClick,
  onCellHover,
  onCellHoverLeave,
  onRemoveItem,
  onMoveItem,
}) => {
  const isCellBuildable = (x: number, y: number): boolean => {
    if (x < 0 || x >= gridWidth || y < 0 || y >= gridHeight) return false;
    const terrainId = terrainArr[y]?.[x] ?? 1;
    const terrain = terrainType[terrainId as keyof typeof terrainType] ?? terrainType[1];
    return terrain.buildable;
  };

  const getBorderInfo = (x: number, y: number) => {
    const currentBuildable = isCellBuildable(x, y);
    if (!currentBuildable) {
      return { borderTop: false, borderRight: false, borderBottom: false, borderLeft: false };
    }

    return {
      borderTop: !isCellBuildable(x, y - 1),
      borderRight: !isCellBuildable(x + 1, y),
      borderBottom: !isCellBuildable(x, y + 1),
      borderLeft: !isCellBuildable(x - 1, y),
    };
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 overflow-auto flex-grow">
      <h2 className="text-xl font-semibold mb-3 text-gray-700">Farm Layout</h2>
      <div
        className="relative inline-block border-2 border-gray-400"
        style={{
          width: gridWidth * gridSize + 4,
          height: gridHeight * gridSize + 4,
        }}
      >
        {Array.from({ length: gridHeight }).map((_, y) =>
          Array.from({ length: gridWidth }).map((_, x) => {
            const terrainId = terrainArr[y]?.[x] ?? 1;
            const terrain = terrainType[terrainId as keyof typeof terrainType] ?? terrainType[1];
            const borderInfo = getBorderInfo(x, y);
            return (
              <GridCell
                key={`${x}-${y}`}
                x={x}
                y={y}
                gridSize={gridSize}
                terrainColor={terrain.color}
                isBuildable={terrain.buildable}
                borderTop={borderInfo.borderTop}
                borderRight={borderInfo.borderRight}
                borderBottom={borderInfo.borderBottom}
                borderLeft={borderInfo.borderLeft}
                onClick={onCellClick}
                onMouseEnter={onCellHover}
                onMouseLeave={onCellHoverLeave}
              />
            );
          })
        )}

        {placedItems.map(item => (
          <PlacedItem key={`area-${item.id}`} item={item} gridSize={gridSize} />
        ))}

        {hoveredCell && selectedItem && (
          <HoverPreview
            hoveredCell={hoveredCell}
            selectedItem={selectedItem}
            isValid={isHoveredValid}
            gridSize={gridSize}
          />
        )}

        {placedItems.map(item => (
          <ItemOverlay
            key={`item-${item.id}`}
            item={item}
            gridSize={gridSize}
            deleteMode={deleteMode}
            hasSelectedItem={!!selectedItem}
            onRemove={onRemoveItem}
            onMove={onMoveItem}
          />
        ))}
      </div>
    </div>
  );
};

