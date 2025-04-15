import type { DirectiveBinding } from 'vue'

// 扩展 HTMLElement 类型以包含 _tooltip 属性
declare global {
  interface HTMLElement {
    _tooltip?: HTMLElement
    _longPressTimeout?: number
    _touchStartTime?: number
    _autoCloseTimeout?: number  // 新增自动关闭定时器
  }
}

const LONG_PRESS_DURATION = 500 // 长按触发时间阈值（毫秒）

type TooltipPosition = 
  | 'top' 
  | 'top-left' 
  | 'top-right' 
  | 'bottom' 
  | 'bottom-left' 
  | 'bottom-right' 
  | 'left' 
  | 'right'

interface TooltipOptions {
  text: string
  position?: TooltipPosition
}

function createTooltip(text: string): HTMLElement {
  const tooltip = document.createElement('div')
  tooltip.className = 'v-tooltip'
  tooltip.textContent = text
  tooltip.style.transition = 'opacity 0.3s ease-in-out'
  tooltip.style.opacity = '0'
  return tooltip
}

interface Position {
  top: number
  left: number
}

function calculatePosition(
  elementRect: DOMRect, 
  tooltipRect: DOMRect, 
  position: TooltipPosition,
  spacing: number = 5
): Position {
  let top = 0
  let left = 0

  switch (position) {
    case 'top':
      top = elementRect.top - tooltipRect.height - spacing
      left = elementRect.left + (elementRect.width - tooltipRect.width) / 2
      break
    case 'top-left':
      top = elementRect.top - tooltipRect.height - spacing
      left = elementRect.left
      break
    case 'top-right':
      top = elementRect.top - tooltipRect.height - spacing
      left = elementRect.right - tooltipRect.width
      break
    case 'bottom':
      top = elementRect.bottom + spacing
      left = elementRect.left + (elementRect.width - tooltipRect.width) / 2
      break
    case 'bottom-left':
      top = elementRect.bottom + spacing
      left = elementRect.left
      break
    case 'bottom-right':
      top = elementRect.bottom + spacing
      left = elementRect.right - tooltipRect.width
      break
    case 'left':
      top = elementRect.top + (elementRect.height - tooltipRect.height) / 2
      left = elementRect.left - tooltipRect.width - spacing
      break
    case 'right':
      top = elementRect.top + (elementRect.height - tooltipRect.height) / 2
      left = elementRect.right + spacing
      break
  }

  return { top, left }
}

function isPositionVisible(position: Position, tooltipRect: DOMRect): boolean {
  return (
    position.top >= 0 &&
    position.left >= 0 &&
    position.top + tooltipRect.height <= window.innerHeight &&
    position.left + tooltipRect.width <= window.innerWidth
  )
}

function getBestPosition(
  elementRect: DOMRect,
  tooltipRect: DOMRect,
  preferredPosition: TooltipPosition
): TooltipPosition {
  // 定义所有可能的位置，按优先级排序
  const positions: TooltipPosition[] = [
    preferredPosition,
    'right',
    'left',
    'bottom',
    'top',
    'top-left',
    'top-right',
    'bottom-left',
    'bottom-right'
  ]

  // 找到第一个符合条件的位置
  for (const pos of positions) {
    const position = calculatePosition(elementRect, tooltipRect, pos)
    if (isPositionVisible(position, tooltipRect)) {
      return pos
    }
  }

  // 如果都不合适，返回原始位置
  return preferredPosition
}

function positionTooltip(tooltip: HTMLElement, element: HTMLElement, position: TooltipPosition = 'right') {
  const elementRect = element.getBoundingClientRect()
  const tooltipRect = tooltip.getBoundingClientRect()
  
  // 获取最佳展示位置
  const bestPosition = getBestPosition(elementRect, tooltipRect, position)
  
  // 计算最终位置
  const finalPosition = calculatePosition(elementRect, tooltipRect, bestPosition)
  
  tooltip.style.top = `${finalPosition.top}px`
  tooltip.style.left = `${finalPosition.left}px`
  
  // 更新 tooltip 的位置类名
  tooltip.className = `v-tooltip v-tooltip-${bestPosition}`
}

export default {  mounted(el: HTMLElement, binding: DirectiveBinding<TooltipOptions | string>) {
    const options = typeof binding.value === 'string' 
      ? { text: binding.value } 
      : binding.value

    // 如果文本为空则不创建tooltip
    if (!options.text?.trim()) {
      return
    }

    const tooltip = createTooltip(options.text)
    tooltip.style.display = 'none'
    document.body.appendChild(tooltip)

    // PC端鼠标悬浮事件
    el.addEventListener('mouseenter', () => {
      tooltip.style.display = 'block'
      // 强制重排后再设置透明度，确保过渡动画生效
      tooltip.offsetHeight
      tooltip.style.opacity = '1'
      positionTooltip(tooltip, el, options.position)
    })

    el.addEventListener('mouseleave', () => {
      tooltip.style.opacity = '0'
      setTimeout(() => {
        tooltip.style.display = 'none'
      }, 300)
    })

    // 移动端长按事件
    let documentClickHandler: ((e: Event) => void) | null = null

    el.addEventListener('touchstart', (e) => {
      e.preventDefault() // 阻止默认行为
      el._touchStartTime = Date.now()
      el._longPressTimeout = window.setTimeout(() => {
        tooltip.style.display = 'block'
        tooltip.offsetHeight // 强制重排
        tooltip.style.opacity = '1'
        positionTooltip(tooltip, el, options.position)
      }, LONG_PRESS_DURATION)
    }, { passive: false })

    el.addEventListener('touchend', () => {
      if (el._longPressTimeout) {
        clearTimeout(el._longPressTimeout)
        el._longPressTimeout = undefined
      }
      
      // 如果tooltip正在显示，则设置自动关闭定时器和点击关闭事件
      if (tooltip.style.display === 'block') {
        // 设置5秒后自动关闭
        el._autoCloseTimeout = window.setTimeout(() => {
          tooltip.style.opacity = '0'
          setTimeout(() => {
            tooltip.style.display = 'none'
            if (documentClickHandler) {
              document.removeEventListener('click', documentClickHandler)
              documentClickHandler = null
            }
          }, 300)
        }, 3000)

        // 添加点击任意位置关闭事件
        documentClickHandler = (e: Event) => {
          tooltip.style.display = 'none'
          document.removeEventListener('click', documentClickHandler!)
          documentClickHandler = null
          if (el._autoCloseTimeout) {
            clearTimeout(el._autoCloseTimeout)
            el._autoCloseTimeout = undefined
          }
        }
        
        // 延迟添加点击事件，避免触摸结束时的点击立即触发
        setTimeout(() => {
          document.addEventListener('click', documentClickHandler!)
        }, 0)
      }
    })

    el.addEventListener('touchmove', (e) => {
      if (el._longPressTimeout) {
        clearTimeout(el._longPressTimeout)
        el._longPressTimeout = undefined
      }
      tooltip.style.display = 'none'
      if (documentClickHandler) {
        document.removeEventListener('click', documentClickHandler)
        documentClickHandler = null
      }
      if (el._autoCloseTimeout) {
        clearTimeout(el._autoCloseTimeout)
        el._autoCloseTimeout = undefined
      }
    })

    // 存储 tooltip 元素的引用以便后续清理
    el._tooltip = tooltip
  },

  unmounted(el: HTMLElement) {
    if (el._tooltip) {
      document.body.removeChild(el._tooltip)
      delete el._tooltip
    }
    if (el._longPressTimeout) {
      clearTimeout(el._longPressTimeout)
      delete el._longPressTimeout
    }
  }
}
