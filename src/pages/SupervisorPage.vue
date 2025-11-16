<template>
  <q-page class="q-pa-md" style="background-color: #f8f9fa;">

    <!-- Cabecera del Perfil -->
    <q-card flat class="q-mb-md text-white" style="background: linear-gradient(to right, #8e2de2, #4a00e0);">
      <q-card-section class="text-center">
        <q-avatar size="100px" class="shadow-10">
          <q-avatar size="95px" color="primary" text-color="white">JP</q-avatar>
        </q-avatar>
        <div class="text-h5 q-mt-md">Juan Pérez Rodríguez</div>
        <div class="text-subtitle1">Desarrollo de Software</div>
        <q-chip square color="blue-4" text-color="white" icon="o_star">Supervisor</q-chip>
      </q-card-section>
       <q-banner dense class="bg-white bg-opacity-10 text-center q-py-sm">
        <q-icon name="o_info" class="q-mr-sm" /> ¡Bienvenido al equipo! Estoy aquí para apoyarte en tu proceso de onboarding.
      </q-banner>
    </q-card>

    <!-- Contacto Rápido -->
    <q-card flat bordered class="q-mb-md">
      <q-card-section>
        <div class="text-weight-bold q-mb-sm">Contacto rápido</div>
        <div class="text-grey-8 q-mb-md">Elige la mejor forma de comunicarte</div>
        <q-btn-group spread unelevated>
          <q-btn color="primary" label="Enviar correo" icon="o_email" @click="showEmailDialog = true" />
          <q-btn flat color="dark" label="Llamar" icon="o_call" @click="requestCall" />
          <q-btn flat color="dark" label="Videollamada" icon="o_videocam" @click="requestVideoCall" />
          <q-btn flat color="dark" label="Chat" icon="o_chat" />
        </q-btn-group>
      </q-card-section>
    </q-card>

    <div class="row q-col-gutter-md q-mb-md">
      <!-- Información de contacto -->
      <div class="col-12 col-md-6">
        <q-card flat bordered class="full-height">
          <q-card-section>
            <div class="text-weight-bold">Información de contacto</div>
            <q-list separator class="q-mt-sm">
              <q-item>
                <q-item-section>
                  <q-item-label caption>Email</q-item-label>
                  <q-item-label>{{ supervisor.email }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-btn flat dense round icon="o_content_copy" @click="copyToClipboard(supervisor.email)" />
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label caption>Teléfono</q-item-label>
                  <q-item-label>{{ supervisor.phone }}</q-item-label>
                </q-item-section>
                 <q-item-section side>
                  <q-btn flat dense round icon="o_content_copy" @click="copyToClipboard(supervisor.phone)" />
                </q-item-section>
              </q-item>
               <q-item>
                <q-item-section>
                  <q-item-label caption>Área</q-item-label>
                  <q-item-label>{{ supervisor.area }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>

      <!-- Horario de atención -->
      <div class="col-12 col-md-6">
        <q-card flat bordered class="full-height">
          <q-card-section>
             <div class="text-weight-bold">Horario de atención</div>
             <div class="bg-green-1 q-pa-md rounded-borders q-mt-md">
                <q-badge rounded color="green" class="q-mr-sm"/>
                <span class="text-weight-medium">Disponible ahora</span>
                <div class="q-ml-md">Lunes a Viernes: 9:00 AM - 6:00 PM</div>
             </div>
             <div class="q-mt-md text-weight-medium">Tiempo promedio de respuesta</div>
             <div class="q-gutter-sm q-mt-xs">
                <q-chip outline color="grey-8" icon="o_email">Email: 2-4 horas</q-chip>
                <q-chip outline color="grey-8" icon="o_chat">Chat: 15-30 min</q-chip>
             </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Perfil -->
    <q-card flat bordered class="q-mb-md">
       <q-card-section>
        <div class="text-weight-bold">Perfil</div>
        <p class="q-mt-sm text-grey-8">Líder de equipo con más de 10 años de experiencia en desarrollo de software y gestión de proyectos ágiles.</p>
        <div class="row q-col-gutter-md q-mt-sm text-center">
          <div class="col-4">
            <div class="q-pa-md rounded-borders" style="border: 1px solid #e0e0e0">
              <div class="text-h6">4.9/5.0</div>
              <div class="text-caption text-grey-7">Calificación</div>
            </div>
          </div>
           <div class="col-4">
            <div class="q-pa-md rounded-borders" style="border: 1px solid #e0e0e0">
              <div class="text-h6">10+ años</div>
              <div class="text-caption text-grey-7">Años en TCS</div>
            </div>
          </div>
           <div class="col-4">
            <div class="q-pa-md rounded-borders" style="border: 1px solid #e0e0e0">
              <div class="text-h6">15+</div>
              <div class="text-caption text-grey-7">Certificaciones</div>
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>

     <!-- Consejos para comunicarte -->
    <q-card flat bordered>
      <q-card-section>
         <div class="text-weight-bold">Consejos para comunicarte</div>
         <q-list class="q-mt-sm">
           <q-item dense v-for="tip in tips" :key="tip">
             <q-item-section avatar>
               <q-icon color="green" name="o_check_circle" />
             </q-item-section>
             <q-item-section>{{ tip }}</q-item-section>
           </q-item>
         </q-list>
      </q-card-section>
    </q-card>

    <!-- Diálogo para Enviar Correo -->
    <q-dialog v-model="showEmailDialog">
      <q-card style="width: 500px; max-width: 90vw;">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Enviar correo a {{ supervisor.name }}</div>
          <q-space />
          <q-btn icon="o_close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <p>Escribe tu mensaje y te responderá lo antes posible</p>
          <q-input
            label="Para"
            :model-value="supervisor.email"
            readonly
            outlined
            class="q-mb-md"
          >
            <template v-slot:prepend>
              <q-icon name="o_email" />
            </template>
          </q-input>
          <q-input
            v-model="emailMessage"
            label="Mensaje"
            type="textarea"
            outlined
            counter
            maxlength="500"
            autogrow
          />
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat label="Cancelar" color="primary" v-close-popup />
          <q-btn unelevated label="Enviar mensaje" color="dark" icon="send" @click="sendEmail" />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup>
import { ref } from 'vue';
import { useQuasar } from 'quasar';

defineOptions({ name: 'SupervisorPage' });

const $q = useQuasar();

const supervisor = ref({
  name: 'Juan Pérez Rodríguez',
  email: 'juan.perez@tcs.com',
  phone: '+51 999 888 777',
  area: 'Desarrollo de Software'
});

const tips = [
  'Para dudas urgentes, usa el chat o llama directamente',
  'Para temas más extensos, envía un correo con contexto detallado',
  'Agenda videollamadas para sesiones de seguimiento o feedback'
];

const showEmailDialog = ref(false);
const emailMessage = ref('');

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    $q.notify({
      message: '¡Texto copiado!',
      color: 'positive',
      icon: 'o_check',
      position: 'top',
      timeout: 1000
    });
  });
}

function sendEmail() {
  if (!emailMessage.value.trim()) {
    $q.notify({ message: 'El mensaje no puede estar vacío.', color: 'negative', icon: 'o_warning' });
    return;
  }

  // Simulación de envío
  showEmailDialog.value = false;
  $q.notify({
    message: 'Correo enviado con éxito',
    color: 'positive',
    icon: 'o_check_circle',
    position: 'top'
  });
  emailMessage.value = ''; // Limpiar mensaje
}

function requestCall() {
  $q.notify({
    icon: 'task_alt',
    color: 'white',
    textColor: 'dark',
    message: 'Solicitud enviada',
    caption: 'Tu supervisor recibirá una notificación para agendar una llamada.',
    position: 'bottom-right',
    timeout: 3000
  });
}

function requestVideoCall() {
  $q.notify({
    icon: 'task_alt',
    color: 'white',
    textColor: 'dark',
    message: 'Reunión agendada',
    caption: 'Se ha enviado una invitación de videollamada.',
    position: 'bottom-right',
    timeout: 3000
  });
}

</script>

<style lang="scss" scoped>
.bg-opacity-10 {
  background-color: rgba(255, 255, 255, 0.1) !important;
}
</style>
