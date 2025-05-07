export interface GameAction {
  name: string;
  text: string;
  duration: number;
  energyCost: number; // 新增: 该动作需要消耗的体力值
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

export interface GameBuilding {
  name: string;
  type: string;
  level: number;
}

export interface GameScene {
  id: string;
  name: string;
  actions: GameAction[];
  resources: GameResource[];
  buildings: GameBuilding[];
  // 场景库存,记录场景中资源的当前数量和最大数量
  stock: {
    [key: string]: {
      current: number;  // 当前数量
      max: number;      // 最大数量
    }
  };
}
