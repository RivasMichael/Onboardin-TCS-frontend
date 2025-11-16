<template>
  <q-page class="q-pa-md">

    <!-- Encabezado -->
    <div class="row items-center q-mb-md">
      <q-avatar color="primary" text-color="white" icon="o_school" class="q-mr-md" />
      <div>
        <div class="text-h6 text-weight-bold">Cursos Recomendados</div>
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
        :options="allCategories"
        label="Categoría"
        outlined
        dense
        class="col-auto"
        style="min-width: 200px;"
      />
    </div>

    <!-- Sección: Recomendados para ti -->
    <div class="q-mb-xl">
      <div class="text-h6 text-weight-bold row items-center q-mb-md">
        <q-icon name="o_auto_awesome" color="primary" class="q-mr-sm" />
        Recomendados para ti
        <q-chip dense outline color="grey-7" class="q-ml-sm text-caption">Según tu perfil</q-chip>
      </div>
      <div class="row q-col-gutter-md">
        <div class="col-12 col-sm-6 col-md-4" v-for="course in filteredRecommendedCourses" :key="course.id">
          <q-card flat bordered class="full-height">
            <q-card-section>
              <div class="row justify-between items-center">
                <q-chip dense :label="course.level" :color="course.level === 'Principiante' ? 'green-2' : 'orange-2'" :text-color="course.level === 'Principiante' ? 'green-7' : 'orange-7'" />
                <q-btn flat round dense icon="o_favorite_border" />
              </div>
              <div class="text-h6 q-mt-sm q-mb-xs">{{ course.title }}</div>
              <p class="text-body2 text-grey-8">{{ course.description }}</p>
            </q-card-section>
            <q-separator />
            <q-card-section class="text-grey-7">
              <div class="row items-center q-mb-xs"><q-icon name="o_business" class="q-mr-sm" /> {{ course.provider }}</div>
              <div class="row items-center q-mb-xs"><q-icon name="o_schedule" class="q-mr-sm" /> {{ course.duration }} horas</div>
              <div class="row items-center"><q-icon name="o_star" color="amber" class="q-mr-sm" /> {{ course.rating }}</div>
            </q-card-section>
            <q-card-actions class="q-pa-md">
               <q-chip dense outline :label="course.category" color="grey-8" />
               <q-space />
               <q-btn unelevated color="dark" label="Ir al curso" icon-right="o_launch" no-caps @click="goToCourse(course.url)" />
            </q-card-actions>
          </q-card>
        </div>
        <div v-if="filteredRecommendedCourses.length === 0" class="col-12 text-center q-pa-xl">
          <q-icon name="o_search_off" size="lg" color="grey-5" />
          <div class="text-h6 text-grey-7 q-mt-md">No se encontraron cursos</div>
        </div>
      </div>
    </div>

     <!-- Sección: Explora más cursos -->
    <div>
      <div class="text-h6 text-weight-bold row items-center q-mb-md">
        <q-icon name="o_explore" color="primary" class="q-mr-sm" />
        Explora más cursos
      </div>
      <div class="row q-col-gutter-md">
         <div class="col-12 col-sm-6 col-md-4" v-for="course in filteredExploreCourses" :key="course.id">
          <q-card flat bordered class="full-height">
            <q-card-section>
              <div class="row justify-between items-center">
                <q-chip dense :label="course.level" :color="course.level === 'Principiante' ? 'green-2' : (course.level === 'Avanzado' ? 'red-2' : 'orange-2')" :text-color="course.level === 'Principiante' ? 'green-7' : (course.level === 'Avanzado' ? 'red-7' : 'orange-7')" />
                <q-btn flat round dense icon="o_favorite_border" />
              </div>
              <div class="text-h6 q-mt-sm q-mb-xs">{{ course.title }}</div>
              <p class="text-body2 text-grey-8">{{ course.description }}</p>
            </q-card-section>
            <q-separator />
            <q-card-section class="text-grey-7">
              <div class="row items-center q-mb-xs"><q-icon name="o_business" class="q-mr-sm" /> {{ course.provider }}</div>
              <div class="row items-center q-mb-xs"><q-icon name="o_schedule" class="q-mr-sm" /> {{ course.duration }} horas</div>
              <div class="row items-center"><q-icon name="o_star" color="amber" class="q-mr-sm" /> {{ course.rating }}</div>
            </q-card-section>
            <q-card-actions class="q-pa-md">
               <q-chip dense outline :label="course.category" color="grey-8" />
               <q-space />
               <q-btn unelevated color="dark" label="Ir al curso" icon-right="o_launch" no-caps @click="goToCourse(course.url)" />
            </q-card-actions>
          </q-card>
        </div>
         <div v-if="filteredExploreCourses.length === 0" class="col-12 text-center q-pa-xl">
          <q-icon name="o_search_off" size="lg" color="grey-5" />
          <div class="text-h6 text-grey-7 q-mt-md">No se encontraron cursos</div>
        </div>
      </div>
    </div>

  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue';

