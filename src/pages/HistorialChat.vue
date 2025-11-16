<template>
  <q-page class="q-pa-md flex column no-wrap">

    <!-- SECCIÓN DE MENSAJES IMPORTANTES (EXPANDIBLE) -->
    <div class="q-mb-md">
      <div class="row items-center justify-between">
        <div class="text-h6 text-weight-bold">Mensajes importantes</div>
        <div>
          <q-chip dense color="primary" text-color="white">5 Nuevos</q-chip>
          <q-btn
            flat
            round
            dense
            :icon="isMessagesExpanded ? 'o_expand_less' : 'o_expand_more'"
            @click="isMessagesExpanded = !isMessagesExpanded"
          />
        </div>
      </div>

      <q-slide-transition>
        <div v-if="isMessagesExpanded" class="q-gutter-y-md q-mt-sm">
          <q-card
            v-for="message in messages"
            :key="message.id"
            flat
            bordered
            class="message-card"
            :style="`border-left: 5px solid ${message.color}`"
          >
            <q-card-section class="row items-center no-wrap">
              <q-icon :name="message.icon" :color="message.color" size="sm" class="q-mr-md" />
              <div class="col">
                <div class="row items-center q-gutter-x-sm">
                  <span class="text-weight-bold">{{ message.title }}</span>
                  <q-chip dense :color="message.color" text-color="white" class="text-uppercase text-weight-bold">{{ message.priority }}</q-chip>
                  <q-chip dense color="red-6" text-color="white" class="text-weight-bold">Nuevo</q-chip>
                </div>
                <p class="text-grey-8 q-mt-xs q-mb-none">{{ message.body }}</p>
                <div class="row items-center q-gutter-x-md q-mt-sm">
                  <q-btn flat dense no-caps padding="none" color="primary" label="Marcar como leído" />
                  <span class="text-caption text-grey-6">{{ message.timestamp }}</span>
                </div>
              </div>
              <q-space />
              <div class="row items-center q-gutter-x-sm">
                <q-btn flat round dense icon="o_favorite_border" size="sm" />
                <q-btn flat round dense icon="o_close" size="sm" />
              </div>
            </q-card-section>
          </q-card>
        </div>
      </q-slide-transition>
    </div>

    <!-- SECCIÓN DEL ASISTENTE INTELIGENTE (CHAT) -->
    <div v-if="!isMessagesExpanded" class="col column no-wrap">
      <!-- Banner Superior del Asistente -->
      <q-toolbar class="bg-deep-purple-5 text-white shadow-2">
        <q-btn flat round dense icon="menu" @click="$emit('toggle-drawer')" />
        <q-toolbar-title>
          Asistente Inteligente
          <div class="text-caption">Disponible 24/7. Siempre aquí para ayudarte</div>
        </q-toolbar-title>
        <q-chip dense color="white" text-color="dark">1 mensajes</q-chip>
      </q-toolbar>

      <!-- Área de Mensajes del Chat -->
      <q-scroll-area class="col q-pa-md">
        <q-chat-message bg-color="grey-2">
          <template v-slot:avatar>
            <q-avatar class="q-mr-sm">
              <img src="https://cdn-icons-png.flaticon.com/512/2593/2593641.png">
            </q-avatar>
          </template>
          <div>¡Hola María González! 👋 Soy tu asistente... ¿En qué puedo ayudarte hoy?</div>
          <div class="q-mt-sm row q-gutter-x-sm">
            <q-btn outline dense no-caps color="primary" label="Ver mi calendario >" />
            <q-btn outline dense no-caps color="primary" label="Contactar supervisor >" />
          </div>
          <q-chat-message-stamp>21:32</q-chat-message-stamp>
        </q-chat-message>
      </q-scroll-area>

      <q-separator />

      <!-- Preguntas Frecuentes y Área de Input -->
      <div class="q-pa-md bg-white">
        <div class="row items-center q-mb-md">
          <q-icon name="o_hub" class="q-mr-sm" />
          <div class="text-weight-medium">Preguntas frecuentes:</div>
        </div>
        <div class="row q-gutter-md q-mb-md">
          <q-btn v-for="question in frequentQuestions" :key="question.label" :icon="question.icon" :label="question.label" outline rounded no-caps color="grey-8" class="col-auto" />
        </div>
        <q-input v-model="newMessage" placeholder="Escribe tu pregunta aquí..." outlined rounded class="full-width" @keyup.enter="sendMessage">
          <template v-slot:after>
            <q-btn round dense flat icon="send" color="primary" @click="sendMessage" />
          </template>
        </q-input>
        <div class="text-caption text-grey-6 q-mt-xs text-center">Presiona Enter para enviar. Disponible 24/7</div>
      </div>
    </div>

  </q-page>
</template>

<script setup>
import { ref } from 'vue';

defineOptions({ name: 'DashboardChatPage' });

defineEmits(['toggle-drawer']);

const isMessagesExpanded = ref(true);
const newMessage = ref('');

const messages = ref([
  { id: 1, icon: 'o_campaign', color: 'red-6', title: '¡Bienvenido a TCS!', priority: 'alta', body: 'Hola María González, estamos muy emocionados de tenerte en el equipo. Tu viaje de onboarding comienza aquí. ¡Éxito!', timestamp: '15 nov, 21:33' },
  { id: 2, icon: 'o_pending_actions', color: 'red-6', title: '¡Solo faltan 5 días!', priority: 'alta', body: 'Tu primer día está cada vez más cerca. Asegúrate de tener lista tu documentación y revisa el calendario de actividades.', timestamp: '15 nov, 21:33' },
  { id: 3, icon: 'o_star_border', color: 'red-6', title: '¡Hoy es tu primer día!', priority: 'alta', body: '¡Felicidades María González! Hoy comienza tu aventura en TCS. Te deseamos mucho éxito. ¡A dar lo mejor!', timestamp: '15 nov, 21:33' },
  { id: 4, icon: 'o_lightbulb', color: 'orange-6', title: 'Prepárate para el éxito', priority: 'media', body: 'Recuerda que el equipo de RRHH y tu supervisor están aquí para apoyarte. No dudes en hacer preguntas.', timestamp: '15 nov, 21:33' },
  { id: 5, icon: 'o_coffee', color: 'blue-6', title: 'Consejo del día', priority: 'baja', body: 'Aprovecha para conocer a tus compañeros durante el café. Las mejores conexiones se hacen en momentos informales.', timestamp: '15 nov, 21:33' }
]);

const frequentQuestions = ref([
  { icon: 'o_calendar_today', label: '¿Cuándo empiezo?' },
  { icon: 'o_supervisor_account', label: 'Mi supervisor' },
  { icon: 'o_event', label: 'Ver calendario' },
  { icon: 'o_description', label: 'Documentos' },
  { icon: 'o_school', label: 'Cursos' },
  { icon: 'o_support_agent', label: 'Contactar supervisor' }
]);

function sendMessage() {
  if (!newMessage.value.trim()) return;
  console.log('Enviando mensaje:', newMessage.value);
  newMessage.value = '';
}
</script>

<style lang="scss" scoped>
.message-card {
  border-radius: 8px;
}
</style>
