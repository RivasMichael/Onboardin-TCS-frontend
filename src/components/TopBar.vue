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
        <div class="text-subtitle2">{{ nombreUsuario }}</div>
        <div class="text-caption">{{ cargoUsuario }}</div>
      </div>
      <q-avatar size="40" class="bg-blue text-white">{{ iniciales }}</q-avatar>
      <q-btn flat dense round icon="account_circle" class="q-ml-sm" @click="abrirPerfil" style="cursor:pointer" />
      <q-btn flat dense round icon="logout" class="q-ml-sm" />
    </div>
    <UserProfile v-model="showPerfil" />
    <UserProfileCard v-if="showPerfil" @close="showPerfil = false" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import UserProfile from 'src/components/UserProfile.vue'
import UserProfileCard from 'src/components/UserProfileCard.vue'
import { useAuthStore } from 'src/stores/auth'

const auth = useAuthStore()
const showPerfil = ref(false)

onMounted(() => {
  auth.loadFromStorage()
})

const nombreUsuario = computed(() => auth.usuario?.nombre || 'Usuario')
const cargoUsuario = computed(() => auth.usuario?.cargo || '')
const iniciales = computed(() => {
  if (!auth.usuario?.nombre) return 'U'
  return auth.usuario.nombre.split(' ').map(n => n[0]).join('').toUpperCase()
})

function abrirPerfil() {
  showPerfil.value = true
}
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
