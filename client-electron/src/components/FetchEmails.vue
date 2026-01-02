<template>
  <div>
    <h2 class="text-2xl font-bold mb-6">Fetch Emails</h2>
    
    <!-- Config Info -->
    <div class="bg-white rounded-lg shadow p-4 mb-6">
      <div class="grid grid-cols-3 gap-4 text-sm">
        <div><span class="text-gray-500">IMAP:</span> {{ config?.imap?.server }}:{{ config?.imap?.port }}</div>
        <div><span class="text-gray-500">Senders:</span> {{ config?.sender_emails?.length || 0 }} configured</div>
        <div><span class="text-gray-500">Interval:</span> {{ config?.interval }} days</div>
      </div>
    </div>
    
    <!-- Actions -->
    <div class="flex flex-wrap gap-4 mb-6">
      <button @click="loadCached" :disabled="loading"
        class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition">
        Load Cached
      </button>
      <button @click="fetchEmails" :disabled="loading"
        class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition">
        {{ loading ? 'Fetching...' : 'Fetch New Emails' }}
      </button>
      <button @click="exportBillingRecords" :disabled="results.length === 0"
        class="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition">
        Export Records
      </button>
      <button @click="exportPrinterReport" :disabled="results.length === 0"
        class="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 transition">
        Export Report
      </button>
      <button @click="$emit('refresh')" class="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition">
        Refresh Config
      </button>
    </div>
    
    <!-- Progress -->
    <div v-if="loading" class="mb-6">
      <div class="text-sm mb-2">{{ progressText }}</div>
      <div class="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div class="bg-blue-600 h-2 rounded-full animate-pulse" style="width: 100%"></div>
      </div>
      <p class="text-xs text-gray-500 mt-2">Check server console for detailed progress...</p>
    </div>
    
    <!-- Status -->
    <div v-if="statusText" class="mb-4 text-sm text-gray-600">{{ statusText }}</div>
    
    <!-- Search -->
    <div class="mb-4">
      <input v-model="search" type="text" placeholder="Search by Serial Number..."
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
    </div>
    
    <!-- Results Table -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <table class="w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">Product</th>
            <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">Serial</th>
            <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">IP</th>
            <th class="px-4 py-3 text-right text-sm font-semibold text-gray-600">B&W</th>
            <th class="px-4 py-3 text-right text-sm font-semibold text-gray-600">Color</th>
            <th class="px-4 py-3 text-right text-sm font-semibold text-gray-600">Meter3</th>
            <th class="px-4 py-3 text-right text-sm font-semibold text-gray-600">Meter4</th>
            <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">Remark</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="row in filteredResults" :key="row.message_id" class="hover:bg-gray-50">
            <td class="px-4 py-3 text-sm">{{ row.product_name }}</td>
            <td class="px-4 py-3 text-sm font-mono">{{ row.serial_number }}</td>
            <td class="px-4 py-3 text-sm font-mono">{{ row.ipv4_address }}</td>
            <td class="px-4 py-3 text-sm text-right">{{ row.billing_meter_1?.toLocaleString() }}</td>
            <td class="px-4 py-3 text-sm text-right">{{ row.billing_meter_2?.toLocaleString() }}</td>
            <td class="px-4 py-3 text-sm text-right">{{ row.billing_meter_3?.toLocaleString() }}</td>
            <td class="px-4 py-3 text-sm text-right">{{ row.billing_meter_4?.toLocaleString() }}</td>
            <td class="px-4 py-3 text-sm text-blue-600">{{ config?.sn_mappings?.[row.serial_number] || '' }}</td>
          </tr>
          <tr v-if="filteredResults.length === 0">
            <td colspan="8" class="px-4 py-8 text-center text-gray-500">No data</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '../api'
import { useToast } from '../composables/useToast'

const props = defineProps(['config'])
const toast = useToast()

const loading = ref(false)
const progressText = ref('')
const statusText = ref('')
const results = ref([])
const search = ref('')

const filteredResults = computed(() => {
  if (!search.value) return results.value
  return results.value.filter(r => 
    String(r.serial_number).toLowerCase().includes(search.value.toLowerCase())
  )
})

onMounted(() => {
  loadCached()
})

async function loadCached() {
  try {
    const res = await api.get('/api/email-records')
    results.value = res.data || []
    statusText.value = `Loaded ${results.value.length} cached records`
  } catch (e) {
    console.error('Failed to load cached:', e)
  }
}

async function fetchEmails() {
  if (!props.config?.imap) {
    toast.error('No IMAP configuration')
    return
  }
  
  loading.value = true
  progressText.value = 'Fetching new emails from server...'
  
  try {
    const res = await api.post('/api/fetch-emails', {})
    results.value = res.data.records || []
    const newCount = res.data.new_count || 0
    statusText.value = `Total: ${results.value.length} records (${newCount} new)`
    progressText.value = ''
    toast.success(`Completed: ${newCount} new emails fetched`)
  } catch (e) {
    if (e.code === 'ECONNABORTED') {
      toast.error('Request timeout. Try reducing the interval days.')
    } else {
      toast.error('Error: ' + (e.response?.data?.error || e.message))
    }
    progressText.value = 'Error'
  } finally {
    loading.value = false
  }
}

function exportBillingRecords() {
  if (results.value.length === 0) {
    toast.error('No data to export')
    return
  }
  
  // 通过后端API下载Excel
  const token = localStorage.getItem('token')
  const baseUrl = localStorage.getItem('serverUrl') || 'http://localhost:5050'
  
  fetch(`${baseUrl}/api/export/billing-records`, {
    headers: { 'Authorization': `Bearer ${token}` }
  })
  .then(res => res.blob())
  .then(blob => {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `billing_records_${new Date().toISOString().slice(0,10)}.xlsx`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Billing records exported')
  })
  .catch(e => toast.error('Export failed: ' + e.message))
}

function exportPrinterReport() {
  if (results.value.length === 0) {
    toast.error('No data to export')
    return
  }
  
  // 通过后端API下载打印机状态报告
  const token = localStorage.getItem('token')
  const baseUrl = localStorage.getItem('serverUrl') || 'http://localhost:5050'
  
  fetch(`${baseUrl}/api/export/printer-report`, {
    headers: { 'Authorization': `Bearer ${token}` }
  })
  .then(res => res.blob())
  .then(blob => {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Printer_Status_Report_${new Date().toISOString().slice(0,10)}.xlsx`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Printer report exported')
  })
  .catch(e => toast.error('Export failed: ' + e.message))
}
</script>
