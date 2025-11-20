<template>
  <q-page class="q-pa-md bg-grey-1">

    <!-- Encabezado y Botón de Acción -->
    <div class="row justify-between items-center q-mb-md">
      <div>
        <div class="text-h6 text-weight-bold">Gestión de Actividades</div>
        <div class="text-subtitle2 text-grey-8">Asigna y gestiona actividades de onboarding para los nuevos colaboradores</div>
      </div>
      <q-btn unelevated color="dark" icon="add" label="Nueva actividad" no-caps @click="openCreateDialog" />
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

    <!-- Lista de Actividades (si no está vacía) -->
    <div v-if="activities.length > 0" class="q-gutter-y-md">
      <q-card v-for="activity in activities" :key="activity.id" flat bordered>
        <q-card-section class="row q-gutter-md">
          <q-avatar icon="o_event" color="blue-1" text-color="blue-7" />
          <div class="col">
            <div class="row items-center q-gutter-x-sm">
              <span class="text-weight-bold">{{ activity.titulo }}</span>
              <q-chip dense :color="getStatusColor(activity.estado)" text-color="white">{{ activity.estado }}</q-chip>
              <q-chip dense outline color="blue">{{ activity.tipo }}</q-chip>
            </div>
            <p class="q-mt-xs text-grey-8">{{ activity.descripcion }}</p>
            <div class="row items-center q-gutter-sm text-caption text-grey-7">
              <q-chip dense icon="o_calendar_today">{{ formatDate(activity.fecha) }} - {{ activity.hora }}</q-chip>
              <q-chip dense icon="o_location_on">{{ activity.lugar }}</q-chip>
              <q-chip dense icon="o_schedule">{{ activity.duracion }}</q-chip>
              <span>Asignados: {{ activity.asignados.length }}</span>
            </div>
          </div>
          <q-btn-group flat>
            <q-btn flat dense icon="o_edit" @click="openEditDialog(activity)" />
            <q-btn flat dense icon="o_delete" @click="confirmDelete(activity.id)" />
          </q-btn-group>
        </q-card-section>
      </q-card>
    </div>

    <!-- Estado Vacío (si la lista está vacía) -->
    <q-card v-else flat bordered>
      <q-card-section class="text-center q-pa-xl">
        <q-avatar size="100px" font-size="60px" color="grey-3" text-color="grey-5" icon="o_event" />
        <div class="text-h6 text-grey-8 q-mt-md">No hay actividades creadas</div>
        <p class="text-grey-7">Crea tu primera actividad para los nuevos colaboradores</p>
        <q-btn unelevated color="dark" icon="add" label="Crear primera actividad" no-caps class="q-mt-sm" @click="openCreateDialog" />
      </q-card-section>
    </q-card>

    <!-- Diálogo para Crear/Editar Actividad -->
    <q-dialog v-model="showDialog" persistent>
      <q-card style="width: 700px; max-width: 90vw;">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">{{ editMode ? 'Editar actividad' : 'Crear nueva actividad' }}</div>
          <q-space />
          <q-btn icon="o_close" flat round dense @click="closeNow" />
        </q-card-section>

        <q-card-section>
          <q-form class="q-gutter-y-md">
            <!-- Título y Descripción -->
            <q-input v-model="activeActivity.titulo" label="Título *" placeholder="Ej: Revisión de documentos" outlined dense />
            <q-input v-model="activeActivity.descripcion" label="Descripción *" placeholder="Describe la actividad..." type="textarea" outlined dense rows="3" />

            <!-- Fecha, Hora, Duración -->
            <div class="row q-col-gutter-x-md">
              <q-input v-model="activeActivity.fecha" label="Fecha *" type="date" outlined dense class="col" />
              <q-input v-model="activeActivity.hora" label="Hora *" type="time" outlined dense class="col" />
              <q-input v-model="activeActivity.duracion" label="Duración *" placeholder="Ej: 1 hora" outlined dense class="col" />
            </div>

            <!-- Tipo y Modalidad -->
            <div class="row q-col-gutter-x-md">
              <q-select v-model="activeActivity.tipo" :options="['legal', 'capacitacion', 'reunion', 'documentacion', 'otro']" label="Tipo *" outlined dense class="col" />
              <q-select v-model="activeActivity.modalidad" :options="['presencial', 'virtual', 'hibrida']" label="Modalidad *" outlined dense class="col" />
            </div>

            <!-- Lugar y Estado -->
            <div class="row q-col-gutter-x-md">
              <q-input v-model="activeActivity.lugar" label="Lugar *" placeholder="Ej: Oficina de RRHH" outlined dense class="col" />
              <q-select v-model="activeActivity.estado" :options="['pendiente', 'en-progreso', 'completada', 'cancelada']" label="Estado" outlined dense class="col" />
            </div>

            <!-- Correos de asignados -->
            <div>
              <label class="text-weight-bold">Asignar a (correos separados por coma)</label>
              <q-input 
                v-model="assignedInput" 
                label="Correos" 
                placeholder="Ej: juan@tcs.com, maria@tcs.com" 
                outlined 
                dense
                @change="parseAssignedEmails"
              />
              <div v-if="activeActivity.asignados.length > 0" class="q-mt-sm q-gutter-x-sm">
                <q-chip
                  v-for="email in activeActivity.asignados"
                  :key="email"
                  removable
                  color="primary"
                  text-color="white"
                  :label="email"
                  @remove="removeAssigned(email)"
                />
              </div>
            </div>
          </q-form>
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat label="Cancelar" color="primary" @click="closeNow" />
          <q-btn unelevated :label="editMode ? 'Actualizar actividad' : 'Crear actividad'" color="dark" @click="saveActivity" />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useAuthStore } from 'src/stores/auth'
