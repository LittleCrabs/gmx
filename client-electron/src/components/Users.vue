<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold">Users</h2>
      <button @click="showAdd = true" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
        + Add User
      </button>
    </div>
    
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <table class="w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">Username</th>
            <th class="px-4 py-3 text-center text-sm font-semibold text-gray-600">Admin</th>
            <th class="px-4 py-3 text-center text-sm font-semibold text-gray-600">Active</th>
            <th class="px-4 py-3 text-right text-sm font-semibold text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="u in users" :key="u.id" class="hover:bg-gray-50">
            <td class="px-4 py-3 text-sm">{{ u.username }}</td>
            <td class="px-4 py-3 text-center">
              <span :class="u.is_admin ? 'text-green-600' : 'text-gray-400'">{{ u.is_admin ? '✓' : '✗' }}</span>
            </td>
            <td class="px-4 py-3 text-center">
              <span :class="u.is_active ? 'text-green-600' : 'text-red-600'">{{ u.is_active ? '✓' : '✗' }}</span>
            </td>
            <td class="px-4 py-3 text-right">
              <button @click="deleteUser(u.id)" class="text-red-600 hover:text-red-800">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- Add Modal -->
    <div v-if="showAdd" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-white rounded-lg p-6 w-96">
        <h3 class="text-lg font-bold mb-4">Add User</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">Username</label>
            <input v-model="newUser.username" type="text" class="w-full px-3 py-2 border rounded-lg">
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Password</label>
            <input v-model="newUser.password" type="password" class="w-full px-3 py-2 border rounded-lg">
          </div>
          <div class="flex items-center">
            <input v-model="newUser.is_admin" type="checkbox" id="isAdmin" class="mr-2">
            <label for="isAdmin">Admin</label>
          </div>
        </div>
        <div class="flex justify-end gap-2 mt-6">
          <button @click="showAdd = false" class="px-4 py-2 bg-gray-200 rounded-lg">Cancel</button>
          <button @click="addUser" class="px-4 py-2 bg-blue-600 text-white rounded-lg">Add</button>
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
const users = ref([])
const showAdd = ref(false)
const newUser = ref({ username: '', password: '', is_admin: false })

onMounted(loadUsers)

async function loadUsers() {
  const res = await api.get('/api/admin/users')
  users.value = res.data
}

async function addUser() {
  if (!newUser.value.username || !newUser.value.password) return
  try {
    await api.post('/api/admin/users', newUser.value)
    showAdd.value = false
    newUser.value = { username: '', password: '', is_admin: false }
    loadUsers()
    toast.success('User added')
  } catch (e) {
    toast.error(e.response?.data?.error || 'Failed')
  }
}

async function deleteUser(id) {
  if (!confirm('Delete this user?')) return
  await api.delete(`/api/admin/users/${id}`)
  loadUsers()
  toast.success('User deleted')
}
</script>
