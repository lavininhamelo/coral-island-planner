import React, { useState, useRef, useCallback, useEffect } from "react";
import { Sidebar } from "./components/Sidebar";
import { FarmGrid } from "./components/FarmGrid";
import { terrainArr, terrainType } from "./terrain";
import type { Item, PlacedItem, Cell } from "./types";

const App = () => {
  const GRID_SIZE = 20;
  const GRID_WIDTH = terrainArr[0]?.length ?? 70;
  const GRID_HEIGHT = terrainArr.length ?? 40;

  const [placedItems, setPlacedItems] = useState<PlacedItem[]>(() => {
    try {
      const items = localStorage.getItem("items");
      return items ? JSON.parse(items) : [];
    } catch {
      return [];
    }
  });
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [movingItem, setMovingItem] = useState<boolean>(false);
  const [hoveredCell, setHoveredCell] = useState<Cell | null>(null);
  const [deleteMode, setDeleteMode] = useState<boolean>(false);
  const itemIdCounter = useRef<number>(0);

  useEffect(() => {
    localStorage.setItem("items", JSON.stringify(placedItems));
  }, [placedItems]);
  
 

  const items: Item[] = [
    { id: "crop", name: "Crop", itemType: "crop", size: 1, itemSize: 1, color: "#f6c73b75", icon: "🌱" },
    {
      id: "sprinkler-9x9",
      name: "9×9 Sprinkler",
      itemType: "sprinkler",
      size: 9,
      itemSize: 1,
      color: "#3b82f6",
      icon: "💧",
    },
    {
      id: "sprinkler-5x5",
      name: "5×5 Sprinkler",
      itemType: "sprinkler",
      size: 5,
      itemSize: 1,
      color: "#60a5fa",
      icon: "💧",
    },
    {
      id: "sprinkler-3x3",
      name: "3×3 Sprinkler",
      itemType: "sprinkler",
      size: 3,
      itemSize: 1,
      color: "#93c5fd",
      icon: "💧",
    },
    { id: "tree-2x2", name: "2×2 Tree", itemType: "tree", size: 2, itemSize: 1, color: "#22c55e", icon: "🌳" },
    { id: "tree-3x3", name: "3×3 Tree", itemType: "tree", size: 3, itemSize: 1, color: "#16a34a", icon: "🌳" },
    {
      id: "scarecrow-11x11",
      name: "11×11 Scarecrow",
      itemType: "scarecrow",
      size: 11,
      itemSize: 1,
      color: "#eab308",
      icon: "🎃",
    },
    {
      id: "scarecrow-5x5",
      name: "5×5 Scarecrow",
      itemType: "scarecrow",
      size: 5,
      itemSize: 1,
      color: "#fbbf24",
      icon: "🎃",
    },
    {
      id: "scarecrow-ultimate",
      name: "Ultimate Scarecrow",
      itemType: "scarecrow",
      size: 19,
      itemSize: 1,
      color: "#ffbf54",
      icon: "🎃",
    },
    {
      id: "machine-1",
      name: "Machine 1x1",
      itemType: "machine",
      size: 1,
      itemSize: 1,
      color: "#aaaaaa",
      icon: "⚙️",
    },
    {
      id: "machine-2",
      name: "Machine 2x2",
      itemType: "machine",
      size: 2,
      itemSize: 1,
      color: "#333333",
      icon: "⚙️",
    },
  ];

  const canPlaceItem = (x: number, y: number, size: number, itemType: string): boolean => {
    if (x + size > GRID_WIDTH || y + size > GRID_HEIGHT) return false;

    for (let dy = 0; dy < size; dy++) {
      for (let dx = 0; dx < size; dx++) {
        const cellX = x + dx;
        const cellY = y + dy;
        if (cellX >= GRID_WIDTH || cellY >= GRID_HEIGHT) return false;

        const terrainId = terrainArr[cellY]?.[cellX] ?? 1;
        const terrain = terrainType[terrainId as keyof typeof terrainType] ?? terrainType[1];
        if (!terrain.buildable) return false;
      }
    }

    const centerX = x + Math.floor(size / 2);
    const centerY = y + Math.floor(size / 2);

    for (const item of placedItems) {
      const itemCenterX = item.x + Math.floor(item.size / 2);
      const itemCenterY = item.y + Math.floor(item.size / 2);

      if (centerX === itemCenterX && centerY === itemCenterY) {
        return false;
      }

      const isNewItemCropOrTree = itemType === "crop" || itemType.includes("tree");
      const isExistingItemCropOrTree = item.id.includes("crop") || item.id.includes("tree");

      if (isNewItemCropOrTree && isExistingItemCropOrTree) {
        const newLeft = x;
        const newRight = x + size;
        const newTop = y;
        const newBottom = y + size;

        const existingLeft = item.x;
        const existingRight = item.x + item.size;
        const existingTop = item.y;
        const existingBottom = item.y + item.size;

        if (
          !(
            newRight <= existingLeft ||
            newLeft >= existingRight ||
            newBottom <= existingTop ||
            newTop >= existingBottom
          )
        ) {
          return false;
        }
      }
    }
    return true;
  };

  const handleCellClick = (x: number, y: number): void => {
    if (!selectedItem) return;

    if (canPlaceItem(x, y, selectedItem.size, selectedItem.id)) {
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

  const handleMoveItem = (item: PlacedItem): void => {
    handleRemoveItem(item.id);
    setSelectedItem(item);
    setHoveredCell({ x: item.x, y: item.y });
    setMovingItem(true);
  };

  const isHoveredValid =
    hoveredCell && selectedItem
      ? canPlaceItem(hoveredCell.x, hoveredCell.y, selectedItem.size, selectedItem.id)
      : false;

  return (
    <div className="w-full h-screen bg-gradient-to-br from-emerald-50 to-blue-50 p-4 overflow-auto">
        <h1 className="text-2xl mb-4 font-bold text-gray-800 text-center">Coral Island - Farm Planner</h1>
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

          <div className="overflow-auto w-full" style={{
            height: 'calc(100vh - 100px)'
          }}>
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
