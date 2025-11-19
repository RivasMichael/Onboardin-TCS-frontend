<template>
  <q-page class="q-pa-md bg-grey-1">

    <!-- Tarjetas de Resumen -->
    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12 col-md" v-for="summary in summaries" :key="summary.label">
        <q-card flat bordered>
          <q-card-section class="row justify-between items-center">
            <div>
              <div class="text-subtitle2 text-grey-7">{{ summary.label }}</div>
              <div class="text-h4 text-weight-bold">{{ summary.value }}</div>
            </div>
            <q-avatar :icon="summary.icon" :color="summary.color" text-color="white" size="lg" />
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Nuevos Ingresantes -->
    <q-card flat bordered>
      <q-card-section>
        <div class="text-h6 text-weight-bold">Nuevos Ingresantes</div>
        <div class="text-subtitle2 text-grey-8">Seguimiento del progreso de onboarding</div>
      </q-card-section>

      <q-card-section class="row q-gutter-md items-center">
        <q-input
          v-model="searchQuery"
          placeholder="Buscar por nombre o email..."
          outlined
          dense
          class="col"
        >
          <template v-slot:prepend>
            <q-icon name="o_search" />
          </template>
        </q-input>
        <q-select
          v-model="statusFilter"
          :options="['Todos los estados', 'Activo', 'En Riesgo', 'Completado', 'Pendiente']"
          outlined
          dense
          class="col-auto"
          style="min-width: 200px"
        />
      </q-card-section>

      <q-list separator>
        <q-item v-for="user in filteredUsers" :key="user.id" class="q-py-md">
          <q-item-section avatar top>
            <q-avatar color="primary" text-color="white">{{ user.initials }}</q-avatar>
          </q-item-section>

          <q-item-section top>
            <q-item-label class="text-weight-bold row items-center">
              {{ user.name }}
              <q-chip
                dense
                :color="getStatusColor(user.status).chipBg"
                :text-color="getStatusColor(user.status).chipText"
                class="q-ml-sm text-weight-medium"
              >{{ user.status }}</q-chip>
            </q-item-label>
            <q-item-label caption>{{ user.email }}</q-item-label>
            <q-item-label caption class="row items-center q-mt-xs text-grey-7">
              <q-icon name="o_person_outline" class="q-mr-xs" /> {{ user.supervisor }}
              <q-icon name="o_event" class="q-ml-md q-mr-xs" /> Inicio: {{ user.startDate }}
              <q-icon name="o_schedule" class="q-ml-md q-mr-xs" /> Hace {{ user.timeSinceStart }}
            </q-item-label>
          </q-item-section>

          <q-item-section top side style="min-width: 350px;">
            <div class="row items-center justify-between">
              <q-item-label caption>Progreso General</q-item-label>
              <q-item-label class="text-weight-bold">{{ user.progress.total }}%</q-item-label>
            </div>
            <q-linear-progress :value="user.progress.total / 100" rounded size="10px" color="dark" class="q-my-xs" />

            <div class="row q-mt-sm q-gutter-x-sm justify-between">
              <div class="col">
                <q-item-label caption>Actividades</q-item-label>
                <q-linear-progress :value="user.progress.activities.completed / user.progress.activities.total" size="6px" rounded />
                <q-item-label caption class="text-right">{{ user.progress.activities.completed }}/{{ user.progress.activities.total }}</q-item-label>
              </div>
              <div class="col">
                <q-item-label caption>Documentos</q-item-label>
                <q-linear-progress :value="user.progress.documents.completed / user.progress.documents.total" size="6px" rounded />
                <q-item-label caption class="text-right">{{ user.progress.documents.completed }}/{{ user.progress.documents.total }}</q-item-label>
              </div>
            </div>
          </q-item-section>
        </q-item>
      </q-list>
       <!-- Mensaje de "No hay resultados" -->
      <div v-if="filteredUsers.length === 0" class="text-center q-pa-xl">
        <q-icon name="o_search_off" size="xl" color="grey-5" />
        <div class="text-h6 text-grey-7 q-mt-md">No se encontraron ingresantes</div>
      </div>
    </q-card>

  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { api } from 'boot/axios';
