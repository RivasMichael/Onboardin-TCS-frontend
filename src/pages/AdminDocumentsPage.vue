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

    <!-- Diálogo para subir PDF con descripción y metadatos -->
    <q-dialog v-model="showDialog">
      <AdminUploadDocument @close="showDialog = false" @uploaded="onDocumentUploaded" />
    </q-dialog>
    </q-dialog>

  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import AdminUploadDocument from 'src/components/AdminUploadDocument.vue';
import { api } from 'src/boot/axios';

defineOptions({ name: 'AdminDocumentsPage' });

const $q = useQuasar();

// --- Documentos desde API ---
const documents = ref([]);
const loadingDocs = ref(false);

async function loadDocuments() {
  loadingDocs.value = true;
  try {
    const response = await api.get('/documentos');
    documents.value = response.data.map(doc => ({
      id: doc.id,
      name: doc.titulo,
      description: doc.descripcion,
      category: doc.categoria,
      size: doc.tamanoArchivo,
      createdAt: doc.creadoEn,
      // type y url pueden ser null o calculados si lo necesitas
      type: 'PDF',
      url: null
    }));
  } catch {
    $q.notify({ type: 'negative', message: 'Error al cargar documentos' });
  } finally {
    loadingDocs.value = false;
  }
}

onMounted(loadDocuments);

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

// PDF file handling
const pdfFile = ref(null);
const pdfError = ref('');
const pdfInput = ref(null);
const MAX_PDF_SIZE = 10 * 1024 * 1024; // 10MB

function onPdfSelected(e) {
  pdfError.value = '';
  const file = e.target.files && e.target.files[0];
  if (!file) return;
  if (file.type !== 'application/pdf') {
    pdfError.value = 'El archivo debe ser un PDF.';
    pdfFile.value = null;
    e.target.value = null;
    return;
  }
  if (file.size > MAX_PDF_SIZE) {
    pdfError.value = 'El archivo supera el tamaño máximo de 10MB.';
    pdfFile.value = null;
    e.target.value = null;
    return;
  }
  pdfFile.value = file;
}

function removePdf() {
  pdfFile.value = null;
  pdfError.value = '';
  if (pdfInput.value) pdfInput.value.value = null;
}

function triggerPdfInput() {
  if (pdfInput.value) pdfInput.value.click();
}

function readableSize(bytes) {
  if (!bytes) return '';
  const mb = bytes / (1024 * 1024);
  if (mb >= 1) return mb.toFixed(2) + ' MB';
  const kb = bytes / 1024;
  return kb.toFixed(2) + ' KB';
}

function openCreateDialog() {
  showDialog.value = true;
}

async function onDocumentUploaded() {
  showDialog.value = false;
  await loadDocuments();
  $q.notify({ color: 'positive', message: 'Documento subido y listado actualizado', icon: 'o_check' });
}
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
