import { ref } from 'vue'

const toastRef = ref(null)

export function setToastRef(ref) {
  toastRef.value = ref
}

export function useToast() {
  return {
    success: (msg) => toastRef.value?.show(msg, 'success'),
    error: (msg) => toastRef.value?.show(msg, 'error'),
    warning: (msg) => toastRef.value?.show(msg, 'warning'),
    info: (msg) => toastRef.value?.show(msg, 'info')
  }
}