import { api } from 'src/boot/axios'

defineOptions({ name: 'AdminActivitiesPage' })

const $q = useQuasar()
const auth = useAuthStore()
const activities = ref([])
const editMode = ref(false)
const showDialog = ref(false)
const assignedInput = ref('')
const loading = ref(false)

const getNewActivityObject = () => ({
  id: null,
  titulo: '',
  descripcion: '',
  fecha: '',
  hora: '',
  duracion: '',
  tipo: 'capacitacion',
  modalidad: 'presencial',
  lugar: '',
  asignados: [],
  estado: 'pendiente',
  creadoPor: null
})

const activeActivity = ref(getNewActivityObject())

const summaries = computed(() => ({
  total: { label: 'Total actividades', value: activities.value.length, color: 'dark' },
  pendiente: { label: 'Pendiente', value: activities.value.filter(a => a.estado === 'pendiente').length, color: 'orange' },
  progreso: { label: 'En progreso', value: activities.value.filter(a => a.estado === 'en-progreso').length, color: 'blue' },
  completada: { label: 'Completada', value: activities.value.filter(a => a.estado === 'completada').length, color: 'green' }
}))

// Cargar actividades del backend
const loadActivities = async () => {
  loading.value = true
  try {
    const response = await api.get('/actividades')
    activities.value = response.data || []
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

function openCreateDialog() {
  editMode.value = false
  activeActivity.value = getNewActivityObject()
  assignedInput.value = ''
  showDialog.value = true
}

function closeNow() {
  showDialog.value = false
  activeActivity.value = getNewActivityObject()
  assignedInput.value = ''
  editMode.value = false
}

function openEditDialog(activity) {
  editMode.value = true
  activeActivity.value = JSON.parse(JSON.stringify(activity))
  assignedInput.value = activity.asignados.join(', ')
  showDialog.value = true
}

function parseAssignedEmails() {
  if (assignedInput.value.trim()) {
    activeActivity.value.asignados = assignedInput.value
      .split(',')
      .map(email => email.trim())
      .filter(email => email.length > 0)
  } else {
    activeActivity.value.asignados = []
  }
}

function removeAssigned(email) {
  const index = activeActivity.value.asignados.indexOf(email)
  if (index > -1) {
    activeActivity.value.asignados.splice(index, 1)
    assignedInput.value = activeActivity.value.asignados.join(', ')
  }
}

function formatDate(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' })
}

async function saveActivity() {
  if (!activeActivity.value.titulo || !activeActivity.value.descripcion || !activeActivity.value.fecha || !activeActivity.value.hora) {
    $q.notify({
      color: 'negative',
      message: 'Los campos titulo, descripción, fecha y hora son obligatorios.',
      icon: 'o_warning'
    })
    return
  }

  if (activeActivity.value.asignados.length === 0) {
    $q.notify({
      color: 'negative',
      message: 'Debes asignar al menos un correo.',
      icon: 'o_warning'
    })
    return
  }

  loading.value = true
  try {
    // El creadoPor se establece automáticamente al email del usuario logueado
    const activityData = {
      ...activeActivity.value,
      creadoPor: auth.usuario?.correo || auth.usuario?.email
    }

    if (editMode.value) {
      // Actualizar actividad (PUT)
      await api.put(`/actividades/${activeActivity.value.id}`, activityData)
      const index = activities.value.findIndex(a => a.id === activeActivity.value.id)
      if (index !== -1) {
        activities.value[index] = { ...activityData }
      }
      $q.notify({
        message: '¡Actividad actualizada correctamente!',
        icon: 'o_check',
        color: 'positive'
      })
    } else {
      // Crear actividad (POST)
      const response = await api.post('/actividades', activityData)
      activities.value.push(response.data)
      $q.notify({
        message: '¡Actividad creada correctamente!',
        icon: 'o_check',
        color: 'positive'
      })
    }

  } catch (err) {
    console.error('Error al guardar actividad:', err)
    $q.notify({
      type: 'negative',
      message: 'Error al guardar la actividad'
    })
  } finally {
    loading.value = false
    // Recargar la página para cerrar el diálogo y mostrar la nueva actividad
    setTimeout(() => {
      window.location.reload()
    }, 500)
  }
}

function confirmDelete(activityId) {
  $q.dialog({
    title: 'Eliminar actividad',
    message: '¿Estás seguro de eliminar esta actividad?',
    persistent: true,
    ok: { label: 'Aceptar', color: 'primary', flat: true },
    cancel: { label: 'Cancelar', color: 'primary', flat: true }
  }).onOk(async () => {
    loading.value = true
    try {
      await api.delete(`/actividades/${activityId}`)
      const index = activities.value.findIndex(a => a.id === activityId)
      if (index !== -1) {
        activities.value.splice(index, 1)
      }
      $q.notify({
        message: 'Actividad eliminada correctamente',
        color: 'positive',
        icon: 'o_check'
      })
    } catch (err) {
      console.error('Error al eliminar actividad:', err)
      $q.notify({
        type: 'negative',
        message: 'Error al eliminar la actividad'
      })
    } finally {
      loading.value = false
    }
  })
}

function getStatusColor(estado) {
  const colors = {
    pendiente: 'orange',
    'en-progreso': 'blue',
    completada: 'green',
    cancelada: 'grey'
  }
  return colors[estado] || 'grey'
}
</script>
