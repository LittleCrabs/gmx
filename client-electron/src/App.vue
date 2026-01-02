<template>
  <div class="min-h-screen bg-gray-100">
    <Toast ref="toastRef" />
    <router-view />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Toast from './components/Toast.vue'
import { setToastRef } from './composables/useToast'

const toastRef = ref(null)

onMounted(() => {
  setToastRef(toastRef.value)
})
</script>
