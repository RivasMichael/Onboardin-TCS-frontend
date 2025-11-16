<template>
  <q-page class="q-pa-md">

    <!-- Encabezado -->
    <div class="row items-center q-mb-md">
      <q-avatar color="primary" text-color="white" icon="o_event" class="q-mr-md" />
      <div>
        <div class="text-h6 text-weight-bold">Calendario de Actividades</div>
        <div class="text-subtitle1 text-grey-8">Tu agenda de onboarding personalizada</div>
      </div>
    </div>

    <!-- Tarjetas de Resumen -->
    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12 col-md-3" v-for="summary in summaries" :key="summary.label">
        <q-card flat bordered :class="`bg-${summary.color}-1`">
          <q-card-section>
            <div class="text-h4 text-weight-bold">{{ summary.value }}</div>
            <div class="text-subtitle2">{{ summary.label }}</div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Filtros -->
    <div class="row items-center q-mb-md">
      <q-icon name="o_filter_alt" class="q-mr-sm" />
      <div class="text-weight-medium">Filtros:</div>
      <q-btn-toggle
        v-model="filter"
        class="q-ml-md"
        no-caps
        rounded
        unelevated
        toggle-color="dark"
        color="white"
        text-color="dark"
        :options="filterOptions"
      />
    </div>

    <!-- Lista de Actividades -->
    <div class="q-gutter-y-md">
      <q-card
        v-for="activity in filteredActivities"
        :key="activity.id"
        flat
        bordered
        :style="`border-left: 5px solid ${activity.completed ? '#4caf50' : '#fbc02d'}`"
      >
        <q-card-section class="row items-start">
          <q-avatar :color="activity.completed ? 'green-2' : 'yellow-2'" :text-color="activity.completed ? 'green-7' : 'yellow-8'" :icon="activity.completed ? 'o_check_circle' : 'o_schedule'" class="q-mr-md" />

          <div class="col">
            <div class="text-weight-bold">{{ activity.title }}</div>
            <div class="text-grey-8">{{ activity.description }}</div>

            <div class="row q-mt-sm q-col-gutter-x-lg text-grey-7">
              <div class="col-auto row items-center"><q-icon name="o_today" class="q-mr-xs" /> {{ activity.date }}</div>
              <div class="col-auto row items-center"><q-icon name="o_schedule" class="q-mr-xs" /> {{ activity.time }}</div>
              <div class="col-auto row items-center"><q-icon name="o_location_on" class="q-mr-xs" /> {{ activity.location }}</div>
              <div class="col-auto row items-center"><q-icon name="o_person" class="q-mr-xs" /> {{ activity.organizer }}</div>
            </div>

             <q-chip dense :color="activity.completed ? 'green-2' : 'yellow-2'" :text-color="activity.completed ? 'green-7' : 'yellow-8'" class="q-mt-sm text-weight-bold">
                {{ activity.completed ? 'Completada' : 'Pendiente' }}
              </q-chip>
          </div>

          <q-space />

          <q-btn
            v-if="activity.completed"
            outline
            no-caps
            color="green"
            @click="toggleActivityStatus(activity.id)"
            label="Completado"
            icon="o_check"
          />
          <q-btn
            v-else
            unelevated
            no-caps
            color="dark"
            @click="toggleActivityStatus(activity.id)"
            label="Marcar como completado"
          />

        </q-card-section>
      </q-card>

      <!-- Mensaje de "No hay actividades" -->
      <div v-if="filteredActivities.length === 0" class="text-center q-pa-xl">
        <q-icon name="o_event_busy" size="xl" color="grey-5" />
        <div class="text-h6 text-grey-7 q-mt-md">No hay actividades</div>
        <div class="text-subtitle1 text-grey-6">No se encontraron actividades con el filtro seleccionado</div>
      </div>

    </div>

  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue';

defineOptions({ name: 'ActividadesPage' });

const filter = ref('Todos');

const activities = ref([
  { id: 1, title: 'Sesión de Bienvenida', description: 'Reunión de bienvenida con el equipo de RRHH y tu supervisor.', date: 'Sábado, 8 de Noviembre de 2025', time: '10:00', location: 'Sala de Conferencias A', organizer: 'Recursos Humanos', completed: true },
  { id: 2, title: 'Configuración de Herramientas', description: 'Configuración de correo, VPN y accesos a sistemas.', date: 'Sábado, 8 de Noviembre de 2025', time: '14:00', location: 'Oficina', organizer: 'IT Support', completed: true },
  { id: 3, title: 'Curso de Seguridad', description: 'Curso online obligatorio sobre políticas de seguridad.', date: 'Lunes, 10 de Noviembre de 2025', time: 'Todo el día', location: 'Online', organizer: 'Seguridad Corp.', completed: false },
  { id: 4, title: 'Firma de Contrato', description: 'Revisión y firma de documentos contractuales.', date: 'Martes, 11 de Noviembre de 2025', time: '09:00', location: 'Oficina RRHH', organizer: 'Recursos Humanos', completed: false },
  { id: 5, title: 'Reunión 1:1 con Manager', description: 'Primera reunión con tu manager para definir objetivos.', date: 'Martes, 11 de Noviembre de 2025', time: '11:30', location: 'Sala de reuniones B', organizer: 'Tu Manager', completed: false },
  { id: 6, title: 'Almuerzo de Equipo', description: 'Almuerzo de bienvenida para conocer a tus compañeros.', date: 'Miércoles, 12 de Noviembre de 2025', time: '13:00', location: 'Cafetería', organizer: 'Equipo', completed: false },
  { id: 7, title: 'Completar Perfil Interno', description: 'Añade tu foto y descripción en el portal del empleado.', date: 'Viernes, 14 de Noviembre de 2025', time: 'Todo el día', location: 'Portal del Empleado', organizer: 'Tú', completed: false }
]);

const completedCount = computed(() => activities.value.filter(a => a.completed).length);
const pendingCount = computed(() => activities.value.filter(a => !a.completed).length);
const upcomingCount = ref(0); // Simulado

const summaries = computed(() => [
  { label: 'Total', value: activities.value.length, color: 'blue' },
  { label: 'Pendientes', value: pendingCount.value, color: 'yellow' },
  { label: 'Próximas', value: upcomingCount.value, color: 'orange' },
  { label: 'Completadas', value: completedCount.value, color: 'green' },
]);

const filterOptions = computed(() => [
  { label: 'Todos', value: 'Todos' },
  { label: `Pendientes`, value: 'Pendientes', sublabel: pendingCount.value },
  { label: 'Próximas', value: 'Próximas', sublabel: 0 },
  { label: `Completadas`, value: 'Completadas', sublabel: completedCount.value },
]);

const filteredActivities = computed(() => {
  switch (filter.value) {
    case 'Pendientes':
      return activities.value.filter(a => !a.completed);
    case 'Completadas':
      return activities.value.filter(a => a.completed);
    case 'Próximas':
      return []; // Siempre vacío por ahora
    default:
      return activities.value;
  }
});

function toggleActivityStatus(activityId) {
  const activity = activities.value.find(a => a.id === activityId);
  if (activity) {
    activity.completed = !activity.completed;
  }
}

</script>
