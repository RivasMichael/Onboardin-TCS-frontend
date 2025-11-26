<template>
  <q-page class="q-pa-md flex column no-wrap">
    <!-- Chat con Documentos -->
    <div class="col column no-wrap bg-white rounded-borders shadow-1">
      <!-- Documentos como Tabs (Superior) -->
      <div class="q-pa-md border-bottom">
        <div class="row items-center q-gutter-md q-mb-md">
          <span class="text-weight-bold text-grey-8">Documentos:</span>

          <!-- Loading skeleton -->
          <div v-if="loading" class="row q-gutter-md">
            <q-skeleton type="QBtn" width="150px" height="36px" />
            <q-skeleton type="QBtn" width="150px" height="36px" />
            <q-skeleton type="QBtn" width="150px" height="36px" />
          </div>

          <!-- Sin documentos -->
          <div v-else-if="availableDocuments.length === 0" class="text-grey-6">
            No hay documentos disponibles
          </div>

          <!-- Botones de documentos -->
          <q-btn
            v-for="doc in availableDocuments"
            v-else
            :key="doc.id"
            :outline="selectedDocument !== doc.id"
            :unelevated="selectedDocument === doc.id"
            :color="selectedDocument === doc.id ? 'primary' : 'grey-6'"
            :text-color="selectedDocument === doc.id ? 'white' : 'grey-8'"
            :icon="doc.icon"
            :label="doc.label"
            size="sm"
            rounded
            @click="selectedDocument = doc.id"
          />
        </div>

        <!-- Documento seleccionado como chip -->
        <div v-if="selectedDocument && !loading" class="row q-gutter-sm">
          <q-chip
            color="primary"
            text-color="white"
            :label="getDocumentLabel(selectedDocument)"
            removable
            @remove="selectedDocument = null"
          />
        </div>
      </div>

      <!-- Chat Box -->
      <ChatBox
        :messages="messages"
        :selected-documents="selectedDocument ? [selectedDocument] : []"
        :loading="loading"
        class="col"
        @toggle-drawer="$emit('toggle-drawer')"
        @send-message="handleSendMessage"
      />
      <!-- Ventana flotante para mostrar la última respuesta -->
      <q-dialog v-model="showResponseDialog">
        <q-card>
          <q-card-section>
            <div class="text-h6">Respuesta del asistente</div>
            <div>{{ lastAssistantResponse }}</div>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="Cerrar" color="primary" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { api } from 'src/boot/axios'
import ChatBox from 'src/components/chat/ChatBox.vue'

defineOptions({ name: 'HistorialChatPage' })
defineEmits(['toggle-drawer'])

const $q = useQuasar()
const selectedDocument = ref(null)
const availableDocuments = ref([])
const loading = ref(false)
const showResponseDialog = ref(false)
const lastAssistantResponse = ref('')

// Estado del chat, ahora gestionado por el padre
const messages = ref([
  {
    id: 1,
    sender: 'assistant',
    text: '¡Hola! 👋 Soy tu asistente de onboarding. Selecciona un documento y hazme preguntas sobre él.',
    timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
  },
  {
    id: 2,
    sender: 'user',
    text: '¿Qué me dice este pdf?',
    timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
  },
  {
    id: 3,
    sender: 'assistant',
    text: 'Este documento titulado "Conoce a Tu Equipo" es parte del material de onboarding.',
    timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
  },
])

// Cargar documentos del backend
const loadDocuments = async () => {
  loading.value = true
  try {
    const response = await api.get('/documentos')
    console.log('Documentos cargados:', response.data)

    if (response.data && Array.isArray(response.data)) {
      availableDocuments.value = response.data.map((doc) => ({
        id: doc.id,
        value: doc.id,
        label: doc.titulo,
        icon: 'o_description',
        description: doc.descripcion,
      }))
      console.log('Documentos procesados:', availableDocuments.value)
    } else {
      throw new Error('Formato de respuesta inválido')
    }
  } catch (err) {
    console.error('Error al cargar documentos:', err.message)
    $q.notify({
      type: 'negative',
      message: 'Error al cargar los documentos: ' + err.message,
    })
  } finally {
    loading.value = false
  }
}

// Cargar documentos al montar el componente
onMounted(() => {
  loadDocuments()
})

const getDocumentLabel = (docId) => {
  const doc = availableDocuments.value.find((d) => d.id === docId)
  return doc ? doc.label : docId
}

// Lógica de envío de mensajes, ahora centralizada aquí
const handleSendMessage = async ({ message }) => {
  if (!message || !selectedDocument.value) return

  const documentId = selectedDocument.value

  // 1. Agregar mensaje del usuario a la lista
  messages.value.push({
    id: messages.value.length + 1,
    sender: 'user',
    text: message,
    timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
  })

  // 2. Llamar a la API
  try {
    const response = await api.post(`/documentos/${documentId}/preguntar`, {
      pregunta: message,
    })
    console.log('Respuesta de la API:', response.data)

    // 3. Agregar respuesta del asistente
    const respuesta =
      response.data.respuesta || response.data.response || 'No se recibió una respuesta clara.'
    messages.value.push({
      id: messages.value.length + 1,
      sender: 'assistant',
      text: respuesta,
      timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
    })

    lastAssistantResponse.value = respuesta
    showResponseDialog.value = true
  } catch (error) {
    console.error('Error al contactar la API:', error)
    // 4. Agregar mensaje de error
    messages.value.push({
      id: messages.value.length + 1,
      sender: 'assistant',
      text: 'Lo siento, ocurrió un error al procesar tu pregunta.',
      timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
    })
    lastAssistantResponse.value = 'Lo siento, ocurrió un error al procesar tu pregunta.'
    showResponseDialog.value = true
    $q.notify({
      type: 'negative',
      message: 'Error al enviar la pregunta.',
    })
  }
}
</script>

<style lang="scss" scoped>
.border-bottom {
  border-bottom: 1px solid $grey-3;
}
</style>