import { useQuasar } from 'quasar';

defineOptions({ name: 'AdminDashboardPage' });

const $q = useQuasar();

const summaries = ref([
  { label: 'Total Nuevos', value: 0, icon: 'o_person_add', color: 'blue-5' },
  { label: 'Activos', value: 0, icon: 'o_trending_up', color: 'green-5' },
  { label: 'En Riesgo', value: 0, icon: 'o_warning', color: 'red-5' },
  { label: 'Completados', value: 0, icon: 'o_check_circle', color: 'purple-5' },
  { label: 'Progreso Prom.', value: '0%', icon: 'o_functions', color: 'deep-purple-5' },
]);

const searchQuery = ref('');
const statusFilter = ref('Todos los estados');
const users = ref([]);

const getInitials = (name) => {
  if (!name) return '';
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
};

const capitalize = (s) => {
  if (typeof s !== 'string' || s.length === 0) return '';
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
};

onMounted(async () => {
  try {
    const response = await api.get('/Usuario/panel');

    users.value = response.data.map(user => ({
      id: user.correo, // Usamos correo como ID temporal
      initials: getInitials(user.nombre),
      name: user.nombre,
      email: user.correo,
      status: capitalize(user.estado),
      supervisor: 'N/A', // Este dato no viene del endpoint /panel
      startDate: new Date(user.fechaInicio).toLocaleDateString(),
      timeSinceStart: 'N/A', // Placeholder
      progress: {
        total: Math.floor(Math.random() * 100),
        activities: { completed: Math.floor(Math.random() * 7) + 1, total: 7 },
        documents: { completed: Math.floor(Math.random() * 6) + 1, total: 6 }
      }
    }));

    updateSummaries();

  } catch (error) {
    console.error('Error fetching users:', error);
    $q.notify({
      color: 'negative',
      position: 'top',
      message: 'Error al cargar los usuarios. Revisa la consola del navegador.',
      icon: 'o_report_problem'
    });
  }
});

const updateSummaries = () => {
  if (!users.value) return;
  const totalNuevos = users.value.length;
  const activos = users.value.filter(u => u.status === 'Activo').length;
  const enRiesgo = users.value.filter(u => u.status === 'En Riesgo').length;
  const completados = users.value.filter(u => u.status === 'Completado').length;
  const totalProgress = users.value.reduce((acc, u) => acc + u.progress.total, 0);
  const progresoProm = totalNuevos > 0 ? Math.round(totalProgress / totalNuevos) : 0;

  summaries.value = [
    { label: 'Total Nuevos', value: totalNuevos, icon: 'o_person_add', color: 'blue-5' },
    { label: 'Activos', value: activos, icon: 'o_trending_up', color: 'green-5' },
    { label: 'En Riesgo', value: enRiesgo, icon: 'o_warning', color: 'red-5' },
    { label: 'Completados', value: completados, icon: 'o_check_circle', color: 'purple-5' },
    { label: 'Progreso Prom.', value: `${progresoProm}%`, icon: 'o_functions', color: 'deep-purple-5' },
  ];
};

const getStatusColor = (status) => {
  switch (status) {
    case 'Activo': return { chipBg: 'green-2', chipText: 'green-8' };
    case 'En Riesgo': return { chipBg: 'red-2', chipText: 'red-8' };
    case 'Completado': return { chipBg: 'grey-3', chipText: 'grey-8' };
    case 'Pendiente': return { chipBg: 'orange-2', chipText: 'orange-8' };
    default: return { chipBg: 'grey-3', chipText: 'grey-8' };
  }
};

const filteredUsers = computed(() => {
  if (!users.value) return [];
  return users.value.filter(user => {
    if (!user.name || !user.email) return false;
    const searchLower = searchQuery.value.toLowerCase();
    const matchesSearch = user.name.toLowerCase().includes(searchLower) || user.email.toLowerCase().includes(searchLower);
    const matchesStatus = statusFilter.value === 'Todos los estados' || user.status === statusFilter.value;
    return matchesSearch && matchesStatus;
  });
});

</script>
