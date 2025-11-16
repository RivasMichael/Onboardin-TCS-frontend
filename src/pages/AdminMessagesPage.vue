<template>
  <q-page class="q-pa-md bg-grey-1">

    <!-- Encabezado y Botón de Acción -->
    <div class="row justify-between items-center q-mb-md">
      <div>
        <div class="text-h6 text-weight-bold">Gestión de Mensajes</div>
        <div class="text-subtitle2 text-grey-8">Configura mensajes automáticos y motivacionales para nuevos colaboradores</div>
      </div>
      <q-btn unelevated color="dark" icon="add" label="Nuevo mensaje" no-caps @click="openCreateDialog" />
    </div>

    <!-- Tarjetas de Resumen -->
    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col" v-for="summary in summaries" :key="summary.label">
        <q-card flat bordered>
          <q-card-section>
            <div class="text-subtitle2 text-grey-7">{{ summary.label }}</div>
            <div class="text-h4 text-weight-bold" :class="`text-${summary.color}`">{{ summary.value }}</div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Lista de Mensajes (si no está vacía) -->
    <div v-if="messages.length > 0" class="q-gutter-y-md">
      <q-card v-for="msg in messages" :key="msg.id" flat bordered>
        <q-card-section class="row q-gutter-md">
          <q-avatar icon="o_notifications" color="blue-1" text-color="blue-7" />
          <div class="col">
            <div class="row items-center q-gutter-x-sm">
              <span class="text-weight-bold">{{ msg.title }}</span>
              <q-chip dense :color="getPriorityColor(msg.priority)" text-color="white">{{ msg.priority }}</q-chip>
              <q-chip dense outline color="blue">{{ msg.type }}</q-chip>
            </div>
            <p class="q-mt-xs text-grey-8">{{ msg.message }}</p>
            <div class="row items-center q-gutter-sm text-caption text-grey-7">
              <q-chip v-if="msg.daysBefore" dense icon="o_calendar_today">{{ msg.daysBefore }} días antes</q-chip>
              <q-chip v-if="msg.allowDismiss" dense icon="o_check">Descartable</q-chip>
              <q-chip v-if="msg.allowPostpone" dense icon="o_alarm">Posponible</q-chip>
              <span>Creado: {{ msg.createdAt }}</span>
            </div>
          </div>
          <q-btn-group flat>
            <q-btn flat dense icon="o_edit" @click="openEditDialog(msg)" />
            <q-btn flat dense icon="o_delete" @click="confirmDelete(msg.id)" />
          </q-btn-group>
        </q-card-section>
      </q-card>
    </div>

    <!-- Estado Vacío (si la lista está vacía) -->
    <q-card v-else flat bordered>
      <q-card-section class="text-center q-pa-xl">
        <q-avatar size="100px" font-size="60px" color="grey-3" text-color="grey-5" icon="o_notifications" />
        <div class="text-h6 text-grey-8 q-mt-md">No hay mensajes configurados</div>
        <p class="text-grey-7">Crea tu primer mensaje proactivo para los nuevos colaboradores</p>
        <q-btn unelevated color="dark" icon="add" label="Crear primer mensaje" no-caps class="q-mt-sm" @click="openCreateDialog" />
      </q-card-section>
    </q-card>

    <!-- Diálogo para Crear/Editar Mensaje -->
    <q-dialog v-model="showDialog">
      <q-card style="width: 600px; max-width: 90vw;">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">{{ editMode ? 'Editar mensaje' : 'Crear nuevo mensaje' }}</div>
          <q-space />
          <q-btn icon="o_close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <p class="text-grey-8">Configura mensajes que se mostrarán automáticamente a los nuevos colaboradores</p>
          <q-form class="q-gutter-y-md">
            <q-input v-model="activeMessage.title" label="Título *" placeholder="Ej: ¡Bienvenido a TCS!" outlined dense />
            <q-input v-model="activeMessage.message" label="Mensaje *" placeholder="Escribe el mensaje que verán los usuarios..." type="textarea" outlined dense />
            <div class="row q-col-gutter-x-md">
              <q-select v-model="activeMessage.type" :options="['Bienvenida', 'Recordatorio', 'Consejo']" label="Tipo de mensaje" outlined dense class="col" />
              <q-select v-model="activeMessage.priority" :options="['Alta', 'Media', 'Baja']" label="Prioridad" outlined dense class="col" />
            </div>
            <q-input v-model.number="activeMessage.daysBefore" label="Días antes de inicio (opcional)" placeholder="Ej: 10 (mostrar 10 días antes del inicio)" type="number" outlined dense hint="Si se especifica, el mensaje solo se mostrará cuando falten estos días o menos para el inicio" />
            <div>
              <q-checkbox v-model="activeMessage.allowDismiss" label="Permitir descartar mensaje" />
              <q-checkbox v-model="activeMessage.allowPostpone" label="Permitir posponer mensaje" />
            </div>
          </q-form>
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat label="Cancelar" color="primary" v-close-popup />
          <q-btn unelevated :label="editMode ? 'Actualizar mensaje' : 'Crear mensaje'" color="dark" @click="saveMessage" />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useQuasar } from 'quasar';

