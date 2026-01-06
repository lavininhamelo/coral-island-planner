import React from "react";
import type { ItemV2, Cell } from "../types";

type HoverPreviewProps = {
  hoveredCell: Cell;
  selectedItem: ItemV2;
  isValid: boolean;
  gridSize: number;
};

export const HoverPreview: React.FC<HoverPreviewProps> = ({ hoveredCell, selectedItem, isValid, gridSize }) => {
  const isRadius = selectedItem.placement === "radius";
  const radius = selectedItem.radius ?? 0;

  if (isRadius) {
    const size = (radius * 2 + 1) * gridSize;
    const left = (hoveredCell.x - radius) * gridSize;
    const top = (hoveredCell.y - radius) * gridSize;

    return (
      <div
        className="absolute pointer-events-none border-2 flex items-center justify-center"
        style={{
          left,
          top,
          width: size,
          height: size,
          backgroundColor: isValid ? `${selectedItem.color}40` : "#ff000040",
          borderColor: isValid ? selectedItem.color : "#ff0000",
          borderRadius: "4px",
          zIndex: 15,
        }}
      >
        <div
          className="flex items-center justify-center h-full w-full text-xl"
          style={{
            width: gridSize,
            height: gridSize,
          }}
        >
          {selectedItem.icon}
        </div>
      </div>
    );
  }

  // block normal
  return (
    <>
      <div
        className="absolute pointer-events-none border-2"
        style={{
          left: hoveredCell.x * gridSize,
          top: hoveredCell.y * gridSize,
          width: selectedItem.width * gridSize,
          height: selectedItem.height * gridSize,
          backgroundColor: isValid ? `${selectedItem.color}40` : "#ff000040",
          borderColor: isValid ? selectedItem.color : "#ff0000",
          zIndex: 15,
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          left: (hoveredCell.x + Math.floor(selectedItem.width / 2)) * gridSize,
          top: (hoveredCell.y + Math.floor(selectedItem.height / 2)) * gridSize,
          width: gridSize,
          height: gridSize,
          backgroundColor: isValid ? selectedItem.color : "#ff0000",
          border: "2px solid white",
          zIndex: 25,
        }}
      >
        <div className="flex items-center justify-center h-full text-xl">{selectedItem.icon}</div>
      </div>
    </>
  );
};
