<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold">SN Mapping</h2>
      <button @click="showAdd = true" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
        + Add Mapping
      </button>
    </div>
    
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <table class="w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">Serial Number</th>
            <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">Company Name</th>
            <th class="px-4 py-3 text-right text-sm font-semibold text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="m in mappings" :key="m.id" class="hover:bg-gray-50">
            <td class="px-4 py-3 text-sm font-mono">{{ m.serial_number }}</td>
            <td class="px-4 py-3 text-sm">{{ m.company_name }}</td>
            <td class="px-4 py-3 text-right">
              <button @click="deleteMapping(m.id)" class="text-red-600 hover:text-red-800">Delete</button>
            </td>
          </tr>
          <tr v-if="mappings.length === 0">
            <td colspan="3" class="px-4 py-8 text-center text-gray-500">No mappings</td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- Add Modal -->
    <div v-if="showAdd" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-white rounded-lg p-6 w-96">
        <h3 class="text-lg font-bold mb-4">Add Mapping</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">Serial Number</label>
            <input v-model="newSN" type="text" class="w-full px-3 py-2 border rounded-lg">
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Company Name</label>
            <input v-model="newCompany" type="text" class="w-full px-3 py-2 border rounded-lg">
          </div>
        </div>
        <div class="flex justify-end gap-2 mt-6">
          <button @click="showAdd = false" class="px-4 py-2 bg-gray-200 rounded-lg">Cancel</button>
          <button @click="addMapping" class="px-4 py-2 bg-blue-600 text-white rounded-lg">Add</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../api'
import { useToast } from '../composables/useToast'

const emit = defineEmits(['refresh'])
const toast = useToast()

const mappings = ref([])
const showAdd = ref(false)
const newSN = ref('')
const newCompany = ref('')

onMounted(loadMappings)

async function loadMappings() {
  const res = await api.get('/api/sn-mappings')
  mappings.value = res.data
}

async function addMapping() {
  if (!newSN.value || !newCompany.value) return
  try {
    await api.post('/api/sn-mappings', { serial_number: newSN.value, company_name: newCompany.value })
    showAdd.value = false
    newSN.value = ''
    newCompany.value = ''
    loadMappings()
    emit('refresh')
    toast.success('Mapping added')
  } catch (e) {
    toast.error(e.response?.data?.error || 'Failed to add')
  }
}

async function deleteMapping(id) {
  if (!confirm('Delete this mapping?')) return
  await api.delete(`/api/sn-mappings/${id}`)
  loadMappings()
  emit('refresh')
  toast.success('Mapping deleted')
}
</script>
