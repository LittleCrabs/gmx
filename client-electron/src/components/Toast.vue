<template>
  <Teleport to="body">
    <Transition name="toast">
      <div v-if="visible" 
        class="fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg max-w-sm"
        :class="typeClass">
        <div class="flex items-center gap-3">
          <span class="text-xl">{{ icon }}</span>
          <span>{{ message }}</span>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed } from 'vue'

const visible = ref(false)
const message = ref('')
const type = ref('success')

const typeClass = computed(() => ({
  'bg-green-500 text-white': type.value === 'success',
  'bg-red-500 text-white': type.value === 'error',
  'bg-yellow-500 text-white': type.value === 'warning',
  'bg-blue-500 text-white': type.value === 'info'
}))

const icon = computed(() => ({
  success: '✓',
  error: '✗',
  warning: '⚠',
  info: 'ℹ'
}[type.value]))

function show(msg, t = 'success', duration = 3000) {
  message.value = msg
  type.value = t
  visible.value = true
  setTimeout(() => { visible.value = false }, duration)
}

defineExpose({ show })
</script>

<style scoped>
.toast-enter-active, .toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from, .toast-leave-to {
  opacity: 0;
  transform: translateX(100px);
}
</style>
