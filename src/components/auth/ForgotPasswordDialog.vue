<template>
  <q-dialog v-model="isOpen" persistent @hide="resetDialog">
    <q-card square class="shadow-1" style="width: 400px; border-radius: 12px;">
      <!-- Paso 1: Formulario -->
      <div v-if="step === 'form'" class="q-pa-xl column items-center">
        <q-avatar
          size="70px"
          font-size="40px"
          color="deep-purple-2"
          text-color="primary"
          icon="o_lock_open"
          class="q-mb-md"
        />
        <div class="text-h6 text-weight-bold">Recuperar Contraseña</div>
        <p class="text-grey-7 text-center q-mb-lg">
          Ingresa tu correo para recibir instrucciones de recuperación
        </p>

        <q-input
          v-model="email"
          label="Correo Electrónico"
          outlined
          class="full-width"
          :error="!!emailError"
          :error-message="emailError"
        >
          <template v-slot:prepend>
            <q-icon name="o_email" />
          </template>
        </q-input>

        <q-btn
          color="dark"
          unelevated
          size="lg"
          class="full-width q-mt-md"
          label="Enviar enlace de recuperación"
          @click="sendRecovery"
          :loading="loading"
        />
        <q-btn
          flat
          color="primary"
          label="Cancelar"
          class="q-mt-sm"
          @click="closeDialog"
        />
      </div>

      <!-- Paso 2: Éxito -->
      <div v-if="step === 'success'" class="q-pa-xl column items-center">
        <q-avatar
          size="70px"
          font-size="40px"
          color="green-1"
          text-color="positive"
          icon="o_check_circle"
          class="q-mb-md"
        />
        <div class="text-h6 text-weight-bold">Enlace Enviado</div>

        <q-banner
          dense
          class="bg-green-1 text-positive q-my-md full-width"
          rounded
        >
          <template v-slot:avatar>
            <q-icon name="o_email" />
          </template>
          Se ha enviado un enlace de recuperación a tu correo.
        </q-banner>

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

        <q-btn
          unelevated
          color="dark"
          label="Volver al inicio de sesión"
          class="full-width q-mt-md"
          @click="closeDialog"
        />
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'send'])

const isOpen = ref(props.modelValue)
const step = ref('form')
const email = ref('')
const emailError = ref('')
const loading = ref(false)

const closeDialog = () => {
  emit('update:modelValue', false)
}

const resetDialog = () => {
  step.value = 'form'
  email.value = ''
  emailError.value = ''
}

const sendRecovery = async () => {
  emailError.value = ''

  if (!email.value) {
    emailError.value = 'El email es requerido'
    return
  }

  if (!email.value.endsWith('@tcs.com')) {
    emailError.value = 'Debes usar un correo corporativo (@tcs.com)'
    return
  }

  loading.value = true
  try {
    // Emitir evento para que el padre maneje la lógica
    emit('send', { email: email.value })
    step.value = 'success'
  } catch (err) {
    emailError.value = err.message || 'Error al enviar el enlace'
  } finally {
    loading.value = false
  }
}

// Watchers para sincronizar con el padre
const updateIsOpen = (newVal) => {
  isOpen.value = newVal
}

defineExpose({
  updateIsOpen
})
</script>
