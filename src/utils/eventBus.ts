import mitt from 'mitt'
import { type MessageType } from './textMapping'

export type GameMessage = {
  text: string;
  type: MessageType;
};

export type Events = {
  'game-message': string | GameMessage;
  'hour-passed': void;  // 每小时触发的事件
}

export const emitter = mitt<Events>()

// 全局游戏消息方法
export const gameLog = (message: string | GameMessage) => {
  if (typeof message === 'string') {
    emitter.emit('game-message', { text: message, type: 'SYSTEM' })
  } else {
    emitter.emit('game-message', message)
  }
}
