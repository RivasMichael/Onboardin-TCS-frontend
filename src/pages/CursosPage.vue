<template>
  <q-page class="q-pa-md">

    <!-- Encabezado -->
    <div class="row items-center q-mb-md">
      <q-avatar color="primary" text-color="white" icon="o_school" class="q-mr-md" />
      <div>
        <div class="text-h6 text-weight-bold">Cursos Disponibles</div>
        <div class="text-subtitle1 text-grey-8">Desarrolla tus habilidades con cursos personalizados</div>
      </div>
    </div>

    <!-- Barra de Búsqueda y Filtros -->
    <div class="row q-mb-lg q-gutter-md items-center">
      <q-input
        v-model="searchQuery"
        placeholder="Buscar cursos..."
        outlined
        dense
        class="col"
        clearable
      >
        <template v-slot:prepend>
          <q-icon name="o_search" />
        </template>
      </q-input>
      <q-select
        v-model="categoryFilter"
        :options="categories"
        label="Categoría"
        outlined
        dense
        class="col-auto"
        style="min-width: 200px;"
      />
       <q-select
        v-model="levelFilter"
        :options="levels"
        label="Nivel"
        outlined
        dense
        class="col-auto"
        style="min-width: 200px;"
      />
    </div>

    <!-- Lista de Cursos -->
     <div class="row q-col-gutter-md">
        <div class="col-12 col-sm-6 col-md-4" v-for="course in filteredCourses" :key="course.id">
          <q-card flat bordered class="full-height">
            <q-card-section>
              <div class="row justify-between items-center">
                <q-chip dense :label="course.nivel" :color="course.nivel === 'Principiante' ? 'green-2' : (course.nivel === 'Avanzado' ? 'red-2' : 'orange-2')" :text-color="course.nivel === 'Principiante' ? 'green-7' : (course.nivel === 'Avanzado' ? 'red-7' : 'orange-7')" />
              </div>
              <div class="text-h6 q-mt-sm q-mb-xs">{{ course.titulo }}</div>
              <p class="text-body2 text-grey-8">{{ course.descripcion }}</p>
            </q-card-section>
            <q-separator />
            <q-card-section class="text-grey-7">
              <div class="row items-center q-mb-xs"><q-icon name="o_business" class="q-mr-sm" /> {{ course.instructor }}</div>
              <div class="row items-center q-mb-xs"><q-icon name="o_schedule" class="q-mr-sm" /> {{ course.duracion }}</div>
            </q-card-section>
            <q-card-actions class="q-pa-md">
               <q-chip dense outline :label="course.categoria" color="grey-8" />
               <q-space />
               <q-btn unelevated color="dark" label="Ir al curso" icon-right="o_launch" no-caps @click="goToCourse(course.link)" />
            </q-card-actions>
          </q-card>
        </div>
        <div v-if="!courses.length" class="col-12 text-center q-pa-xl">
          <q-spinner-dots color="primary" size="40px" />
          <div class="text-h6 text-grey-7 q-mt-md">Cargando cursos...</div>
        </div>
        <div v-else-if="!filteredCourses.length" class="col-12 text-center q-pa-xl">
          <q-icon name="o_search_off" size="lg" color="grey-5" />
          <div class="text-h6 text-grey-7 q-mt-md">No se encontraron cursos con esos filtros.</div>
        </div>
      </div>

  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { api } from 'boot/axios';

defineOptions({ name: 'CursosPage' });

const courses = ref([]);
const categories = ref(['Todas las categorías']);
const levels = ref(['Todos los niveles']);

const searchQuery = ref('');
const categoryFilter = ref('Todas las categorías');
const levelFilter = ref('Todos los niveles');

const fetchCategories = async () => {
  try {
    const response = await api.get('/curso/categorias'); // <-- CORRECCIÓN: Se eliminó /api/
    const newCategories = [...new Set(response.data)];
    categories.value.push(...newCategories);
  } catch (error) {
    console.error('Error fetching categories:', error);
  }
};

const fetchLevels = async () => {
  try {
    const response = await api.get('/curso/niveles'); // <-- CORRECCIÓN: Se eliminó /api/
    const newLevels = [...new Set(response.data)];
    levels.value.push(...newLevels);
  } catch (error) {
    console.error('Error fetching levels:', error);
  }
};

const fetchCourses = async () => {
  try {
    const response = await api.get('/curso/'); // <-- CORRECCIÓN: Se eliminó /api/
    courses.value = response.data;
  } catch (error) {
    console.error('Error fetching courses:', error);
  }
};

onMounted(() => {
  fetchCategories();
  fetchLevels();
  fetchCourses();
});

const filteredCourses = computed(() => {
  return courses.value.filter(course => {
    const searchLower = searchQuery.value.toLowerCase();
    const matchesSearch = !searchQuery.value ||
                          course.titulo.toLowerCase().includes(searchLower) ||
                          course.descripcion.toLowerCase().includes(searchLower);

    const matchesCategory = categoryFilter.value === 'Todas las categorías' || course.categoria === categoryFilter.value;

    const matchesLevel = levelFilter.value === 'Todos los niveles' || course.nivel === levelFilter.value;

    return matchesSearch && matchesCategory && matchesLevel;
  });
});

function goToCourse(url) {
  if (url) {
      window.open(url, '_blank');
  }
}

</script>
