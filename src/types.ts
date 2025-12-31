export type Item = {
  id: string;
  name: string;
  size: number;
  itemSize: number;
  color: string;
  icon: string;
  itemType: 'crop' | 'sprinkler' | 'tree' | 'scarecrow' | 'machine'
};

export type PlacedItem = Item & {
  x: number;
  y: number;
};

export type Cell = {
  x: number;
  y: number;
};

