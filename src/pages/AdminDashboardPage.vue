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
          :options="['Todos los estados', 'Activo', 'En Riesgo', 'Completado']"
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
import { api } from 'src/boot/axios';

defineOptions({ name: 'AdminDashboardPage' });

const summaries = ref([
  { label: 'Total Nuevos', value: 5, icon: 'o_person_add', color: 'blue-5' },
  { label: 'Activos', value: 3, icon: 'o_trending_up', color: 'green-5' },
  { label: 'En Riesgo', value: 1, icon: 'o_warning', color: 'red-5' },
  { label: 'Completados', value: 1, icon: 'o_check_circle', color: 'purple-5' },
  { label: 'Progreso Prom.', value: '62%', icon: 'o_functions', color: 'deep-purple-5' },
]);

const searchQuery = ref('');
const statusFilter = ref('Todos los estados');

const users = ref([]);

onMounted(async () => {
  try {
    const resp = await api.get('/Usuario/panel');
    users.value = (resp.data || []).map(u => ({
      id: u.codigoEmpleado || u.correo,
      initials: u.nombre ? u.nombre.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2) : '',
      name: u.nombre,
      email: u.correo,
      status: u.estado,
      role: u.rol,
      office: u.oficina,
      department: u.departamento,
      position: u.cargo,
      startDate: u.fechaInicio ? new Date(u.fechaInicio).toLocaleDateString('es-PE') : '',
      progress: {
        total: (u.progresoTotal !== undefined) ? u.progresoTotal : 0,
        activities: {
          completed: (u.actividadesCompletadas !== undefined) ? u.actividadesCompletadas : 0,
          total: (u.actividadesTotales !== undefined) ? u.actividadesTotales : 0
        },
        documents: {
          completed: (u.documentosCompletados !== undefined) ? u.documentosCompletados : 0,
          total: (u.documentosTotales !== undefined) ? u.documentosTotales : 0
        }
      }
    }));
  } catch {
    users.value = [];
  }
});

const getStatusColor = (status) => {
  switch (status) {
    case 'Activo': return { chipBg: 'green-2', chipText: 'green-8' };
    case 'En Riesgo': return { chipBg: 'red-2', chipText: 'red-8' };
    case 'Completado': return { chipBg: 'grey-3', chipText: 'grey-8' };
    default: return { chipBg: 'grey-3', chipText: 'grey-8' };
  }
};

const filteredUsers = computed(() => {
  return users.value.filter(user => {
          const searchLower = searchQuery.value.toLowerCase();
          const matchesSearch = (user.name || '').toLowerCase().includes(searchLower) || (user.email || '').toLowerCase().includes(searchLower);
          // Si el filtro está vacío o es "Todos los estados", mostrar todos
          if (!statusFilter.value || statusFilter.value === 'Todos los estados') {
            return matchesSearch;
          }
          // Comparar estado ignorando mayúsculas/minúsculas
          return matchesSearch && ((user.status || '').toLowerCase() === statusFilter.value.toLowerCase());
        });
});

</script>
