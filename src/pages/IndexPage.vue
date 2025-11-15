<template>
  <q-page class="flex column no-wrap">
    
    <q-toolbar class="bg-blue-grey-1 text-dark q-py-sm">
      <q-avatar size="md" class="q-mr-sm" color="indigo-8" text-color="white">AI</q-avatar>
      <q-toolbar-title class="text-subtitle1">
        Asistente Inteligente
        <div class="text-caption">Disponible 24/7. Siempre aquí para ayudarte</div>
      </q-toolbar-title>
      <q-btn flat round dense icon="close" @click="closeChat" aria-label="Cerrar chat" />
      <q-btn flat round dense icon="more_vert" aria-label="Más opciones" />
    </q-toolbar>

    <q-scroll-area ref="chatScrollArea" class="col q-pa-md q-gutter-y-md">
      <q-chat-message
        v-if="currentMessages.length === 0"
        bg-color="grey-2"
        text-color="black"
      >
        <q-avatar size="md" class="q-mr-sm" color="indigo-8" text-color="white">AI</q-avatar>
        <div class="q-ml-sm">
          ¡Hola María González! 👋 Soy tu asistente de integración disponible 24 horas al día, 7 días a la semana. Puedo ayudarte con preguntas sobre tu proceso de integración, fechas importantes, documentos y mucho más. ¿En qué puedo ayudarte hoy?
        </div>
        <div class="q-mt-sm row q-gutter-sm">
          <q-btn flat round dense icon="event" label="Ver mi calendario" />
          <q-btn flat round dense icon="person" label="Contactar supervisor" />
        </div>
        <span class="q-message-stamp">13:46</span>
      </q-chat-message>

      <q-chat-message
        v-for="msg in currentMessages"
        :key="msg.timestamp"
        :sent="msg.tipo === 'usuario'"
        :bg-color="msg.tipo === 'usuario' ? 'primary' : 'grey-2'"
        :text-color="msg.tipo === 'usuario' ? 'white' : 'black'"
        :avatar="msg.tipo === 'bot' ? '/src/assets/ai_avatar.png' : ''"
      >
        <template v-slot:avatar v-if="msg.tipo === 'bot'">
          <q-avatar size="md" class="q-mr-sm" color="indigo-8" text-color="white">AI</q-avatar>
        </template>
        <div style="white-space: pre-wrap;">{{ msg.contenido }}</div>
        <span class="q-message-stamp">{{ formatDate(msg.timestamp) }}</span>
      </q-chat-message>

      <div v-if="currentMessages.length === 0" class="q-pa-md q-gutter-sm">
        <q-item-label header class="text-h6">Preguntas frecuentes:</q-item-label>
        <div class="row q-gutter-md">
          <q-btn rounded outline color="primary" label="¿Cuándo empiezo?" @click="sendPredefinedMessage('¿Cuándo empiezo?')" />
          <q-btn rounded outline color="primary" label="Mi supervisor" @click="sendPredefinedMessage('¿Quién es mi supervisor?')" />
          <q-btn rounded outline color="primary" label="Ver calendario" @click="sendPredefinedMessage('Muéstrame mi calendario')" />
          <q-btn rounded outline color="primary" label="Documentos" @click="sendPredefinedMessage('¿Qué documentos necesito?')" />
          <q-btn rounded outline color="primary" label="Cursos" @click="sendPredefinedMessage('¿Qué cursos debo tomar?')" />
          <q-btn rounded outline color="primary" label="Contactar supervisor" @click="sendPredefinedMessage('Necesito contactar a mi supervisor')" />
        </div>
      </div>

    </q-scroll-area>

    <q-footer bordered class="bg-white text-dark q-py-sm">
      <q-toolbar>
        <q-input
          v-model="newMessage"
          placeholder="Escribe tu pregunta aquí..."
          outlined
          rounded
          dense
          class="full-width"
          @keyup.enter="sendMessage"
        >
          <template v-slot:append>
            <q-btn icon="send" round dense flat color="primary" @click="sendMessage" />
          </template>
        </q-input>
      </q-toolbar>
    </q-footer>

  </q-page>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import { api } from 'boot/axios'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

