<template>
  <q-page class="q-pa-md" style="background-color: #f8f9fa;">

    <!-- Cabecera del Perfil -->
    <q-card flat class="q-mb-md text-white supervisor-card">
      <q-card-section class="text-center">
        <q-avatar size="100px" class="shadow-10">
          <q-avatar size="95px" color="primary" text-color="white">
            {{ supervisor.nombre ? supervisor.nombre.split(' ').map(n => n[0]).join('').toUpperCase() : '?' }}
          </q-avatar>
        </q-avatar>
        <div class="text-h5 q-mt-md">{{ supervisor.nombre }}</div>
        <div class="text-subtitle1">{{ supervisor.cargo }}</div>
        <q-chip square color="blue-4" text-color="white" icon="o_star">Supervisor</q-chip>
      </q-card-section>
      <q-banner dense class="bg-white bg-opacity-10 text-center q-py-sm">
        <q-icon name="o_info" class="q-mr-sm" /> {{ supervisor.mensajeBienvenida }}
      </q-banner>
    </q-card>

    <!-- Información de contacto -->
    <q-card flat bordered class="q-mb-md">
      <q-card-section>
        <div class="text-weight-bold">Información de contacto</div>
        <q-list separator class="q-mt-sm">
          <q-item>
            <q-item-section>
              <q-item-label caption>Email</q-item-label>
              <q-item-label>{{ supervisor.correo }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item v-if="supervisor.telefono">
            <q-item-section>
              <q-item-label caption>Teléfono</q-item-label>
              <q-item-label>{{ supervisor.telefono }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item v-if="supervisor.departamento">
            <q-item-section>
              <q-item-label caption>Departamento</q-item-label>
              <q-item-label>{{ supervisor.departamento }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>

    <!-- Horario de atención -->
    <q-card flat bordered class="q-mb-md">
      <q-card-section>
        <div class="text-weight-bold">Horario de atención</div>
        <div class="bg-green-1 q-pa-md rounded-borders q-mt-md">
          <q-badge rounded color="green" class="q-mr-sm"/>
          <span class="text-weight-medium">{{ supervisor.horario }}</span>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { api } from 'src/boot/axios';

defineOptions({ name: 'SupervisorPage' });

const supervisor = ref({
  nombre: '',
  correo: '',
  cargo: '',
  telefono: '',
  horario: '',
  mensajeBienvenida: '',
  departamento: ''
});

onMounted(() => {
  api.get('/perfil/mi-supervisor')
    .then(res => {
      supervisor.value = {
        nombre: res.data.nombre || '',
        correo: res.data.correo || '',
        cargo: res.data.cargo || '',
        telefono: res.data.telefono || '',
        horario: res.data.horario || '',
        mensajeBienvenida: res.data.mensajeBienvenida || '',
        departamento: res.data.departamento || ''
      };
    })
    .catch(() => {
      supervisor.value = {
        nombre: '', correo: '', cargo: '', telefono: '', horario: '', mensajeBienvenida: '', departamento: ''
      };
    });
});
</script>

<style lang="scss" scoped>
.supervisor-card {
  background: linear-gradient(to right, #8e2de2, #4a00e0) !important;
  box-shadow: 0 2px 12px rgba(0,0,0,0.12);
}
.bg-opacity-10 {
  background-color: rgba(255, 255, 255, 0.1) !important;
}
.q-card-section {
  font-size: 1.08em;
}
.q-item-label[caption] {
  color: #1976d2;
  font-weight: 500;
}
.q-item-label:not([caption]) {
  color: #333;
}
</style>
