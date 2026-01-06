import React, { useState, useRef, useCallback, useEffect } from "react";
import { Sidebar } from "./components/Sidebar";
import { FarmGrid } from "./components/FarmGrid";
import { terrainArr, terrainType } from "./terrain";
import type { ItemV2, PlacedItem, Cell } from "./types";
import { items } from "./items";

const App = () => {
  const GRID_SIZE = 20;
  const GRID_WIDTH = terrainArr[0]?.length ?? 70;
  const GRID_HEIGHT = terrainArr.length ?? 40;

  const migratePlacedItems = (data: any[]): PlacedItem[] => {
    return data.map((item) => {
      if ("width" in item && "height" in item) {
        return item;
      }

      return {
        ...item,
        type: item.type === "scarecrow" || item.type === "sprinkler" ? "radius" : "block",
        width: item.size,
        height: item.size,
      };
    });
  };

  const [placedItems, setPlacedItems] = useState<PlacedItem[]>(() => {
    try {
      const raw = localStorage.getItem("items");
      if (!raw) return [];

      const parsed = JSON.parse(raw);
      return migratePlacedItems(parsed);
    } catch {
      return [];
    }
  });

  const [selectedItem, setSelectedItem] = useState<ItemV2 | null>(null);
  const [movingItem, setMovingItem] = useState<boolean>(false);
  const [hoveredCell, setHoveredCell] = useState<Cell | null>(null);
  const [deleteMode, setDeleteMode] = useState<boolean>(false);
  const itemIdCounter = useRef<number>(0);

  useEffect(() => {
    localStorage.setItem("items", JSON.stringify(placedItems));
  }, [placedItems]);

  const blocksCell = (item: PlacedItem, x: number, y: number): boolean => {
    if (item.placement === "radius") {
      return item.x === x && item.y === y;
    }

    return x >= item.x && x < item.x + item.width && y >= item.y && y < item.y + item.height;
  };

  const canPlaceItem = (x: number, y: number, item: ItemV2): boolean => {
    if (x + item.width > GRID_WIDTH || y + item.height > GRID_HEIGHT) return false;

    for (let dy = 0; dy < item.height; dy++) {
      for (let dx = 0; dx < item.width; dx++) {
        const cellX = x + dx;
        const cellY = y + dy;

        const terrainId = terrainArr[cellY]?.[cellX] ?? 1;
        const terrain = terrainType[terrainId as keyof typeof terrainType];
        if (!terrain.buildable) return false;

        for (const placed of placedItems) {
          if (blocksCell(placed, cellX, cellY)) {
            return false;
          }
        }
      }
    }

    return true;
  };

  const handleCellClick = (x: number, y: number): void => {
    if (!selectedItem) return;

    if (canPlaceItem(x, y, selectedItem)) {
      itemIdCounter.current += 1;

      setPlacedItems([
        ...placedItems,
        {
          ...selectedItem,
          x,
          y,
          id: `${selectedItem.id}-${itemIdCounter.current}`,
        },
      ]);

      if (movingItem) {
        setSelectedItem(null);
        setMovingItem(false);
      }
    }
  };

  const handleKeyDown = useCallback(
    (e: KeyboardEvent): void => {
      if (e.key === "Escape") {
        setSelectedItem(null);
        setMovingItem(false);
      } else if (e.key === "Backspace") {
        if (selectedItem) {
          setSelectedItem(null);
          setMovingItem(false);
        }
      }
    },
    [selectedItem]
  );

  React.useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  const handleRemoveItem = (itemId: string): void => {
    setPlacedItems(placedItems.filter((item) => item.id !== itemId));
  };

  const handleMoveItem = (item: PlacedItem) => {
    handleRemoveItem(item.id);

    const baseItem: ItemV2 = {
      id: item.id.split("-").slice(0, -1).join("-"), 
      name: item.name,
      itemType: item.itemType,
      width: item.width,
      height: item.height,
      placement: item.placement,
      radius: item.radius, 
      color: item.color,
      icon: item.icon,
    };

    setSelectedItem(baseItem);
    setHoveredCell({ x: item.x, y: item.y });
    setMovingItem(true);
  };

  const isHoveredValid = hoveredCell && selectedItem ? canPlaceItem(hoveredCell.x, hoveredCell.y, selectedItem) : false;

  return (
    <div className="w-full h-screen bg-gradient-to-br from-emerald-50 to-blue-50 p-4 overflow-auto">
      <div className="flex gap-4 flex-col lg:flex-row">
        <Sidebar
          items={items}
          selectedItem={selectedItem}
          placedItems={placedItems}
          gridWidth={GRID_WIDTH}
          gridHeight={GRID_HEIGHT}
          onSelectItem={setSelectedItem}
          onDeselectItem={() => setSelectedItem(null)}
          onClearAll={() => setPlacedItems([])}
          deleteMode={deleteMode}
          onToggleDeleteMode={() => setDeleteMode(!deleteMode)}
        />

        <div className="overflow-auto w-full h-[calc(100vh-40px)]">
          <FarmGrid
            gridWidth={GRID_WIDTH}
            gridHeight={GRID_HEIGHT}
            gridSize={GRID_SIZE}
            terrainArr={terrainArr}
            terrainType={terrainType}
            placedItems={placedItems}
            selectedItem={selectedItem}
            hoveredCell={hoveredCell}
            deleteMode={deleteMode}
            isHoveredValid={isHoveredValid}
            onCellClick={handleCellClick}
            onCellHover={setHoveredCell}
            onCellHoverLeave={() => setHoveredCell(null)}
            onRemoveItem={handleRemoveItem}
            onMoveItem={handleMoveItem}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
