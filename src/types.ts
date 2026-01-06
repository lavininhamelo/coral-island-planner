export type Item = {
  id: string;
  name: string;
  size: number;
  itemSize: number;
  color: string;
  icon: string;
  itemType: 'crop' | 'sprinkler' | 'tree' | 'scarecrow' | 'machine' | 'building' | 'other';
};

export type ItemV2 = {
  id: string;
  name: string;
  itemType: string;

  width: number;
  height: number;

  placement: "block" | "radius";
  radius?: number;

  color: string;
  icon: string;
};


export type PlacedItem = ItemV2 & {
  x: number;
  y: number;
};

export type Cell = {
  x: number;
  y: number;
};