defineOptions({ name: 'CursosPage' });

const searchQuery = ref('');
const categoryFilter = ref('Todas las categorías');

const recommendedCourses = ref([
  { id: 1, level: 'Principiante', title: 'Aprende Python conmigo', description: 'Curso completo de Python...', provider: 'TCS Academy', duration: 40, rating: 4.8, category: 'Programación', url: 'https://www.google.com/search?q=Aprende+Python' },
  { id: 2, level: 'Intermedio', title: 'Introducción a Gemini AI', description: 'Descubre las capacidades de Gemini AI...', provider: 'Google Cloud', duration: 15, rating: 4.9, category: 'Inteligencia Artificial', url: 'https://skills.google/paths/236' },
  { id: 3, level: 'Principiante', title: 'Metodologías Ágiles con Scrum', description: 'Aprende a trabajar con metodologías ágiles...', provider: 'TCS Academy', duration: 25, rating: 4.7, category: 'Gestión de Proyectos', url: 'https://www.google.com/search?q=Metodologias+Agiles+con+Scrum' }
]);

const exploreCourses = ref([
  { id: 4, level: 'Intermedio', title: 'Cybersecurity Fundamentals', description: 'Fundamentos de ciberseguridad...', provider: 'TCS Academy', duration: 35, rating: 4.7, category: 'Seguridad', url: 'https://www.google.com/search?q=Cybersecurity+Fundamentals' },
  { id: 5, level: 'Avanzado', title: 'React y TypeScript Avanzado', description: 'Domina React con TypeScript...', provider: 'Frontend Masters', duration: 30, rating: 4.9, category: 'Desarrollo Web', url: 'https://www.google.com/search?q=React+y+TypeScript+Avanzado' },
  { id: 6, level: 'Principiante', title: 'AWS Cloud Practitioner', description: 'Certificación fundamental de AWS...', provider: 'AWS Training', duration: 20, rating: 4.6, category: 'Cloud Computing', url: 'https://aws.amazon.com/es/certification/certified-cloud-practitioner/' },
  { id: 7, level: 'Intermedio', title: 'Machine Learning con TensorFlow', description: 'Construye modelos de machine learning...', provider: 'Coursera', duration: 50, rating: 4.8, category: 'Machine Learning', url: 'https://www.coursera.org/learn/machine-learning-with-tensorflow-on-google-cloud-platform' },
  { id: 8, level: 'Intermedio', title: 'Docker y Kubernetes', description: 'Domina la containerización y orquestación...', provider: 'Linux Foundation', duration: 45, rating: 4.8, category: 'DevOps', url: 'https://www.google.com/search?q=Docker+y+Kubernetes' },
]);

const allCategories = computed(() => {
  const categories = new Set();
  recommendedCourses.value.forEach(c => categories.add(c.category));
  exploreCourses.value.forEach(c => categories.add(c.category));
  return ['Todas las categorías', ...Array.from(categories)];
});

const filterCourses = (courses) => {
  return courses.filter(course => {
    const searchLower = searchQuery.value.toLowerCase();
    const matchesSearch = course.title.toLowerCase().includes(searchLower) ||
                          course.description.toLowerCase().includes(searchLower) ||
                          course.category.toLowerCase().includes(searchLower);
    const matchesCategory = categoryFilter.value === 'Todas las categorías' || course.category === categoryFilter.value;
    return matchesSearch && matchesCategory;
  });
};

const filteredRecommendedCourses = computed(() => filterCourses(recommendedCourses.value));
const filteredExploreCourses = computed(() => filterCourses(exploreCourses.value));

function goToCourse(url) {
  window.open(url, '_blank');
}

</script>
