<template>
  <q-page class="q-pa-md">

    <!-- Encabezado -->
    <div class="q-mb-lg">
      <div class="text-h6 text-weight-bold">Documentos y Enlaces Útiles</div>
      <div class="text-subtitle1 text-grey-8">Accede a recursos importantes para tu onboarding</div>
    </div>

    <!-- Barra de Búsqueda y Filtros -->
    <div class="q-mb-lg">
      <q-input
        v-model="searchQuery"
        placeholder="Buscar documentos..."
        outlined
        dense
        clearable
      >
        <template v-slot:prepend>
          <q-icon name="o_search" />
        </template>
      </q-input>
    </div>

    <q-btn-toggle
      v-model="categoryFilter"
      class="q-mb-lg"
      no-caps
      rounded
      unelevated
      toggle-color="dark"
      color="white"
      text-color="dark"
      :options="filterOptions"
    />

    <!-- Lista de Documentos y Enlaces -->
    <div class="q-gutter-y-md">
      <q-card v-for="item in filteredItems" :key="item.id" flat bordered>
        <q-card-section class="row items-center">
          <q-avatar
            :color="item.type === 'document' ? 'red-1' : 'blue-1'"
            :text-color="item.type === 'document' ? 'red-7' : 'blue-7'"
            :icon="item.type === 'document' ? 'o_description' : 'o_link'"
            class="q-mr-md"
          />
          <div class="col">
            <div class="text-weight-bold">{{ item.title }}</div>
            <div class="text-grey-8">{{ item.description }}</div>
          </div>
          <q-chip dense outline :label="item.category" color="grey-8" />
        </q-card-section>

        <q-separator />

        <q-card-actions align="right" class="q-pa-md">
          <q-btn
            flat
            color="primary"
            no-caps
            :icon-right="item.type === 'document' ? 'o_download' : 'o_open_in_new'"
            :label="item.type === 'document' ? 'Descargar' : 'Abrir enlace'"
            @click="handleAction(item.url, item)"
          />
        </q-card-actions>
      </q-card>

       <!-- Mensaje de "No hay resultados" -->
      <div v-if="filteredItems.length === 0" class="text-center q-pa-xl">
        <q-icon name="o_search_off" size="xl" color="grey-5" />
        <div class="text-h6 text-grey-7 q-mt-md">No se encontraron documentos</div>
        <div class="text-subtitle1 text-grey-6">Prueba con otra búsqueda o filtro</div>
      </div>
    </div>

  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { api } from 'src/boot/axios';

defineOptions({ name: 'DocumentosPage' });

const searchQuery = ref('');
const categoryFilter = ref('Todos');

const items = ref([]);

async function loadDocuments() {
  try {
    const response = await api.get('/documentos');
    items.value = response.data.map(doc => ({
      id: doc.id,
      title: doc.titulo,
      description: doc.descripcion,
      type: 'document',
      category: doc.categoria,
      url: `/documentos/${doc.id}/download`
    }));
    console.log('Documentos cargados:', items.value);
  } catch {
    // Puedes mostrar un notify si quieres
  }
}

onMounted(loadDocuments);

const filterOptions = computed(() => {
  const categories = new Set(items.value.map(item => item.category));
  return ['Todos', ...Array.from(categories)].map(cat => ({ label: cat, value: cat }));
});

const filteredItems = computed(() => {
  return items.value.filter(item => {
    const searchLower = searchQuery.value.toLowerCase();
    const matchesSearch = item.title.toLowerCase().includes(searchLower) || item.description.toLowerCase().includes(searchLower);
    const matchesCategory = categoryFilter.value === 'Todos' || item.category === categoryFilter.value;
    return matchesSearch && matchesCategory;
  });
});

async function handleAction(url, item) {
  try {
    const response = await api.get(url, { responseType: 'blob' });
    const blob = new Blob([response.data], { type: response.headers['content-type'] });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = (item.title || 'documento') + '.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(link.href);
  } catch {
    // Puedes mostrar un notify si quieres
  }
}

</script>
