<template>
  <q-page class="q-pa-lg bg-grey-2">
    <div class="column q-gutter-y-md" style="max-width: 800px; margin: 0 auto;">

      <!-- Title -->
      <div class="text-h4 text-weight-medium">Mi Supervisor</div>
      <p class="text-subtitle1 text-grey-7">Conoce a tu supervisor y mantente en contacto</p>

      <!-- Supervisor Card -->
      <q-card flat bordered>
        <q-card-section>
          <!-- Supervisor Header -->
          <q-item class="q-mb-md">
            <q-item-section avatar>
              <q-avatar color="primary" text-color="white" size="60px">
                {{ getInitials(supervisor.nombre) }}
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-weight-bold text-h6">{{ supervisor.nombre }}</q-item-label>
              <q-item-label caption class="text-body1">{{ supervisor.cargo }}</q-item-label>
            </q-item-section>
          </q-item>

          <!-- Welcome Message -->
          <q-banner inline-actions class="bg-indigo-1 text-indigo-8 q-py-md rounded-borders">
            <template v-slot:avatar>
              <q-icon name="o_info" size="sm" />
            </template>
            <!-- Este mensaje de bienvenida es estático, basado en el nuevo diseño. -->
            ¡Bienvenido/a al equipo! Estoy aquí para apoyarte en tu proceso de integración. No dudes en contactarme si tienes alguna pregunta.
          </q-banner>

          <!-- Contact Info -->
          <div class="text-weight-bold q-mt-lg q-mb-sm">Información de contacto</div>
          <q-list padding>
            <q-item>
              <q-item-section avatar top>
                <q-icon color="grey-7" name="o_email" />
              </q-item-section>
              <q-item-section>
                <q-item-label caption>Email</q-item-label>
                <q-item-label>{{ supervisor.correo }}</q-item-label>
              </q-item-section>
            </q-item>
             <q-item>
              <q-item-section avatar top>
                <q-icon color="grey-7" name="o_phone" />
              </q-item-section>
              <q-item-section>
                <q-item-label caption>Teléfono</q-item-label>
                <q-item-label>{{ supervisor.telefono }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section avatar top>
                <q-icon color="grey-7" name="o_schedule" />
              </q-item-section>
              <q-item-section>
                <q-item-label caption>Horario de atención</q-item-label>
                <q-item-label>{{ supervisor.horario }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>

        <!-- Action Button -->
        <q-separator />
        <q-card-section>
          <q-btn
            class="full-width"
            color="dark"
            size="lg"
            rounded
            no-caps
            icon="o_send"
            label="Enviar correo"
            :href="'mailto:' + supervisor.correo"
          />
        </q-card-section>
      </q-card>

      <!-- Tips Card -->
      <q-card flat bordered>
        <q-card-section>
          <div class="text-weight-bold">Consejos para tu primer contacto</div>
           <ul class="q-pl-lg q-mt-sm text-grey-8">
            <li>Preséntate brevemente y muestra tu entusiasmo por unirte al equipo</li>
            <li>Pregunta sobre las expectativas para tu primer día</li>
            <li>No dudes en consultar tus dudas sobre el proceso de onboarding</li>
            <li>Confirma la hora y lugar de tu primer día de trabajo</li>
          </ul>
        </q-card-section>
      </q-card>

    </div>
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

const getInitials = (name) => {
  if (!name) return '?';
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
}
</script>

<style lang="scss" scoped>
.q-page {
  background-color: #f5f7fa !important;
}
.q-card {
  border-radius: 12px;
}

ul {
  list-style: disc;
}

li {
  padding-left: 8px;
  margin-bottom: 8px;
}
</style>
