<template>
  <div class="user-profile-card">
    <q-card class="q-pa-md" style="min-width: 320px; max-width: 360px;">
      <q-card-section class="text-center">
        <q-avatar size="64px" color="primary" text-color="white" class="q-mb-md">
          <span style="font-size:2em">{{ perfil.nombre ? perfil.nombre.split(' ').map(n => n[0]).join('').toUpperCase() : '?' }}</span>
        </q-avatar>
        <div class="text-h6 q-mb-xs">{{ perfil.nombre }}</div>
        <div class="text-caption text-grey-7 q-mb-md">{{ perfil.cargo }} &mdash; {{ perfil.departamento }}</div>
        <div v-if="perfil.rol" class="q-mt-xs">
          <q-chip color="primary" text-color="white" icon="person">{{ perfil.rol }}</q-chip>
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <div class="q-mb-xs"><q-icon name="mail" size="18px" class="q-mr-xs"/> <b>Correo:</b> {{ perfil.correo }}</div>
        <div class="q-mb-xs"><q-icon name="badge" size="18px" class="q-mr-xs"/> <b>Código Empleado:</b> {{ perfil.codigoEmpleado }}</div>
        <div class="q-mb-xs"><q-icon name="event" size="18px" class="q-mr-xs"/> <b>Fecha Inicio:</b> {{ perfil.fechaInicioTexto }}</div>
        <div class="q-mb-xs"><q-icon name="location_on" size="18px" class="q-mr-xs"/> <b>Oficina:</b> {{ perfil.oficina }}</div>
        <div v-if="perfil.supervisor" class="q-mb-xs"><q-icon name="supervisor_account" size="18px" class="q-mr-xs"/> <b>Supervisor:</b> {{ perfil.supervisor }}</div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Cerrar" @click="$emit('close')" />
      </q-card-actions>
    </q-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api } from 'src/boot/axios'

const perfil = ref({})

onMounted(() => {
  api.get('/perfil/mi-perfil')
    .then(res => { perfil.value = res.data })
    .catch(() => { perfil.value = {} })
})
</script>

<style scoped>
.user-profile-card {
  position: fixed;
  top: 80px;
  right: 32px;
  z-index: 2000;
  box-shadow: 0 2px 12px rgba(0,0,0,0.15);
}
</style>
