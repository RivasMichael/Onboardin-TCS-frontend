<template>
  <div class="test-user-selector">
    <q-separator inset class="q-my-sm" />

    <q-card-section>
      <div class="column items-center q-gutter-y-md">
        <div class="text-grey-8 text-weight-bold">Acceso rápido para pruebas</div>

        <q-btn-toggle
          v-model="selectedUser"
          no-caps
          rounded
          unelevated
          toggle-color="primary"
          color="white"
          text-color="primary"
          :options="userOptions"
        />

        <q-card flat bordered class="full-width">
          <q-card-section>
            <div v-if="selectedUser === 'usuario'">
              <div class="row items-center no-wrap">
                <q-icon name="o_person" color="primary" class="q-mr-sm" />
                <div class="text-weight-bold">Nuevo Especialista</div>
              </div>
              <div class="text-caption q-ml-lg">Email: nuevo.especialista@tcs.com</div>
              <div class="text-caption q-ml-lg">Contraseña: Password123</div>
            </div>

            <div v-if="selectedUser === 'admin'">
              <div class="row items-center no-wrap">
                <q-icon name="o_admin_panel_settings" color="purple" class="q-mr-sm" />
                <div class="text-weight-bold">Administrador RRHH</div>
              </div>
              <div class="text-caption q-ml-lg">Email: admin@tcs.com</div>
              <div class="text-caption q-ml-lg">Contraseña: Admin123</div>
              <ul class="q-mt-sm q-pl-md text-caption text-grey-8" style="list-style-type: '✓ '">
                <li>Panel Admin incluye:</li>
                <li>Dashboard de progreso</li>
                <li>Gestión de documentos</li>
                <li>Gestión de calendario</li>
              </ul>
            </div>

            <q-btn
              outline
              rounded
              color="primary"
              class="full-width q-mt-sm"
              label="Autocompletar"
              @click="autofill"
            />
          </q-card-section>
        </q-card>
      </div>
    </q-card-section>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['autofill'])

const selectedUser = ref('usuario')

const userOptions = [
  { label: 'Usuario', value: 'usuario', icon: 'o_person' },
  { label: 'Admin', value: 'admin', icon: 'o_admin_panel_settings' }
]

const testUsers = {
  usuario: { email: 'nuevo.especialista@tcs.com', password: 'Password123' },
  admin: { email: 'admin@tcs.com', password: 'Admin123' }
}

const autofill = () => {
  const user = testUsers[selectedUser.value]
  if (user) {
    emit('autofill', user)
  }
}
</script>
