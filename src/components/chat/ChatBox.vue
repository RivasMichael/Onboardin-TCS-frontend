<template>
  <div class="chat-box column no-wrap">
    <!-- 💬 ZONA DE MENSAJES -->
    <div class="col q-pa-md messages-scroll">
      <!-- 🔴 DEBUG FIJO PARA VER SI ESTO SE RENDERIZA -->
      <div class="debug-static">DEBUG: zona de mensajes cargada</div>

      <!-- Lista de mensajes -->
      <div class="messages-area">
        <div v-for="msg in messages" :key="msg.id" class="bubble" :class="msg.sender">
          <div class="bubble-inner">
            <!-- Avatar del asistente -->
            <div v-if="msg.sender === 'assistant'" class="bubble-avatar">
              <q-avatar size="28px" class="q-mr-sm">
                <img src="https://cdn-icons-png.flaticon.com/512/2593/2593641.png" />
              </q-avatar>
            </div>

            <!-- Cuerpo del mensaje -->
            <div class="bubble-body">
              <div class="bubble-text">
                {{ msg.text }}
              </div>
              <div class="bubble-time">
                {{ msg.timestamp }}
              </div>
            </div>
          </div>
        </div>

        <!-- Si no hay mensajes -->
        <div v-if="messages.length === 0" class="empty-state">
          Empieza el chat enviando tu primera pregunta 🙂
        </div>
      </div>
    </div>

    <q-separator />

    <!-- 📝 INPUT DEL CHAT -->
    <div class="q-pa-md bg-white">
      <!-- Documentos seleccionados -->
      <div
        v-if="selectedDocuments && selectedDocuments.length > 0"
        class="q-mb-md q-pa-sm bg-blue-1 rounded-borders"
      >
        <div class="text-caption text-weight-bold q-mb-xs">Documentos activos:</div>
        <div class="row q-gutter-xs">
          <q-chip
            v-for="doc in selectedDocuments"
            :key="doc"
            dense
            size="sm"
            color="primary"
            text-color="white"
            :label="getDocLabel(doc)"
          />
        </div>
      </div>

      <!-- Campo de texto -->
      <q-input
        v-model="newMessage"
        placeholder="Escribe tu pregunta aquí..."
        outlined
        rounded
        class="full-width"
        :disable="loading || !selectedDocuments || selectedDocuments.length === 0"
        @keyup.enter="sendMessage"
      >
        <template v-slot:after>
          <q-btn
            round
            dense
            flat
            icon="send"
            color="primary"
            :disable="
              !newMessage.trim() || loading || !selectedDocuments || selectedDocuments.length === 0
            "
            :loading="loading"
            @click="sendMessage"
          />
        </template>
      </q-input>

      <div class="text-caption text-grey-6 q-mt-xs text-center">Presiona Enter para enviar</div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { api } from 'src/boot/axios'

const props = defineProps({
  selectedDocuments: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['toggle-drawer', 'action', 'send-message', 'new-message'])

const $q = useQuasar()

const newMessage = ref('')
const messages = ref([
  {
    id: 1,
    sender: 'assistant',
    text: '¡Hola! 👋 Soy tu asistente de onboarding. Selecciona un documento y hazme preguntas sobre él.',
    timestamp: '09:00',
  },
])

const loading = ref(false)

const docLabels = {
  politicas: 'Políticas',
  beneficios: 'Beneficios',
  onboarding: 'Onboarding',
  codigo_conducta: 'Código de Conducta',
  sistemas: 'Sistemas',
  organo: 'Organigrama',
}

const getDocLabel = (docId) => docLabels[docId] || docId

const sendMessage = async () => {
  if (!newMessage.value.trim()) return

  if (!props.selectedDocuments || props.selectedDocuments.length === 0) {
    $q.notify({ type: 'warning', message: 'Por favor selecciona un documento primero' })
    return
  }

  const messageText = newMessage.value
  const documentId = props.selectedDocuments[0]

  // Agregar mensaje del usuario
  messages.value.push({
    id: messages.value.length + 1,
    sender: 'user',
    text: messageText,
    timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
  })

  emit('new-message', { role: 'user', text: messageText, documents: props.selectedDocuments })
  emit('send-message', { message: messageText, documents: props.selectedDocuments })

  newMessage.value = ''
  loading.value = true

  try {
    const response = await api.post(`/documentos/${documentId}/preguntar`, {
      pregunta: messageText,
    })

    const answerText =
      response?.data?.respuesta ||
      response?.data?.response ||
      response?.data?.answer ||
      (typeof response?.data === 'string' ? response.data : null) ||
      (response?.data && response.data.text) ||
      'No pude obtener una respuesta'

    const assistantText = typeof answerText === 'string' ? answerText : JSON.stringify(answerText)

    messages.value.push({
      id: messages.value.length + 1,
      sender: 'assistant',
      text: assistantText,
      timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
    })

    emit('new-message', { role: 'assistant', text: assistantText, document: documentId })
  } catch (err) {
    console.error('Error al enviar pregunta:', err)

    messages.value.push({
      id: messages.value.length + 1,
      sender: 'assistant',
      text: '❌ Error al procesar tu pregunta. Por favor intenta de nuevo.',
      timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
    })

    $q.notify({ type: 'negative', message: 'Error al enviar la pregunta' })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped lang="scss">
.chat-box {
  height: 100%;
  background: $grey-1;
}

/* 🔴 Texto debug */
.debug-static {
  font-size: 12px;
  color: red;
  margin-bottom: 8px;
}

.messages-scroll {
  overflow-y: auto;
}

.messages-area {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.bubble {
  display: flex;
  width: 100%;
}

.bubble.user {
  justify-content: flex-end;
}

.bubble.assistant {
  justify-content: flex-start;
}

.bubble-inner {
  display: flex;
  max-width: 70%;
}

.bubble-avatar {
  display: flex;
  align-items: flex-end;
}

.bubble-body {
  background: #f1f1f1;
  border-radius: 18px;
  padding: 8px 12px;
  font-size: 14px;
  line-height: 1.4;
}

.bubble.user .bubble-body {
  background: #1976d2;
  color: white;
}

.bubble.assistant .bubble-body {
  background: white;
  color: black;
}

.bubble-text {
  white-space: pre-wrap;
  word-break: break-word;
}

.bubble-time {
  font-size: 11px;
  opacity: 0.7;
  margin-top: 4px;
  text-align: right;
}

.empty-state {
  font-size: 13px;
  color: #777;
  text-align: center;
  margin-top: 16px;
}
</style>
