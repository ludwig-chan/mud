export interface GameAction {
  name: string;
  text: string;
  duration: number;
  handler: () => Promise<void>;
  disabled?: boolean | (() => boolean);
  tooltip?: string;
}

export interface GameResource {
  id: string;
  type: 'wood' | 'ore' | 'branch' | 'apple';
  name: string;
  count: number;
  maxCount?: number;
}

export interface GameScene {
  id: string;
  name: string;
  actions: GameAction[];
  resources: GameResource[];
  // 场景库存,记录场景中资源的当前数量和最大数量
  stock: {
    [key: string]: {
      current: number;  // 当前数量
      max: number;      // 最大数量
    }
  };
}
