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
  type: 'wood' | 'ore' | 'branch';
  name: string;
  count: number;
  maxCount?: number;
}

export interface GameScene {
  id: string;
  name: string;
  actions: GameAction[];
  resources: GameResource[];
}
