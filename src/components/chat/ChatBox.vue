<template>
  <div class="chat-box column no-wrap">
    <!-- Mensajes -->
    <q-scroll-area class="col q-pa-md">
      <div class="q-gutter-md">
        <div
          v-for="msg in messages"
          :key="msg.id"
          class="message-container q-mb-md"
          :class="msg.sender"
        >
          <q-card
            flat
            bordered
            class="q-pa-md"
            :class="msg.sender === 'user' ? 'bg-blue-1 justify-end' : 'bg-grey-2 justify-start'"
          >
            <div class="row items-center q-gutter-sm">
              <q-avatar v-if="msg.sender === 'assistant'" size="32px" class="q-mr-sm">
                <img src="https://cdn-icons-png.flaticon.com/512/2593/2593641.png" />
              </q-avatar>
              <div class="col">
                <div class="text-body1">{{ msg.text }}</div>
                <div class="text-caption text-grey-6 q-mt-xs">{{ msg.timestamp }}</div>
              </div>
            </div>
          </q-card>
        </div>
      </div>
    </q-scroll-area>

    <q-separator />

    <!-- Input área -->
    <div class="q-pa-md bg-white">
      <!-- Documentos seleccionados info -->
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

      <!-- Input -->
      <q-input
        v-model="newMessage"
        placeholder="Escribe tu pregunta aquí..."
        outlined
        rounded
        class="full-width"
        :disable="props.loading || !props.selectedDocuments || props.selectedDocuments.length === 0"
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
              !newMessage.trim() ||
              props.loading ||
              !props.selectedDocuments ||
              props.selectedDocuments.length === 0
            "
            :loading="props.loading"
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

const props = defineProps({
  messages: {
    type: Array,
    default: () => [],
  },
  selectedDocuments: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['toggle-drawer', 'action', 'send-message'])
const $q = useQuasar()

const newMessage = ref('')
// const loading = ref(false)

const docLabels = {
  politicas: 'Políticas',
  beneficios: 'Beneficios',
  onboarding: 'Onboarding',
  codigo_conducta: 'Código de Conducta',
  sistemas: 'Sistemas',
  organo: 'Organigrama',
}

const getDocLabel = (docId) => docLabels[docId] || docId

// La lógica se ha movido al padre. Este componente solo emite el evento.
const sendMessage = () => {
  if (!newMessage.value.trim()) return

  if (!props.selectedDocuments || props.selectedDocuments.length === 0) {
    $q.notify({
      type: 'warning',
      message: 'Por favor selecciona un documento primero',
    })
    return
  }

  // Emitir el evento para que el padre lo maneje
  emit('send-message', {
    message: newMessage.value.trim(),
  })

  // Limpiar el input
  newMessage.value = ''
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
