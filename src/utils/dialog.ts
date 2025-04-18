import { createApp, h } from 'vue'
import DialogBox from '@/components/common/DialogBox.vue'

interface DialogOption {
  text: string
  value: any
}

interface DialogConfig {
  message: string
  options: DialogOption[]
  closeOnOverlay?: boolean
}

export function showDialog(config: DialogConfig): Promise<any> {
  return new Promise((resolve) => {
    const container = document.createElement('div')
    document.body.appendChild(container)

    const app = createApp({
      setup() {
        const handleSelect = (value: any) => {
          app.unmount()
          document.body.removeChild(container)
          resolve(value)
        }

        const handleClose = () => {
          app.unmount()
          document.body.removeChild(container)
          resolve(undefined)
        }

        return () =>
          h(DialogBox, {
            message: config.message,
            options: config.options,
            closeOnOverlay: config.closeOnOverlay,
            onSelect: handleSelect,
            onClose: handleClose,
          })
      },
    })

    app.mount(container)
  })
}

// 提供一些常用的对话框快捷方法
export function confirm(message: string): Promise<boolean> {
  return showDialog({
    message,
    options: [
      { text: '确定', value: true },
      { text: '取消', value: false },
    ],
  })
}

export function alert(message: string): Promise<void> {
  return showDialog({
    message,
    options: [{ text: '确定', value: undefined }],
    closeOnOverlay: false,
  })
}

export function prompt(message: string, options: DialogOption[]): Promise<any> {
  return showDialog({
    message,
    options,
  })
}
