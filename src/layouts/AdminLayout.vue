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
            <div class="text-weight-bold">Administrador RRHH</div>
            <div class="text-caption">Administrador</div>
          </div>
          <q-avatar size="lg" color="secondary" text-color="white">AR</q-avatar>
          <q-btn round flat icon="o_logout" aria-label="Salir" @click="logout" />
        </div>
      </q-toolbar>

      <q-tabs align="left" class="q-mt-sm" v-model="currentTab">
        <q-route-tab to="/admin/progreso" name="progreso" icon="o_show_chart" label="Progreso" />
        <q-route-tab to="/admin/mensajes" name="mensajes" icon="o_chat" label="Mensajes" />
        <q-route-tab to="/admin/documentos" name="documentos" icon="o_folder" label="Documentos" />
        <q-route-tab to="/admin/calendario" name="calendario" icon="o_calendar_today" label="Calendario" />
      </q-tabs>
    </q-header>

    <q-page-container style="background-color: #f5f7fa;">
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

defineOptions({ name: 'AdminLayout' });

const router = useRouter();
const currentTab = ref('progreso');

function logout() {
  // Navegar de vuelta a la página de login
  router.push('/');
}

</script>
