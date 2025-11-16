<template>
  <q-page
    class="window-height window-width row justify-center items-center"
    style="background: linear-gradient(#F8F9F9, #EAECEE);"
  >
    <div class="column">
      <q-card square bordered class="q-pa-md shadow-1" style="width: 420px;">
        <!-- Contenido del Login -->
        <q-card-section>
          <div class="column items-center q-gutter-y-md q-mb-md">
             <q-avatar size="80px" font-size="48px" color="primary" text-color="white" icon="o_chat" />
            <div class="text-h5 text-weight-bold">BIENVENIDO AL ONBOARDING</div>
            <p class="text-subtitle1 text-grey-8 text-center">Ingresa con tu correo corporativo para continuar</p>
          </div>
        </q-card-section>

        <q-card-section>
          <q-form class="q-gutter-md">
            <q-input v-model="email" type="email" label="Correo Electrónico *" outlined clearable>
              <template v-slot:prepend><q-icon name="o_email" /></template>
            </q-input>
            <q-input v-model="password" type="password" label="Contraseña *" outlined clearable>
              <template v-slot:prepend><q-icon name="o_lock" /></template>
            </q-input>
          </q-form>
        </q-card-section>

        <q-card-section>
          <div class="row justify-between items-center q-mb-md">
            <q-checkbox v-model="rememberMe" label="Recordar sesión" size="sm" />
            <q-btn flat no-caps dense color="primary" label="¿Olvidaste tu contraseña?" class="text-weight-regular" @click="openForgotPasswordDialog" />
          </div>
          <q-btn color="dark" rounded size="lg" class="full-width" label="Iniciar Sesión" @click="login" />
        </q-card-section>

        <!-- Acceso Rápido para Pruebas -->
        <q-separator inset class="q-my-sm" />
        <q-card-section>
           <div class="column items-center q-gutter-y-md">
              <div class="text-grey-8">Acceso rápido para pruebas</div>
              <q-btn-toggle v-model="testUserTab" no-caps rounded unelevated toggle-color="primary" color="white" text-color="primary" :options="testUserOptions" />
              <q-card flat bordered class="full-width">
                 <q-card-section>
                  <div v-if="testUserTab === 'usuario'">
                     <div class="row items-center no-wrap"><q-icon name="o_person" color="primary" class="q-mr-sm" /><div class="text-weight-bold">Nuevo Especialista</div></div>
                    <div class="text-caption q-ml-lg">Email: nuevo.especialista@tcs.com</div>
                    <div class="text-caption q-ml-lg">Contraseña: Password123</div>
                  </div>
                  <div v-if="testUserTab === 'admin'">
                     <div class="row items-center no-wrap"><q-icon name="o_admin_panel_settings" color="purple" class="q-mr-sm" /><div class="text-weight-bold">Administrador RRHH</div></div>
                    <div class="text-caption q-ml-lg">Email: admin@tcs.com</div>
                    <div class="text-caption q-ml-lg">Contraseña: Admin123</div>
                     <ul class="q-mt-sm q-pl-md text-caption text-grey-8" style="list-style-type: '✓ '"><li>Panel Admin incluye:</li><li>Dashboard de progreso</li><li>Gestión de documentos</li><li>Gestión de calendario</li></ul>
                  </div>
                   <q-btn outline rounded color="primary" class="full-width q-mt-sm" label="Autocompletar" @click="autofill" />
                </q-card-section>
              </q-card>
          </div>
        </q-card-section>
      </q-card>
    </div>

    <!-- Diálogo de Recuperar Contraseña -->
    <q-dialog v-model="showForgotPasswordDialog" persistent @hide="resetForgotPasswordDialog">
      <q-card square class="shadow-1" style="width: 400px; border-radius: 12px;">
        <!-- Vista 1: Formulario -->
        <div v-if="forgotPasswordStep === 'form'" class="q-pa-xl column items-center">
          <q-avatar size="70px" font-size="40px" color="deep-purple-2" text-color="primary" icon="o_lock_open" class="q-mb-md"/>
          <div class="text-h6 text-weight-bold">Recuperar Contraseña</div>
          <p class="text-grey-7 text-center q-mb-lg">Ingresa tu correo para recibir instrucciones de recuperación</p>
          <q-input v-model="recoveryEmail" label="Correo Electrónico" outlined class="full-width" :error="!!emailError" :error-message="emailError">
            <template v-slot:prepend><q-icon name="o_email" /></template>
          </q-input>
          <q-btn color="dark" unelevated size="lg" class="full-width q-mt-md" label="Enviar enlace de recuperación" @click="sendRecoveryLink" />
          <q-btn flat color="primary" label="Cancelar" class="q-mt-sm" @click="showForgotPasswordDialog = false" />
        </div>

        <!-- Vista 2: Éxito -->
        <div v-if="forgotPasswordStep === 'success'" class="q-pa-xl column items-center">
          <q-avatar size="70px" font-size="40px" color="green-1" text-color="positive" icon="o_check_circle" class="q-mb-md"/>
          <div class="text-h6 text-weight-bold">Enlace Enviado</div>
          <q-banner dense class="bg-green-1 text-positive q-my-md full-width" rounded><q-icon name="o_email" class="q-mr-sm"/>Se ha enviado un enlace de recuperación a tu correo.</q-banner>
          <q-card flat bordered class="full-width">
            <q-card-section>
              <div class="text-weight-bold">Próximos pasos:</div>
              <ol class="q-pl-md q-gutter-y-sm text-grey-8">
                <li>Revisa tu bandeja de entrada</li>
                <li>Haz clic en el enlace de recuperación (válido 15 min)</li>
                <li>Define una nueva contraseña (mínimo 8 caracteres)</li>
                <li>Confirma la nueva contraseña</li>
              </ol>
            </q-card-section>
          </q-card>
          <q-btn unelevated color="dark" label="Volver al inicio de sesión" class="full-width q-mt-md" @click="showForgotPasswordDialog = false" />
        </div>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

