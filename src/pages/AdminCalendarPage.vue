<template>
  <q-page class="q-pa-md bg-grey-1">

    <!-- Encabezado y Botón de Acción -->
    <div class="row justify-between items-center q-mb-md">
      <div>
        <div class="text-h6 text-weight-bold">Gestión de Calendario</div>
        <div class="text-subtitle2 text-grey-8">Administra las actividades del proceso de onboarding</div>
      </div>
      <q-btn unelevated color="dark" icon="add" label="Nueva Actividad" no-caps @click="openCreateDialog" />
    </div>

    <!-- Filtros -->
    <q-card flat bordered class="q-pa-sm q-mb-lg">
      <div class="row q-gutter-md items-center">
        <q-input v-model="searchQuery" placeholder="Buscar actividades..." borderless dense class="col">
          <template v-slot:prepend><q-icon name="o_search" /></template>
        </q-input>
        <q-select v-model="statusFilter" :options="statusOptions" label="Todos los estados" borderless dense emit-value map-options class="col-auto" style="min-width: 200px" />
      </div>
    </q-card>

    <!-- Lista de Actividades -->
    <div class="q-gutter-y-md">
      <q-card v-for="activity in filteredActivities" :key="activity.id" flat bordered>
        <q-card-section class="row items-center q-gutter-x-lg">
          <div class="text-center">
            <div class="text-overline text-primary">{{ activity.date.month }}</div>
            <div class="text-h4 text-weight-bold text-primary">{{ activity.date.day }}</div>
          </div>

          <div class="col">
            <div class="row items-center q-gutter-x-sm">
              <span class="text-weight-bold">{{ activity.title }}</span>
              <q-chip dense :color="activity.status === 'Completado' ? 'green-2' : 'orange-2'" :text-color="activity.status === 'Completado' ? 'green-8' : 'orange-8'">{{ activity.status }}</q-chip>
            </div>
            <p class="text-grey-8 q-mt-xs">{{ activity.description }}</p>
            <div class="row items-center q-gutter-x-md text-caption text-grey-7 q-mt-sm">
              <span><q-icon name="o_schedule" class="q-mr-xs" />{{ activity.dateTime }}</span>
              <span><q-icon name="o_person_outline" class="q-mr-xs" />{{ activity.owner }}</span>
              <span v-if="activity.location"><q-icon name="o_place" class="q-mr-xs" />{{ activity.location }}</span>
              <a v-if="activity.link" :href="activity.link" target="_blank" class="text-primary"><q-icon name="o_link" class="q-mr-xs" />Ver enlace</a>
            </div>
          </div>

          <q-btn-group flat>
            <q-btn flat dense icon="o_edit" @click="openEditDialog(activity)" />
            <q-btn flat dense icon="o_delete" @click="confirmDelete(activity)" />
          </q-btn-group>
        </q-card-section>
      </q-card>
    </div>

    <!-- Diálogo para Crear/Editar Actividad -->
    <q-dialog v-model="showDialog">
      <q-card style="width: 600px; max-width: 90vw;">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">{{ editMode ? 'Editar Actividad' : 'Nueva Actividad' }}</div>
          <q-space />
          <q-btn icon="o_close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <p class="text-grey-8">Modifica la información de la actividad</p>
          <q-form class="q-gutter-y-md">
            <q-input v-model="activeActivity.title" label="Título *" outlined dense />
            <q-input v-model="activeActivity.description" label="Descripción" type="textarea" outlined dense />
            <div class="row q-col-gutter-x-md">
              <q-input v-model="activeActivity.startDate" label="Fecha y Hora Inicio *" outlined dense class="col">
                <template v-slot:append>
                  <q-icon name="o_event" class="cursor-pointer"><q-popup-proxy cover transition-show="scale" transition-hide="scale"><q-date v-model="activeActivity.startDate" mask="DD/MM/YYYY HH:mm"><div class="row items-center justify-end"><q-btn v-close-popup label="Close" color="primary" flat /></div></q-date></q-popup-proxy></q-icon>
                  <q-icon name="o_schedule" class="cursor-pointer"><q-popup-proxy cover transition-show="scale" transition-hide="scale"><q-time v-model="activeActivity.startDate" mask="DD/MM/YYYY HH:mm" format24h><div class="row items-center justify-end"><q-btn v-close-popup label="Close" color="primary" flat /></div></q-time></q-popup-proxy></q-icon>
                </template>
              </q-input>
              <q-input v-model="activeActivity.endDate" label="Fecha y Hora Fin *" outlined dense class="col">
                 <template v-slot:append>
                  <q-icon name="o_event" class="cursor-pointer"><q-popup-proxy cover transition-show="scale" transition-hide="scale"><q-date v-model="activeActivity.endDate" mask="DD/MM/YYYY HH:mm"><div class="row items-center justify-end"><q-btn v-close-popup label="Close" color="primary" flat /></div></q-date></q-popup-proxy></q-icon>
                  <q-icon name="o_schedule" class="cursor-pointer"><q-popup-proxy cover transition-show="scale" transition-hide="scale"><q-time v-model="activeActivity.endDate" mask="DD/MM/YYYY HH:mm" format24h><div class="row items-center justify-end"><q-btn v-close-popup label="Close" color="primary" flat /></div></q-time></q-popup-proxy></q-icon>
                </template>
              </q-input>
            </div>
            <q-input v-model="activeActivity.owner" label="Responsable *" outlined dense />
            <q-input v-model="activeActivity.location" label="Ubicación" outlined dense />
            <q-input v-model="activeActivity.link" label="Enlace (Videollamada, etc.)" outlined dense />
            <q-select v-model="activeActivity.status" :options="['Pendiente', 'Completado']" label="Estado" outlined dense />
          </q-form>
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat label="Cancelar" v-close-popup />
          <q-btn unelevated :label="editMode ? 'Actualizar' : 'Crear'" color="dark" @click="saveActivity" />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useQuasar } from 'quasar';

