import React from "react";
import type { PlacedItem as PlacedItemType } from "../types";

type PlacedItemProps = {
  item: PlacedItemType;
  gridSize: number;
};

export const PlacedItem: React.FC<PlacedItemProps> = ({ item, gridSize }) => {
  const isRadius = item.placement === "radius";
  const radius = item.radius ?? 0;

  if (isRadius) {
    const size = (radius * 2 + 1) * gridSize; 
    const left = (item.x - radius) * gridSize;
    const top = (item.y - radius) * gridSize;

    return (
      <div
        className="absolute border-2 pointer-events-none flex items-center justify-center"
        style={{
          left,
          top,
          width: size,
          height: size,
          backgroundColor: `${item.color}30`,
          borderColor: `${item.color}60`,
          borderRadius: "4px",
          zIndex: 10,
        }}
      >
        <div
          className="flex items-center justify-center h-full w-full text-xl"
          style={{
            width: gridSize,
            height: gridSize,
          }}
        >
          {item.icon}
        </div>
      </div>
    );
  }

  return (
    <div
      className="absolute border-2 pointer-events-none flex items-center justify-center"
      style={{
        left: item.x * gridSize,
        top: item.y * gridSize,
        width: item.width * gridSize,
        height: item.height * gridSize,
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
          backgroundColor: `${item.color}30`,
          border: "2px solid white",
          borderRadius: "4px",
          zIndex: 30,
        }}
      >
        <span className="text-xl">{item.icon}</span>
      </div>
    </div>
  );
};