defineOptions({ name: 'IndexPage' })

const $q = useQuasar()
const route = useRoute()
const router = useRouter()
const chatScrollArea = ref(null) // Referencia para el scroll

// Estado del Chat
const currentMessages = ref([])
const newMessage = ref('')
const userEmail = 'user@tcs.com' // Hardcodeado por ahora
const selectedChatId = ref(null) // ID del chat de la URL

// --- Funciones del Chat ---

// Cargar mensajes cuando el chat ID de la URL cambia
watch(() => route.params.chatId, async (newChatId) => {
  if (newChatId) {
    selectedChatId.value = newChatId
    await fetchMessages(newChatId)
    scrollToBottom()
  } else {
    currentMessages.value = [] // Limpiar si no hay chat seleccionado
    selectedChatId.value = null
  }
}, { immediate: true }) // Ejecutar inmediatamente al cargar la página

// Cargar mensajes de una conversación específica (GET /api/chat/{correo}/{chatId})
async function fetchMessages (chatId) {
  try {
    const emailEscaped = encodeURIComponent(userEmail)
    const response = await api.get(`/chat/${emailEscaped}`)
    const conversation = (response.data || []).find(c => (c.id || c._id || c.chatId) === chatId)
    if (conversation) {
      currentMessages.value = conversation.mensajes || conversation.messages || []
    } else {
      currentMessages.value = []
    }
  } catch (error) {
    console.error('Error al cargar mensajes:', error)
    $q.notify({ type: 'negative', message: 'No se pudieron cargar los mensajes del chat.' })
  }
}

// Enviar un mensaje (Usuario -> API -> Bot) (POST /api/chat/{correo}/{chatId}/mensajes)
async function sendMessage () {
  if (!newMessage.value.trim() || !selectedChatId.value) return

  const userMessage = {
    tipo: 'usuario',
    contenido: newMessage.value,
    timestamp: new Date().toISOString()
  }
  currentMessages.value.push(userMessage)
  scrollToBottom() // Bajar el scroll

  const contentToSend = newMessage.value
  newMessage.value = '' // Limpiar input

  try {
    const emailEscaped = encodeURIComponent(userEmail)
    const response = await api.post(
      `/chat/${emailEscaped}/${selectedChatId.value}/mensajes`,
      { contenido: contentToSend }
    )
    currentMessages.value.push(response.data) // Añadir respuesta del bot
    scrollToBottom() // Bajar el scroll de nuevo
  } catch (error) {
    console.error('Error al enviar mensaje a la IA:', error)
    $q.notify({ type: 'negative', message: 'El Asistente no pudo responder.' })
  }
}

// Enviar un mensaje predefinido (clic en botones)
function sendPredefinedMessage (message) {
  newMessage.value = message
  sendMessage()
}

// Formatear la fecha para mostrar en los mensajes
function formatDate (dateString) {
  const options = { hour: '2-digit', minute: '2-digit' }
  return new Date(dateString).toLocaleTimeString('es-ES', options)
}

// Bajar el scroll del área de chat
async function scrollToBottom () {
  await nextTick() // Esperar a que los mensajes se rendericen
  if (chatScrollArea.value) {
    chatScrollArea.value.setScrollPercentage('vertical', 1)
  }
}

// Cerrar el chat (navegar a una página de inicio sin chat)
function closeChat () {
  router.push('/')
}
</script>

<style lang="scss" scoped>
.q-page {
  height: 100vh; // Ocupa toda la altura de la ventana
  display: flex;
  flex-direction: column;
}

.q-toolbar {
  min-height: 60px; // Altura del toolbar superior del chat
}

.q-footer {
  box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1); // Sombra para el input
  z-index: 10; // Para que esté encima de otros elementos
}
</style>
