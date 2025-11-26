<template>
  <div class="chat-box column no-wrap">
    <!-- Mensajes -->
    <q-scroll-area class="col q-pa-md">
      <div class="q-gutter-md">
        <div v-for="msg in messages" :key="msg.id" class="message-container" :class="msg.sender">
          <q-chat-message
            :sent="msg.sender === 'user'"
            :bg-color="msg.sender === 'user' ? 'primary' : 'grey-2'"
            text-color="white"
          >
            <template v-if="msg.sender === 'assistant'" v-slot:avatar>
              <q-avatar class="q-mr-sm">
                <img src="https://cdn-icons-png.flaticon.com/512/2593/2593641.png">
              </q-avatar>
            </template>
            {{ msg.text }}
            <q-chat-message-stamp>{{ msg.timestamp }}</q-chat-message-stamp>
          </q-chat-message>

          <!-- Acciones si es del asistente -->
          <div v-if="msg.sender === 'assistant' && msg.actions" class="row q-gutter-x-sm q-mt-md">
            <q-btn
              v-for="action in msg.actions"
              :key="action.label"
              outline
              dense
              no-caps
              color="primary"
              :label="action.label"
              @click="$emit('action', action.value)"
            />
          </div>
        </div>
      </div>
    </q-scroll-area>

    <q-separator />

    <!-- Input área -->
    <div class="q-pa-md bg-white">
      <!-- Documentos seleccionados info -->
      <div v-if="selectedDocuments && selectedDocuments.length > 0" class="q-mb-md q-pa-sm bg-blue-1 rounded-borders">
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

      <!-- Input -->
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
            :disable="!newMessage.trim() || loading || !selectedDocuments || selectedDocuments.length === 0"
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
    default: () => []
  }
})

const emit = defineEmits(['toggle-drawer', 'action', 'send-message'])
const $q = useQuasar()

const newMessage = ref('')
const messages = ref([
  {
    id: 1,
    sender: 'assistant',
    text: '¡Hola! 👋 Soy tu asistente de onboarding. Selecciona un documento y hazme preguntas sobre él.',
    timestamp: '09:00'
  }
])

const loading = ref(false)

const docLabels = {
  politicas: 'Políticas',
  beneficios: 'Beneficios',
  onboarding: 'Onboarding',
  codigo_conducta: 'Código de Conducta',
  sistemas: 'Sistemas',
  organo: 'Organigrama'
}

const getDocLabel = (docId) => docLabels[docId] || docId

const sendMessage = async () => {
  if (!newMessage.value.trim()) return

  // Validar que haya documento seleccionado
  if (!props.selectedDocuments || props.selectedDocuments.length === 0) {
    $q.notify({
      type: 'warning',
      message: 'Por favor selecciona un documento primero'
    })
    return
  }

  const messageText = newMessage.value
  const documentId = props.selectedDocuments[0]

  // Agregar mensaje del usuario AL CHAT INMEDIATAMENTE
  messages.value.push({
    id: messages.value.length + 1,
    sender: 'user',
    text: messageText,
    timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
  })

  // Emitir evento para que el padre maneje la lógica
  emit('send-message', {
    message: messageText,
    documents: props.selectedDocuments
  })

  newMessage.value = ''
  loading.value = true

  try {
    // Llamar al backend: POST /api/documentos/{id}/preguntar
    const response = await api.post(`/documentos/${documentId}/preguntar`, {
      pregunta: messageText
    })

    // Mostrar solo la pregunta y la respuesta generada por Ollama
    const r = response.data
    let msg = ''
    if (r.pregunta) {
      msg += `<b>Pregunta:</b> ${r.pregunta}<br>`
    }
    if (r.respuesta) {
      msg += `<b>Respuesta:</b> ${r.respuesta}`
    } else {
      msg += 'No pude obtener una respuesta'
    }
    messages.value.push({
      id: messages.value.length + 1,
      sender: 'assistant',
      text: msg,
      timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
    })
  } catch (err) {
    console.error('Error al enviar pregunta:', err)
    
    // Mostrar error en el chat
    messages.value.push({
      id: messages.value.length + 1,
      sender: 'assistant',
      text: '❌ Error al procesar tu pregunta. Por favor intenta de nuevo.',
      timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
    })

    $q.notify({
      type: 'negative',
      message: 'Error al enviar la pregunta'
    })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped lang="scss">
.chat-box {
  height: 100%;
  background: $grey-1;

  .message-container {
    &.user {
      display: flex;
      justify-content: flex-end;
    }

    &.assistant {
      display: flex;
      justify-content: flex-start;
    }
  }
}
</style>
