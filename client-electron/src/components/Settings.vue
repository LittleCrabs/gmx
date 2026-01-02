<template>
  <div>
    <h2 class="text-2xl font-bold mb-6">Settings</h2>
    
    <!-- IMAP Config -->
    <div class="bg-white rounded-lg shadow p-6 mb-6">
      <h3 class="text-lg font-semibold mb-4">IMAP Configuration</h3>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium mb-1">Server</label>
          <input v-model="imap.server" type="text" class="w-full px-3 py-2 border rounded-lg">
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Port</label>
          <input v-model.number="imap.port" type="number" class="w-full px-3 py-2 border rounded-lg">
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Username</label>
          <input v-model="imap.username" type="text" class="w-full px-3 py-2 border rounded-lg">
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Password</label>
          <input v-model="imap.password" type="password" class="w-full px-3 py-2 border rounded-lg">
        </div>
      </div>
      <button @click="saveImap" class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
        Save IMAP
      </button>
    </div>
    
    <!-- System Config -->
    <div class="bg-white rounded-lg shadow p-6">
      <h3 class="text-lg font-semibold mb-4">System Settings</h3>
      <div class="max-w-xs">
        <label class="block text-sm font-medium mb-1">Fetch Interval (days)</label>
        <input v-model.number="interval" type="number" min="1" max="365" class="w-full px-3 py-2 border rounded-lg">
      </div>
      <button @click="saveConfig" class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
        Save Settings
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import api from '../api'
import { useToast } from '../composables/useToast'

const toast = useToast()

const props = defineProps(['config'])
const emit = defineEmits(['refresh'])

const imap = ref({ server: '', port: 993, username: '', password: '' })
const interval = ref(7)

watch(() => props.config, (cfg) => {
  if (cfg?.imap) {
    imap.value = { ...cfg.imap }
  }
  if (cfg?.interval) {
    interval.value = cfg.interval
  }
}, { immediate: true })

onMounted(loadImap)

async function loadImap() {
  try {
    const res = await api.get('/api/admin/imap')
    imap.value = res.data
  } catch (e) {}
}

async function saveImap() {
  try {
    await api.post('/api/admin/imap', imap.value)
    toast.success('IMAP config saved')
    emit('refresh')
  } catch (e) {
    toast.error('Failed to save')
  }
}

async function saveConfig() {
  try {
    await api.post('/api/admin/config', { interval: String(interval.value) })
    toast.success('Settings saved')
    emit('refresh')
  } catch (e) {
    toast.error('Failed to save')
  }
}
</script>
