<template>
  <q-layout view="lHh Lpr lFf">

    <q-header elevated class="bg-white text-dark q-py-xs">
      <q-toolbar>
        <q-toolbar-title>
          <div class="text-h6 text-weight-bold">Panel de Administración</div>
          <div class="text-subtitle2 text-grey-8">Gestión de Onboarding</div>
        </q-toolbar-title>

        <q-space />

        <div class="q-gutter-sm row items-center no-wrap">
          <div class="text-right">
            <div class="text-weight-bold">{{ nombreUsuario }}</div>
            <div class="text-caption">{{ rolUsuario }}</div>
          </div>
          <q-btn round flat icon="account_circle" aria-label="Ver perfil" @click="abrirPerfilCard" style="cursor:pointer" />
          <q-btn round flat icon="o_logout" aria-label="Salir" @click="logout" />
        </div>
        <UserProfileCard v-if="showPerfilCard" @close="showPerfilCard = false" />
      </q-toolbar>

      <q-tabs align="left" class="q-mt-sm" v-model="currentTab">
        <q-route-tab to="/admin/progreso" name="progreso" icon="o_show_chart" label="Progreso" />
        <q-route-tab to="/admin/actividades" name="actividades" icon="o_event" label="Actividades" />
        <q-route-tab to="/admin/documentos" name="documentos" icon="o_folder" label="Documentos" />
        <!-- Calendario eliminado -->
      </q-tabs>
    </q-header>

    <q-page-container style="background-color: #f5f7fa;">
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from 'src/stores/auth';
import UserProfileCard from 'src/components/UserProfileCard.vue';

defineOptions({ name: 'AdminLayout' });

const router = useRouter();
const auth = useAuthStore();
const currentTab = ref('progreso');
const showPerfilCard = ref(false);

onMounted(() => {
  auth.loadFromStorage();
});

const nombreUsuario = computed(() => auth.usuario?.nombre || 'Usuario');
const rolUsuario = computed(() => auth.usuario?.rol || 'admin');

function logout() {
  // Navegar de vuelta a la página de login
  router.push('/');
}

function abrirPerfilCard() {
  showPerfilCard.value = true;
}

</script>
