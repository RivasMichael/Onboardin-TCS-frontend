<template>
  <q-page
    class="window-height window-width row justify-center items-center"
    style="background: linear-gradient(#F8F9F9, #EAECEE);"
  >
    <div class="column">
      <q-card square bordered class="q-pa-md shadow-1" style="width: 420px;">
        <!-- Header -->
        <q-card-section>
          <div class="column items-center q-gutter-y-md q-mb-md">
            <q-img src="/images/LOGITO.png" style="width: 280px;" />
            <p class="text-subtitle1 text-grey-8 text-center">Ingresa con tu correo corporativo para continuar</p>
          </div>
        </q-card-section>

        <!-- Formulario de Login -->
        <q-card-section>
          <LoginForm
            :loading="loading"
            @submit="handleLogin"
            @forgot-password="showForgotPasswordDialog = true"
          />
        </q-card-section>
      </q-card>
    </div>

    <!-- Diálogo de Recuperar Contraseña -->
    <ForgotPasswordDialog
      v-model="showForgotPasswordDialog"
      @send="handleForgotPasswordSend"
    />
  </q-page>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useAuthStore } from 'src/stores/auth';
import LoginForm from 'src/components/auth/LoginForm.vue';
import ForgotPasswordDialog from 'src/components/auth/ForgotPasswordDialog.vue';

defineOptions({ name: 'LoginPage' });

const router = useRouter();
const $q = useQuasar();
const auth = useAuthStore();

const loading = ref(false);
const showForgotPasswordDialog = ref(false);

// Lógica de Login
async function handleLogin(credentials) {
  loading.value = true
  try {
    // Llamar al backend con las credenciales
    const resp = await auth.login(credentials)

    // El backend devuelve usuario.rol: "admin" o "usuario"
    const rol = resp.usuario?.rol?.toLowerCase() || ''

    $q.notify({
      type: 'positive',
      message: `Bienvenido ${resp.usuario?.nombre || 'Usuario'}`
    })

    // Redirigir según el rol
    if (rol === 'admin') {
      router.push('/admin')
    } else {
      router.push('/dashboard')
    }
  } catch (err) {
    console.error('Login error', err)

    // Manejo de errores del backend
    const msg = err.response?.data?.message || err.message || 'Error al iniciar sesión'
    $q.notify({
      type: 'negative',
      message: msg
    })
  } finally {
    loading.value = false
  }
}

// Manejar envío de recuperación de contraseña
function handleForgotPasswordSend(payload) {
  console.log('Enviando enlace de recuperación a:', payload.email)
  // Aquí iría la lógica para llamar al backend
}

</script>

<style lang="scss" scoped>
.q-card { border-radius: 12px; }
.q-btn-toggle { border: 1px solid $primary; }
</style>