defineOptions({ name: 'AdminMessagesPage' });

const $q = useQuasar();
const messages = ref([]);
const editMode = ref(false);
const showDialog = ref(false);

const getNewMessageObject = () => ({
  id: null, title: '', message: '', type: 'Bienvenida', priority: 'Media', daysBefore: null, allowDismiss: true, allowPostpone: true, createdAt: null
});

const activeMessage = ref(getNewMessageObject());

const summaries = computed(() => ({
  total: { label: 'Total mensajes', value: messages.value.length, color: 'dark' },
  alta: { label: 'Alta prioridad', value: messages.value.filter(m => m.priority === 'Alta').length, color: 'red' },
  bienvenida: { label: 'Bienvenida', value: messages.value.filter(m => m.type === 'Bienvenida').length, color: 'blue' },
  recordatorios: { label: 'Recordatorios', value: messages.value.filter(m => m.type === 'Recordatorio').length, color: 'orange' },
}));

function openCreateDialog() {
  editMode.value = false;
  activeMessage.value = getNewMessageObject();
  showDialog.value = true;
}

function openEditDialog(msg) {
  editMode.value = true;
  activeMessage.value = JSON.parse(JSON.stringify(msg)); // Copia profunda para no mutar el original
  showDialog.value = true;
}

function saveMessage() {
  if (!activeMessage.value.title || !activeMessage.value.message) {
    $q.notify({ color: 'negative', message: 'El título y el mensaje son obligatorios.', icon: 'o_warning' });
    return;
  }

  if (editMode.value) {
    // Actualizar mensaje
    const index = messages.value.findIndex(m => m.id === activeMessage.value.id);
    if (index !== -1) {
      messages.value[index] = { ...activeMessage.value };
    }
    $q.notify({ message: '¡Mensaje actualizado correctamente!', icon: 'o_check', color: 'positive' });
  } else {
    // Crear mensaje
    activeMessage.value.id = Date.now();
    activeMessage.value.createdAt = new Date().toLocaleDateString('es-ES');
    messages.value.push({ ...activeMessage.value });
    $q.notify({ message: '¡Mensaje creado correctamente!', icon: 'task_alt', color: 'white', textColor: 'dark', position: 'bottom-right' });
  }

  showDialog.value = false;
}

function confirmDelete(messageId) {
  $q.dialog({
    title: 'Figma', // Título cambiado para coincidir con la imagen
    message: '¿Estás seguro de eliminar este mensaje?',
    persistent: true,
    ok: {
      label: 'Aceptar',
      color: 'primary',
      flat: true
    },
    cancel: {
      label: 'Cancelar',
      color: 'primary',
      flat: true
    }
  }).onOk(() => {
    const index = messages.value.findIndex(m => m.id === messageId);
    if (index !== -1) {
      messages.value.splice(index, 1);
      $q.notify({ message: 'Mensaje eliminado correctamente', color: 'positive', icon: 'o_check' });
    }
  });
}

const getPriorityColor = (priority) => {
  switch (priority) {
    case 'Alta': return 'red';
    case 'Media': return 'orange';
    case 'Baja': return 'green';
    default: return 'grey';
  }
};

</script>
