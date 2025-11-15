<template>
  <q-layout view="lHh Lpr lFf">
    
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn flat dense round icon="menu" @click="toggleLeftDrawer" aria-label="Menu" />
        <q-toolbar-title>
          Asistente de Onboarding
          <div class="text-caption">Disponible 24/7 para ayudarte</div>
        </q-toolbar-title>
        
        <q-btn flat round dense icon="chat" class="q-mr-sm" label="Chat">
          <q-badge color="red" floating v-if="unreadChatCount > 0">{{ unreadChatCount }}</q-badge>
        </q-btn>
        <q-btn flat round dense icon="event" class="q-mr-sm" label="Actividades">
          <q-badge color="red" floating v-if="unreadActivityCount > 0">{{ unreadActivityCount }}</q-badge>
        </q-btn>
        <q-btn flat round dense icon="school" class="q-mr-sm" label="Cursos" />
        <q-btn flat round dense icon="description" class="q-mr-sm" label="Documentos" />
        <q-btn flat round dense icon="supervisor_account" class="q-mr-sm" label="Supervisor" />

        <div class="q-mx-md">María González<br><span class="text-caption">Nuevo Especialista</span></div>
        <q-avatar color="blue-8" text-color="white" size="md">MG</q-avatar>
        <q-btn flat round dense icon="logout" class="q-ml-md" aria-label="Salir" />
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      :width="300"
    >
      <q-list>
        <q-expansion-item
          expand-separator
          icon="notifications"
          label="Mensajes importantes"
          caption="5 nuevos"
          default-opened
        >
          <q-card>
            <q-card-section>
              <q-list separator>
                <q-item>
                  <q-item-section avatar>
                    <q-icon name="info" color="red" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>¡Bienvenido a TCS!</q-item-label>
                    <q-item-label caption lines="2">Hola María González, estamos muy emocionados...</q-item-label>
                    <q-item-label caption>13 nov, 01:41</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-btn flat round icon="favorite_border" size="sm" />
                    <q-btn flat round icon="close" size="sm" />
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card-section>
          </q-card>
        </q-expansion-item>

        <q-item-label header class="text-h6">Historial</q-item-label>
        
        <q-item clickable v-ripple @click="createNewChat">
          <q-item-section avatar>
            <q-icon name="add_circle" color="primary" />
          </q-item-section>
          <q-item-section>Nueva conversación</q-item-section>
        </q-item>

        <q-item
          v-for="convo in conversations"
          :key="convo.id || convo._id"
          clickable
          v-ripple
          :active="selectedChatId === (convo.id || convo._id)"
          active-class="bg-blue-1 text-primary"
          @click="selectChat(convo)"
        >
          <q-item-section>
            <q-item-label>{{ convo.titulo || convo.title || convo._id || convo.id }}</q-item-label>
            <q-item-label caption>{{ convo.ultimaActividadEn ? formatDate(convo.ultimaActividadEn) : '' }}</q-item-label>
          </q-item-section>
          <q-item-section side v-if="(convo.mensajes || []).length > 0 && (convo.mensajes || [])[ (convo.mensajes || []).length - 1 ].tipo === 'bot'">
            <q-icon name="star_border" />
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
    
  </q-layout>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { api } from 'boot/axios'
import { useQuasar } from 'quasar'
import { useRouter, useRoute } from 'vue-router'

defineOptions({ name: 'MainLayout' })

const $q = useQuasar()
const router = useRouter()
const route = useRoute()

// Estado del Layout
const leftDrawerOpen = ref(true)
function toggleLeftDrawer () {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

// Datos de la Cabecera (simulados)
const unreadChatCount = ref(3)
const unreadActivityCount = ref(5)

// Datos del Historial de Chats
const userEmail = 'user@tcs.com'
const conversations = ref([])
const selectedChatId = ref(null)

// Cargar conversaciones desde la API (GET /api/chat/{correo})
async function fetchConversations () {
  try {
    const emailEscaped = encodeURIComponent(userEmail)
    const response = await api.get(`/chat/${emailEscaped}`)
    conversations.value = response.data || []
    if (conversations.value.length > 0) {
      const currentChatId = route.params.chatId
      if (currentChatId) {
        selectedChatId.value = currentChatId
      } else {
        selectChat(conversations.value[0])
      }
    }
  } catch (error) {
    console.error('Error al cargar conversaciones:', error)
    $q.notify({ type: 'negative', message: 'No se pudo cargar el historial.' })
  }
}

function selectChat (convo) {
  const id = convo.id || convo._id || convo.chatId
  if (!id) return
  selectedChatId.value = id
  router.push(`/chat/${id}`)
}

async function createNewChat () {
  try {
    const emailEscaped = encodeURIComponent(userEmail)
    const response = await api.post(`/chat/${emailEscaped}`, {
      titulo: 'Nueva Conversación ' + (conversations.value.length + 1)
    })
    const newChat = response.data
    if (newChat) conversations.value.push(newChat)
    selectChat(newChat)
  } catch (error) {
    console.error('Error al crear conversación:', error)
    $q.notify({ type: 'negative', message: 'No se pudo crear el chat.' })
  }
}

function formatDate (dateString) {
  try {
    const options = { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }
    return new Date(dateString).toLocaleDateString('es-ES', options)
  } catch {
    return ''
  }
}

watch(() => route.params.chatId, (newChatId) => {
  selectedChatId.value = newChatId
})

onMounted(() => {
  fetchConversations()
})
</script>
