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
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { api } from 'src/boot/axios'

defineOptions({ name: 'ActividadesPage' })

const $q = useQuasar()
const filter = ref('Todos')
const activities = ref([])
const loading = ref(false)

// Cargar actividades del usuario desde la API
const loadActivities = async () => {
  loading.value = true
  try {
    const response = await api.get('/actividades/mis-actividades')
    
    // La API devuelve {actividades: [], resumen: {}, usuario: ""}
    const actividadesData = response.data.actividades || []
    
    // Mapear los datos de la API al formato esperado por el componente
    activities.value = actividadesData.map(act => ({
      id: act.id,
      title: act.titulo,
      description: act.descripcion,
      date: formatDate(act.fecha),
      time: act.hora || 'Sin hora definida',
      location: act.lugar || 'Sin ubicación',
      organizer: act.creado_por || 'Sin organizador',
      completed: act.estado === 'completada',
      esUrgente: act.es_urgente || false
    }))
  } catch (err) {
    console.error('Error al cargar actividades:', err)
    $q.notify({
      type: 'negative',
      message: 'Error al cargar las actividades'
    })
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadActivities()
})

const completedCount = computed(() => activities.value.filter(a => a.completed).length)
const pendingCount = computed(() => activities.value.filter(a => !a.completed).length)
const upcomingCount = ref(0)

const summaries = computed(() => [
  { label: 'Total', value: activities.value.length, color: 'blue' },
  { label: 'Pendientes', value: pendingCount.value, color: 'yellow' },
  { label: 'Próximas', value: upcomingCount.value, color: 'orange' },
  { label: 'Completadas', value: completedCount.value, color: 'green' },
])

const filterOptions = computed(() => [
  { label: 'Todos', value: 'Todos' },
  { label: `Pendientes`, value: 'Pendientes', sublabel: pendingCount.value },
  { label: 'Próximas', value: 'Próximas', sublabel: 0 },
  { label: `Completadas`, value: 'Completadas', sublabel: completedCount.value },
])

const filteredActivities = computed(() => {
  switch (filter.value) {
    case 'Pendientes':
      return activities.value.filter(a => !a.completed)
    case 'Completadas':
      return activities.value.filter(a => a.completed)
    case 'Próximas':
      return []
    default:
      return activities.value
  }
})

function formatDate(dateString) {
  if (!dateString) return 'Sin fecha'
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
}

async function toggleActivityStatus(activityId) {
  const activity = activities.value.find(a => a.id === activityId)
  if (!activity) return

  loading.value = true
  try {
    if (!activity.completed) {
      // Marcar como completada
      await api.patch(`/actividades/${activityId}/completar`)
      activity.completed = true
      $q.notify({
        message: 'Actividad marcada como completada',
        color: 'positive',
        icon: 'o_check'
      })
    } else {
      // Marcar como pendiente (puedes ajustar el endpoint si tu backend lo soporta)
      await api.put(`/actividades/${activityId}`, { estado: 'pendiente' })
      activity.completed = false
      $q.notify({
        message: 'Actividad marcada como pendiente',
        color: 'positive',
        icon: 'o_check'
      })
    }
  } catch (err) {
    console.error('Error al actualizar estado:', err)
    $q.notify({
      type: 'negative',
      message: 'Error al actualizar la actividad'
    })
  } finally {
    loading.value = false
  }
}

</script>
