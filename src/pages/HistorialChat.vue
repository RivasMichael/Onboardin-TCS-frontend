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
        :selected-documents="selectedDocument ? [selectedDocument] : []"
        class="col"
        @toggle-drawer="$emit('toggle-drawer')"
        @send-message="handleSendMessage"
      />
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

const handleSendMessage = ({ message, documents }) => {
  console.log('Mensaje:', message)
  console.log('Documento seleccionado (ID):', documents)
  // Aquí iría la lógica para enviar al backend con el ID del documento
  // POST /api/chat/send { message, documentId: documents[0] }
}
</script>

<style lang="scss" scoped>
.border-bottom {
  border-bottom: 1px solid $grey-3;
}
</style>
