import mitt from 'mitt'

export type Events = {
  'game-message': string;
}

export const emitter = mitt<Events>()

// 全局游戏消息方法
export const gameLog = (message: string) => {
  emitter.emit('game-message', message)
}
