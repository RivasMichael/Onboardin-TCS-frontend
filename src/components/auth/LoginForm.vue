<template>
  <div class="login-form">
    <q-form @submit="onSubmit" class="q-gutter-md">
      <!-- Email Input -->
      <q-input
        v-model="formData.email"
        type="email"
        label="Correo Electrónico *"
        outlined
        clearable
        :rules="[val => val && val.length > 0 || 'El email es requerido', val => isValidEmail(val) || 'Email inválido']"
      >
        <template v-slot:prepend>
          <q-icon name="o_email" />
        </template>
      </q-input>

      <!-- Password Input -->
      <q-input
        v-model="formData.password"
        :type="showPassword ? 'text' : 'password'"
        label="Contraseña *"
        outlined
        :rules="[val => val && val.length > 0 || 'La contraseña es requerida']"
      >
        <template v-slot:prepend>
          <q-icon name="o_lock" />
        </template>
        <template v-slot:append>
          <q-icon
            :name="showPassword ? 'o_visibility' : 'o_visibility_off'"
            class="cursor-pointer"
            @click="showPassword = !showPassword"
          />
        </template>
      </q-input>

      <!-- Remember Me -->
      <q-checkbox
        v-model="formData.rememberMe"
        label="Recordar sesión"
        size="sm"
      />

      <!-- Submit Button -->
      <q-btn
        :loading="loading"
        color="dark"
        rounded
        size="lg"
        class="full-width"
        label="Iniciar Sesión"
        type="submit"
      />
    </q-form>

    <!-- Forgot Password Link -->
    <div class="text-center q-mt-md">
      <q-btn
        flat
        no-caps
        dense
        color="primary"
        label="¿Olvidaste tu contraseña?"
        @click="$emit('forgot-password')"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['submit', 'forgot-password'])

const formData = ref({
  email: '',
  password: '',
  rememberMe: false
})

const showPassword = ref(false)

const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

const onSubmit = () => {
  emit('submit', {
    correo: formData.value.email,
    contrasena: formData.value.password,
    rememberMe: formData.value.rememberMe
  })
}
</script>

<style scoped>
.login-form {
  min-width: 350px;
}
</style>
