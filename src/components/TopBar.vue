<template>
  <div class="topbar row items-center q-pa-sm">
    <div class="row items-center q-gutter-sm">
      <div class="logo-avatar">
        <q-avatar size="48" class="bg-primary text-white">
          <q-icon name="chat_bubble" />
        </q-avatar>
      </div>
      <div>
        <div class="text-h6">Asistente de Onboarding</div>
        <div class="text-caption">Disponible 24/7 para ayudarte</div>
      </div>
    </div>

    <div class="nav-tabs row items-center q-ml-auto">
      <q-btn flat dense round icon="chat" label="Chat" />
      <q-btn flat dense round icon="calendar_today" label="Actividades" />
      <q-btn flat dense round icon="school" label="Cursos" />
      <q-btn flat dense round icon="folder" label="Documentos" />
      <q-btn flat dense round icon="supervisor_account" label="Supervisor" />
    </div>

    <div class="user-info row items-center q-ml-sm">
      <div class="q-mr-md text-right">
        <div class="text-subtitle2">María González</div>
        <div class="text-caption">Nuevo Especialista</div>
      </div>
      <q-avatar size="40" class="bg-blue text-white">MG</q-avatar>
      <q-btn flat dense round icon="logout" class="q-ml-sm" />
    </div>
  </div>
</template>

<script setup>
// No JS required for simple topbar
</script>

<style scoped>
.topbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 72px;
  background: #ffffff;
  border-bottom: 1px solid rgba(0,0,0,0.06);
  padding-left: 16px;
  padding-right: 16px;
  z-index: 1000;
}
.logo-avatar { margin-right: 12px }
.nav-tabs q-btn { margin-left: 8px }
.user-info { margin-left: 16px }
</style>
