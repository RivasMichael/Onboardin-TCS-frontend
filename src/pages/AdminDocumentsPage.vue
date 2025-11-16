<template>
  <q-page class="q-pa-md bg-grey-1">

    <!-- Encabezado y Botón de Acción -->
    <div class="row justify-between items-center q-mb-md">
      <div>
        <div class="text-h6 text-weight-bold">Gestión de Documentos</div>
        <div class="text-subtitle2 text-grey-8">Administra los documentos disponibles para nuevos ingresantes</div>
      </div>
      <q-btn unelevated color="dark" icon="add" label="Nuevo Documento" no-caps @click="openCreateDialog" />
    </div>

    <!-- Filtros -->
    <q-card flat bordered class="q-pa-sm q-mb-lg">
       <div class="row q-gutter-md items-center">
        <q-input
          v-model="searchQuery"
          placeholder="Buscar documentos..."
          borderless
          dense
          class="col"
        >
          <template v-slot:prepend>
            <q-icon name="o_search" />
          </template>
        </q-input>
        <q-select
          v-model="categoryFilter"
          :options="categoryOptions"
          label="Todas las categorías"
          borderless
          dense
          emit-value
          map-options
          class="col-auto"
          style="min-width: 200px"
        />
      </div>
    </q-card>

    <!-- Cuadrícula de Documentos -->
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-6 col-lg-4" v-for="doc in filteredDocuments" :key="doc.id">
        <q-card flat bordered class="full-height">
          <q-card-section>
            <div class="row justify-between items-start">
              <div class="col">
                <div class="text-weight-bold">{{ doc.name }}</div>
                <div class="q-gutter-sm q-mt-xs">
                  <q-chip dense outline color="primary">{{ doc.category }}</q-chip>
                  <q-chip dense outline :color="doc.type === 'Enlace' ? 'orange' : 'grey-7'">{{ doc.type }}</q-chip>
                </div>
              </div>
              <q-btn-group flat>
                <q-btn flat dense icon="o_edit" />
                <q-btn flat dense icon="o_delete" @click="confirmDelete(doc)"/>
              </q-btn-group>
            </div>
            <p class="q-mt-sm text-grey-8 text-caption">{{ doc.description }}</p>
            <a v-if="doc.type === 'Enlace'" :href="doc.url" target="_blank" class="text-primary text-caption ellipsis">{{ doc.url }}</a>
          </q-card-section>
        </q-card>
      </div>
    </div>

     <!-- Diálogo para Crear/Editar Documento -->
    <q-dialog v-model="showDialog">
      <q-card style="width: 500px; max-width: 90vw;">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Nuevo Documento</div>
          <q-space />
          <q-btn icon="o_close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
           <p class="text-grey-8">Agrega un nuevo documento o enlace útil.</p>
          <q-form class="q-gutter-y-md">
            <q-input v-model="activeDocument.name" label="Nombre del Documento *" placeholder="Ej: Manual de Bienvenida" outlined dense />
            <q-input v-model="activeDocument.description" label="Descripción" type="textarea" outlined dense placeholder="Descripción breve del documento..."/>
             <div class="row q-col-gutter-x-md">
              <q-select v-model="activeDocument.type" :options="['PDF', 'Enlace', 'Documento']" label="Tipo *" outlined dense class="col" />
              <q-select v-model="activeDocument.category" :options="['Onboarding', 'Seguridad', 'Herramientas', 'Recursos Humanos', 'Políticas']" label="Categoría *" outlined dense class="col" />
            </div>
            <q-input v-model="activeDocument.url" label="URL / Enlace *" placeholder="https://..." outlined dense v-if="activeDocument.type === 'Enlace'" />
          </q-form>
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat label="Cancelar" v-close-popup />
          <q-btn unelevated label="Guardar" color="dark" @click="saveDocument" />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useQuasar } from 'quasar';

defineOptions({ name: 'AdminDocumentsPage' });

const $q = useQuasar();

// --- Datos de ejemplo ---
const documents = ref([
  { id: 1, name: 'Manual de Bienvenida', description: 'Guía completa para nuevos empleados con información sobre la empresa, cultura y beneficios.', category: 'Onboarding', type: 'PDF', url: '#' },
  { id: 2, name: 'Políticas de Seguridad', description: 'Documento con las políticas de seguridad de la información y buenas prácticas.', category: 'Seguridad', type: 'PDF', url: '#' },
  { id: 3, name: 'Portal Interno', description: 'Acceso al portal interno de recursos humanos y autogestión.', category: 'Herramientas', type: 'Enlace', url: 'https://portal.company.com' },
  { id: 4, name: 'Guía de IT', description: 'Guía para configurar tus herramientas de trabajo: correo, VPN, accesos.', category: 'Herramientas', type: 'Documento', url: '#' },
  { id: 5, name: 'Beneficios y Prestaciones', description: 'Información sobre beneficios, seguro médico, plan de retiro y más.', category: 'Recursos Humanos', type: 'PDF', url: '#' },
  { id: 6, name: 'Código de Ética', description: 'Código de ética y conducta empresarial.', category: 'Políticas', type: 'PDF', url: '#' },
]);

// --- Filtros y Búsqueda ---
const searchQuery = ref('');
const categoryFilter = ref('all');
const categoryOptions = [
  { label: 'Todas las categorías', value: 'all' },
  { label: 'Onboarding', value: 'Onboarding' },
  { label: 'Seguridad', value: 'Seguridad' },
  { label: 'Herramientas', value: 'Herramientas' },
  { label: 'Recursos Humanos', value: 'Recursos Humanos' },
  { label: 'Políticas', value: 'Políticas' },
];

const filteredDocuments = computed(() => {
  return documents.value.filter(doc => {
    const searchMatch = doc.name.toLowerCase().includes(searchQuery.value.toLowerCase());
    const categoryMatch = categoryFilter.value === 'all' || doc.category === categoryFilter.value;
    return searchMatch && categoryMatch;
  });
});

// --- Lógica de Creación/Edición ---
const showDialog = ref(false);
const getNewDocObject = () => ({ id: null, name: '', description: '', category: 'Onboarding', type: 'PDF', url: '' });
const activeDocument = ref(getNewDocObject());

function openCreateDialog() {
  activeDocument.value = getNewDocObject();
  showDialog.value = true;
}

function saveDocument() {
  if (!activeDocument.value.name || !activeDocument.value.category || !activeDocument.value.type) {
    $q.notify({ color: 'negative', message: 'Por favor, completa los campos obligatorios (*)', icon: 'o_warning' });
    return;
  }

  // Lógica para añadir el nuevo documento
  activeDocument.value.id = Date.now();
  documents.value.unshift({ ...activeDocument.value });

  showDialog.value = false;
  $q.notify({ color: 'positive', message: 'Documento guardado correctamente', icon: 'o_check' });
}

// --- Lógica de Eliminación ---
function confirmDelete(doc) {
  $q.dialog({
    title: 'Figma',
    message: `¿Estás seguro de eliminar "${doc.name}"?`,
    cancel: {
      label: 'Cancelar',
      flat: true
    },
    ok: {
      label: 'Aceptar',
      color: 'primary',
      flat: true
    },
    persistent: true
  }).onOk(() => {
    const index = documents.value.findIndex(d => d.id === doc.id);
    if (index !== -1) {
      documents.value.splice(index, 1);
      $q.notify({ color: 'positive', message: 'Documento eliminado correctamente', icon: 'o_check' });
    }
  });
}

</script>
