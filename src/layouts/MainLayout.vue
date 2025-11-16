<template>
  <q-layout view="lHh Lpr lFf">

    <q-header elevated class="bg-white text-dark q-py-xs">
      <q-toolbar>
        <q-btn flat dense round icon="o_apps" aria-label="Menu" @click="toggleLeftDrawer" />
        <q-avatar class="q-ml-sm">
          <img src="https://cdn-icons-png.flaticon.com/512/2593/2593641.png">
        </q-avatar>
        <q-toolbar-title>
          Asistente de Onboarding
        </q-toolbar-title>

        <q-space />

        <div class="q-gutter-sm row items-center no-wrap">
          <span class="text-weight-bold">María González</span>
          <q-avatar size="lg" color="primary" text-color="white">MG</q-avatar>
          <q-btn round flat icon="o_logout" aria-label="Salir" @click="logout" />
        </div>
      </q-toolbar>

      <q-tabs align="left" class="q-mt-sm" v-model="currentTab">
        <q-route-tab to="/dashboard/chat/general" name="chat" icon="o_chat" label="Chat">
          <q-badge color="red" floating>3</q-badge>
        </q-route-tab>
        <q-route-tab to="/dashboard/actividades" name="actividades" icon="o_pending_actions" label="Actividades">
          <q-badge color="red" floating>5</q-badge>
        </q-route-tab>
        <q-route-tab to="/dashboard/cursos" name="cursos" icon="o_school" label="Cursos" />
        <q-route-tab to="/dashboard/documentos" name="documentos" icon="o_description" label="Documentos" />
        <q-route-tab to="/dashboard/supervisor" name="supervisor" icon="o_supervisor_account" label="Supervisor" />
      </q-tabs>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      bordered
      :width="300"
    >
      <q-toolbar class="q-mt-sm">
        <div class="text-h6 text-weight-bold">Historial</div>
        <q-space />
        <q-btn flat round dense icon="o_close" @click="toggleLeftDrawer" />
      </q-toolbar>

      <q-list class="q-pa-md">
        <q-item>
          <q-btn outline rounded class="full-width" icon="o_add" label="+ Nueva conversación" no-caps />
        </q-item>

        <q-separator class="q-my-md" />

        <q-item clickable v-ripple class="bg-blue-1 rounded-borders">
          <q-item-section>
            <q-item-label>Nueva conversación</q-item-label>
            <q-item-label caption>15/11/2023</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-icon name="o_star_border" />
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container style="background-color: #f5f7fa;">
      <router-view @toggle-drawer="toggleLeftDrawer" />
    </q-page-container>

  </q-layout>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

defineOptions({ name: 'MainLayout' });

const router = useRouter();
const leftDrawerOpen = ref(false);
const currentTab = ref('chat');

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

function logout() {
  // Navegar de vuelta a la página de login
  router.push('/');
}

</script>
