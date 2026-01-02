<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded-2xl shadow-lg w-96">
      <h1 class="text-3xl font-bold text-center text-gray-800 mb-8">GMX</h1>
      
      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Server</label>
          <input v-model="serverUrl" type="text" 
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="http://localhost:5050">
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Username</label>
          <input v-model="username" type="text" 
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter username">
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input v-model="password" type="password" 
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter password">
        </div>
        
        <div v-if="error" class="text-red-500 text-sm text-center">{{ error }}</div>
        
        <button type="submit" :disabled="loading"
          class="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50">
          {{ loading ? 'Logging in...' : 'Login' }}
        </button>
        
        <button type="button" @click="handleRegister" :disabled="loading"
          class="w-full py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition">
          Register
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import api from '../api'
import { useToast } from '../composables/useToast'

const router = useRouter()
const auth = useAuthStore()
const toast = useToast()

const serverUrl = ref(auth.serverUrl)
const username = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

onMounted(() => {
  api.setBaseUrl(serverUrl.value)
})

async function handleLogin() {
  if (!username.value || !password.value) {
    error.value = 'Please fill in all fields'
    return
  }
  
  loading.value = true
  error.value = ''
  
  try {
    auth.setServer(serverUrl.value)
    await auth.login(username.value, password.value)
    router.push('/')
  } catch (e) {
    error.value = e.response?.data?.error || 'Login failed'
  } finally {
    loading.value = false
  }
}

async function handleRegister() {
  if (!username.value || !password.value) {
    error.value = 'Please fill in all fields'
    return
  }
  
  loading.value = true
  error.value = ''
  
  try {
    api.setBaseUrl(serverUrl.value)
    auth.setServer(serverUrl.value)
    await auth.register(username.value, password.value)
    error.value = ''
    toast.success('Registration successful! You can now login.')
  } catch (e) {
    error.value = e.response?.data?.error || 'Registration failed'
  } finally {
    loading.value = false
  }
}
</script>