defineOptions({ name: 'LoginPage' });

const router = useRouter();

// Estado del Login
const email = ref('');
const password = ref('');
const rememberMe = ref(false);
const testUserTab = ref('usuario');

// Lógica para el acceso rápido de pruebas
const testUserOptions = [{label: 'Usuario', value: 'usuario', icon: 'o_person'},{label: 'Admin', value: 'admin', icon: 'o_admin_panel_settings'}];
const testUsers = {
  usuario: { email: 'nuevo.especialista@tcs.com', password: 'Password123' },
  admin: { email: 'admin@tcs.com', password: 'Admin123' }
};
function autofill() {
  const user = testUsers[testUserTab.value];
  if (user) { email.value = user.email; password.value = user.password; }
}

// Lógica de Login
function login() {
  if (email.value === 'admin@tcs.com') router.push('/admin');
  else router.push('/dashboard');
}

// Lógica para Recuperar Contraseña
const showForgotPasswordDialog = ref(false);
const forgotPasswordStep = ref('form'); // 'form' o 'success'
const recoveryEmail = ref('');
const emailError = ref('');

function openForgotPasswordDialog() {
  showForgotPasswordDialog.value = true;
}

function resetForgotPasswordDialog() {
  forgotPasswordStep.value = 'form';
  recoveryEmail.value = '';
  emailError.value = '';
}

function sendRecoveryLink() {
  if (!recoveryEmail.value.endsWith('@tcs.com')) {
    emailError.value = 'Debes usar un correo corporativo';
  } else {
    emailError.value = '';
    forgotPasswordStep.value = 'success'; // Cambiar a la vista de éxito
  }
}

</script>

<style lang="scss" scoped>
.q-card { border-radius: 12px; }
.q-btn-toggle { border: 1px solid $primary; }
</style>
