<template>
  <q-page>
    <q-splitter v-model="splitterModel" style="height: calc(100vh - 88px)">
      
      <template v-slot:before>
        <q-list bordered padding>
          <q-item-label header>Historial de Chats</q-item-label>
          
          <q-item clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="add" />
            </q-item-section>
            <q-item-section>Nueva conversación</q-item-section>
          </q-item>

          <q-item
            v-for="convo in conversations"
            :key="convo.id"
            clickable
            v-ripple
            @click="selectConversation(convo)"
          >
            <q-item-section>
              {{ convo.titulo }}
            </q-item-section>
          </q-item>
        </q-list>
      </template>

      <template v-slot:after>
        <q-scroll-area class="chat-messages">
          <q-chat-message
            v-for="msg in currentMessages"
            :key="msg.timestamp"
            :sent="msg.tipo === 'usuario'"
            :bg-color="msg.tipo === 'usuario' ? 'primary' : 'grey-2'"
            :text-color="msg.tipo === 'usuario' ? 'white' : 'black'"
          >
            <div style="white-space: pre-wrap;">{{ msg.contenido }}</div>
          </q-chat-message>
        </q-scroll-area>

        <q-input
          class="chat-input"
          v-model="newMessage"
          placeholder="Escribe tu pregunta aquí..."
          outlined
          @keyup.enter="sendMessage"
        >
          <template v-slot:append>
            <q-btn icon="send" round dense flat @click="sendMessage" />
          </template>
        </q-input>
      </template>

    </q-splitter>
  </q-page>
</template>

<script setup>
// Importamos las herramientas de Vue y Quasar
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
// ¡Importamos axios para llamar a la API!
import { api } from 'boot/axios'

// 1. DEFINIR EL "ESTADO" (Las variables que usa la página)
// -----------------------------------------------------------------

// Para el <q-splitter>
const splitterModel = ref(25) // 25% para el panel izquierdo

// El correo del usuario (lo "quemamos" por ahora, hasta que el Login funcione)
const userEmail = 'user@tcs.com'

// La lista de chats (viene de la API)
const conversations = ref([]) // Un array vacío

// El ID del chat que está abierto
const selectedChatId = ref(null) 

// Los mensajes del chat que está abierto
const currentMessages = ref([]) // Un array vacío

// El texto que el usuario está escribiendo
const newMessage = ref('')

const $q = useQuasar()

// 2. DEFINIR LAS "ACCIONES" (Las funciones)
// -----------------------------------------------------------------

// ---
// Copilot, ayúdame a crear la función 'fetchConversations'.
// Debe usar 'api.get' para llamar al endpoint que probamos en Swagger:
// GET /api/chat/{correo}
// (Esta es la prueba de Swagger: image_d27a0b.png)
// ---
async function fetchConversations () {
  try {
    const emailEscaped = encodeURIComponent(userEmail)
    const response = await api.get(`/chat/${emailEscaped}`)
    conversations.value = response.data // Guardamos la lista de chats
    
    // Opcional: abrir el primer chat automáticamente
    if (conversations.value.length > 0) {
      selectConversation(conversations.value[0])
    }
  } catch (error) {
    console.error('Error al cargar conversaciones:', error)
    $q.notify({ type: 'negative', message: 'No se pudo cargar el historial.' })
  }
}

// ---
// Copilot, esta función se llama cuando hago clic en un chat del historial.
// Debe actualizar 'currentMessages' y 'selectedChatId'.
// ---
function selectConversation (convo) {
  // Algunas APIs devuelven los mensajes en una propiedad llamada 'mensajes' o 'messages'
  currentMessages.value = convo.mensajes || convo.messages || []
  selectedChatId.value = convo.id
}

// ---
// Copilot, ayúdame a crear la función 'sendMessage'.
// Esta es la función más importante (IA).
// Debe hacer lo que probamos en Swagger (image_d2d802.png):
// 1. Tomar el texto de 'newMessage'.
// 2. Llamar al endpoint 'POST /api/chat/{correo}/{chatId}/mensajes'.
// 3. Añadir la respuesta del 'bot' a la lista 'currentMessages'.
// ---
async function sendMessage () {
  if (!newMessage.value.trim() || !selectedChatId.value) return

  const userMessage = {
    tipo: 'usuario',
    contenido: newMessage.value,
    timestamp: new Date().toISOString()
  }

  // 1. Añadir el mensaje del usuario a la pantalla INMEDIATAMENTE
  currentMessages.value.push(userMessage)
  
  const contentToApi = newMessage.value
  newMessage.value = '' // Limpiar la caja de texto

  try {
    // 2. Llamar a la API (el "motor" con Ollama)
    const emailEscaped = encodeURIComponent(userEmail)
    const response = await api.post(
      `/chat/${emailEscaped}/${selectedChatId.value}/mensajes`,
      { contenido: contentToApi } // Este es el JSON que probaste en Swagger
    )

    // 3. Añadir la respuesta del bot a la pantalla
    // Asumimos que la API devuelve un objeto de mensaje en response.data
    currentMessages.value.push(response.data)

  } catch (error) {
    console.error('Error al llamar a la IA:', error)
    $q.notify({ type: 'negative', message: 'El Asistente no pudo responder.' })
  }
}

// 3. EJECUTAR AL CARGAR
// -----------------------------------------------------------------
// Copilot, usa 'onMounted' para llamar a 'fetchConversations'
// automáticamente cuando la página se carga.
// ---
onMounted(() => {
  fetchConversations()
})
</script>

<style lang="scss" scoped>
.chat-messages {
  height: calc(100% - 70px); // Todo el alto menos la caja de texto
  padding: 10px;
}

.chat-input {
  height: 70px; // Alto fijo para la caja de texto
  position: absolute;
  bottom: 0;
  width: 100%;
  background-color: white;
  padding: 10px;
}
</style>
