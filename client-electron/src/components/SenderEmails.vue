<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold">Sender Emails</h2>
      <button @click="showAdd = true" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
        + Add Email
      </button>
    </div>
    
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <table class="w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">Email</th>
            <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">Description</th>
            <th class="px-4 py-3 text-center text-sm font-semibold text-gray-600">Active</th>
            <th class="px-4 py-3 text-right text-sm font-semibold text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="e in emails" :key="e.id" class="hover:bg-gray-50">
            <td class="px-4 py-3 text-sm">{{ e.email }}</td>
            <td class="px-4 py-3 text-sm text-gray-500">{{ e.description }}</td>
            <td class="px-4 py-3 text-center">
              <span :class="e.is_active ? 'text-green-600' : 'text-red-600'">{{ e.is_active ? '✓' : '✗' }}</span>
            </td>
            <td class="px-4 py-3 text-right">
              <button @click="deleteEmail(e.id)" class="text-red-600 hover:text-red-800">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- Add Modal -->
    <div v-if="showAdd" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-white rounded-lg p-6 w-96">
        <h3 class="text-lg font-bold mb-4">Add Email</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">Email</label>
            <input v-model="newEmail" type="email" class="w-full px-3 py-2 border rounded-lg">
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Description</label>
            <input v-model="newDesc" type="text" class="w-full px-3 py-2 border rounded-lg">
          </div>
        </div>
        <div class="flex justify-end gap-2 mt-6">
          <button @click="showAdd = false" class="px-4 py-2 bg-gray-200 rounded-lg">Cancel</button>
          <button @click="addEmail" class="px-4 py-2 bg-blue-600 text-white rounded-lg">Add</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../api'
import { useToast } from '../composables/useToast'

const toast = useToast()
const emails = ref([])
const showAdd = ref(false)
const newEmail = ref('')
const newDesc = ref('')

onMounted(loadEmails)

async function loadEmails() {
  const res = await api.get('/api/admin/emails')
  emails.value = res.data
}

async function addEmail() {
  if (!newEmail.value) return
  try {
    await api.post('/api/admin/emails', { email: newEmail.value, description: newDesc.value })
    showAdd.value = false
    newEmail.value = ''
    newDesc.value = ''
    loadEmails()
    toast.success('Email added')
  } catch (e) {
    toast.error(e.response?.data?.error || 'Failed')
  }
}

async function deleteEmail(id) {
  if (!confirm('Delete this email?')) return
  await api.delete(`/api/admin/emails/${id}`)
  loadEmails()
  toast.success('Email deleted')
}
</script>
