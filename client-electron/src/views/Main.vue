<template>
  <div class="flex h-screen">
    <!-- Sidebar -->
    <div class="w-64 bg-gray-800 text-white">
      <div class="p-4 border-b border-gray-700">
        <h1 class="text-xl font-bold">GMX</h1>
        <p class="text-sm text-gray-400">{{ auth.user?.username }}</p>
      </div>
      
      <nav class="p-4 space-y-2">
        <button @click="activeTab = 'fetch'" 
          :class="['w-full text-left px-4 py-2 rounded-lg transition', activeTab === 'fetch' ? 'bg-blue-600' : 'hover:bg-gray-700']">
          📧 Fetch Emails
        </button>
        <button @click="activeTab = 'mapping'" 
          :class="['w-full text-left px-4 py-2 rounded-lg transition', activeTab === 'mapping' ? 'bg-blue-600' : 'hover:bg-gray-700']">
          🏢 SN Mapping
        </button>
        <template v-if="auth.user?.is_admin">
          <button @click="activeTab = 'users'" 
            :class="['w-full text-left px-4 py-2 rounded-lg transition', activeTab === 'users' ? 'bg-blue-600' : 'hover:bg-gray-700']">
            👥 Users
          </button>
          <button @click="activeTab = 'emails'" 
            :class="['w-full text-left px-4 py-2 rounded-lg transition', activeTab === 'emails' ? 'bg-blue-600' : 'hover:bg-gray-700']">
            📬 Sender Emails
          </button>
          <button @click="activeTab = 'settings'" 
            :class="['w-full text-left px-4 py-2 rounded-lg transition', activeTab === 'settings' ? 'bg-blue-600' : 'hover:bg-gray-700']">
            ⚙️ Settings
          </button>
        </template>
      </nav>
      
      <div class="absolute bottom-0 w-64 p-4 border-t border-gray-700">
        <button @click="logout" class="w-full px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition">
          Logout
        </button>
      </div>
    </div>
    
    <!-- Main Content -->
    <div class="flex-1 overflow-auto bg-gray-100 p-6">
      <FetchEmails v-if="activeTab === 'fetch'" :config="config" />
      <SNMapping v-else-if="activeTab === 'mapping'" @refresh="loadConfig" />
      <Users v-else-if="activeTab === 'users'" />
      <SenderEmails v-else-if="activeTab === 'emails'" />
      <Settings v-else-if="activeTab === 'settings'" :config="config" @refresh="loadConfig" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import api from '../api'
import FetchEmails from '../components/FetchEmails.vue'
import SNMapping from '../components/SNMapping.vue'
import Users from '../components/Users.vue'
import SenderEmails from '../components/SenderEmails.vue'
import Settings from '../components/Settings.vue'

const router = useRouter()
const auth = useAuthStore()

const activeTab = ref('fetch')
const config = ref(null)

onMounted(() => {
  api.setBaseUrl(auth.serverUrl)
  api.setToken(auth.token)
  loadConfig()
})

async function loadConfig() {
  try {
    const res = await api.get('/api/client/config')
    config.value = res.data
  } catch (e) {
    console.error('Failed to load config:', e)
  }
}

function logout() {
  auth.logout()
  router.push('/login')
}
</script>
