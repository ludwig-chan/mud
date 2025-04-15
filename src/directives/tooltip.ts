import type { DirectiveBinding } from 'vue'

// 扩展 HTMLElement 类型以包含 _tooltip 属性
declare global {
  interface HTMLElement {
    _tooltip?: HTMLElement
  }
}

interface TooltipOptions {
  text: string
  position?: 'top' | 'bottom' | 'left' | 'right'
}

function createTooltip(text: string): HTMLElement {
  const tooltip = document.createElement('div')
  tooltip.className = 'v-tooltip'
  tooltip.textContent = text
  return tooltip
}

function positionTooltip(tooltip: HTMLElement, element: HTMLElement, position: string = 'right') {
  const elementRect = element.getBoundingClientRect()
  const tooltipRect = tooltip.getBoundingClientRect()
  
  let top = 0
  let left = 0

  switch (position) {
    case 'top':
      top = elementRect.top - tooltipRect.height - 5
      left = elementRect.left + (elementRect.width - tooltipRect.width) / 2
      break
    case 'bottom':
      top = elementRect.bottom + 5
      left = elementRect.left + (elementRect.width - tooltipRect.width) / 2
      break
    case 'left':
      top = elementRect.top + (elementRect.height - tooltipRect.height) / 2
      left = elementRect.left - tooltipRect.width - 5
      break
    case 'right':
      top = elementRect.top + (elementRect.height - tooltipRect.height) / 2
      left = elementRect.right + 5
      break
  }

  tooltip.style.top = `${top}px`
  tooltip.style.left = `${left}px`
}

export default {
  mounted(el: HTMLElement, binding: DirectiveBinding<TooltipOptions | string>) {    const options = typeof binding.value === 'string' 
      ? { text: binding.value } 
      : binding.value

    // 如果文本为空则不创建tooltip
    if (!options.text?.trim()) {
      return
    }

    const tooltip = createTooltip(options.text)
    tooltip.style.display = 'none'
    document.body.appendChild(tooltip)

    el.addEventListener('mouseenter', () => {
      tooltip.style.display = 'block'
      positionTooltip(tooltip, el, options.position)
    })

    el.addEventListener('mouseleave', () => {
      tooltip.style.display = 'none'
    })

    // 存储 tooltip 元素的引用以便后续清理
    el._tooltip = tooltip
  },

  unmounted(el: HTMLElement) {
    if (el._tooltip) {
      document.body.removeChild(el._tooltip)
      delete el._tooltip
    }
  }
}