defineOptions({ name: 'AdminCalendarPage' });

const $q = useQuasar();

// --- Datos de ejemplo ---
const activities = ref([
  { id: 1, date: { month: 'NOV', day: 8 }, title: 'Sesión de Bienvenida', status: 'Completado', description: 'Reunión de bienvenida con el equipo de RRHH y tu supervisor.', dateTime: '08 nov 2025, 10:00', startDate: '08/11/2025 10:00', endDate: '08/11/2025 10:00', owner: 'Recursos Humanos', location: 'Sala de Conferencias A', link: null },
  { id: 2, date: { month: 'NOV', day: 8 }, title: 'Configuración de Herramientas', status: 'Completado', description: 'Configuración de correo, VPN y accesos a sistemas.', dateTime: '08 nov 2025, 14:00', startDate: '08/11/2025 14:00', endDate: '08/11/2025 14:00', owner: 'IT Support', location: null, link: 'https://it-support.example.com' },
  { id: 3, date: { month: 'NOV', day: 9 }, title: 'Capacitación en Seguridad', status: 'Pendiente', description: 'Curso obligatorio sobre seguridad de la información y protección de datos.', dateTime: '09 nov 2025, 11:00', startDate: '09/11/2025 11:00', endDate: '09/11/2025 11:00', owner: 'Seguridad IT', location: null, link: 'https://security-training.example.com' },
  { id: 4, date: { month: 'NOV', day: 9 }, title: 'Reunión 1:1 con Supervisor', status: 'Pendiente', description: 'Primera reunión individual con tu supervisor para establecer objetivos.', dateTime: '09 nov 2025, 15:00', startDate: '09/11/2025 15:00', endDate: '09/11/2025 15:00', owner: 'Juan Pérez', location: 'Oficina del Supervisor', link: null },
  { id: 5, date: { month: 'NOV', day: 11 }, title: 'Introducción al Producto', status: 'Pendiente', description: 'Sesión de introducción a los productos y servicios de la empresa.', dateTime: '11 nov 2025, 10:00', startDate: '11/11/2025 10:00', endDate: '11/11/2025 10:00', owner: 'Product Team', location: null, link: 'https://product-intro.example.com' },
  { id: 6, date: { month: 'NOV', day: 12 }, title: 'Tour de Oficinas', status: 'Pendiente', description: 'Recorrido por las instalaciones y presentación con diferentes equipos.', dateTime: '12 nov 2025, 09:00', startDate: '12/11/2025 09:00', endDate: '12/11/2025 09:00', owner: 'Recursos Humanos', location: 'Recepción Principal', link: null },
  { id: 7, date: { month: 'NOV', day: 14 }, title: 'Evaluación de Primera Semana', status: 'Pendiente', description: 'Reunión de seguimiento para revisar tu experiencia en la primera semana.', dateTime: '14 nov 2025, 16:00', startDate: '14/11/2025 16:00', endDate: '14/11/2025 16:00', owner: 'Juan Pérez', location: 'Sala de Reuniones B', link: null },
]);

// --- Filtros ---
const searchQuery = ref('');
const statusFilter = ref('all');
const statusOptions = [
  { label: 'Todos los estados', value: 'all' },
  { label: 'Pendiente', value: 'Pendiente' },
  { label: 'Completado', value: 'Completado' },
];

const filteredActivities = computed(() => {
  return activities.value.filter(act => {
    const searchMatch = act.title.toLowerCase().includes(searchQuery.value.toLowerCase());
    const statusMatch = statusFilter.value === 'all' || act.status === statusFilter.value;
    return searchMatch && statusMatch;
  });
});

// --- Lógica de Creación/Edición ---
const showDialog = ref(false);
const editMode = ref(false);
const getNewActivityObject = () => ({ id: null, date: {}, title: '', status: 'Pendiente', description: '', dateTime: '', startDate: '', endDate: '', owner: '', location: '', link: '' });
const activeActivity = ref(getNewActivityObject());

function openCreateDialog() {
  editMode.value = false;
  activeActivity.value = getNewActivityObject();
  showDialog.value = true;
}

function openEditDialog(activity) {
  editMode.value = true;
  activeActivity.value = JSON.parse(JSON.stringify(activity));
  showDialog.value = true;
}

function saveActivity() {
  if (!activeActivity.value.title || !activeActivity.value.startDate || !activeActivity.value.endDate || !activeActivity.value.owner) {
    $q.notify({ color: 'negative', message: 'Por favor, completa los campos obligatorios (*)' });
    return;
  }

  if (editMode.value) {
    const index = activities.value.findIndex(a => a.id === activeActivity.value.id);
    if (index !== -1) activities.value[index] = { ...activeActivity.value };
    $q.notify({ color: 'positive', message: 'Actividad actualizada' });
  } else {
    activeActivity.value.id = Date.now();
    activities.value.unshift({ ...activeActivity.value });
    $q.notify({ color: 'positive', message: 'Actividad creada' });
  }
  showDialog.value = false;
}

// --- Lógica de Eliminación ---
function confirmDelete(activity) {
  $q.dialog({
    title: 'Confirmar eliminación',
    message: `¿Estás seguro de eliminar la actividad "${activity.title}"?`,
    cancel: true,
    persistent: true
  }).onOk(() => {
    const index = activities.value.findIndex(a => a.id === activity.id);
    if (index !== -1) {
      activities.value.splice(index, 1);
      $q.notify({ color: 'positive', message: 'Actividad eliminada' });
    }
  });
}

</script>
