<template>
  <q-dialog v-model="dialogVisible">
    <q-card>
      <q-card-section>
        <div class="text-h6">Perfil de Usuario</div>
        <q-spinner v-if="loading" color="primary" size="2em" class="q-mb-md" />
        <template v-else>
          <div><b>Nombre:</b> {{ perfil.nombre }}</div>
          <div><b>Correo:</b> {{ perfil.correo }}</div>
          <div><b>Cargo:</b> {{ perfil.cargo }}</div>
          <div><b>Departamento:</b> {{ perfil.departamento }}</div>
          <div><b>Código Empleado:</b> {{ perfil.codigoEmpleado }}</div>
          <div><b>Fecha Inicio:</b> {{ perfil.fechaInicioTexto }}</div>
          <div><b>Estado:</b> {{ perfil.estado }}</div>
          <div><b>Oficina:</b> {{ perfil.oficina }}</div>
          <div><b>Rol:</b> {{ perfil.rol }}</div>
          <div v-if="perfil.supervisor"><b>Supervisor:</b> {{ perfil.supervisor }}</div>
        </template>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Cerrar" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import axios from 'src/boot/axios'

const props = defineProps({
  modelValue: Boolean
})
const emit = defineEmits(['update:modelValue'])

const perfil = ref({})
const loading = ref(false)

const dialogVisible = computed({
  get() { return props.modelValue },
  set(val) { emit('update:modelValue', val) }
})

watch(() => props.modelValue, (val) => {
  if (val) {
    loading.value = true
    axios.get('/api/perfil/mi-perfil')
      .then(res => { perfil.value = res.data })
      .catch(() => { perfil.value = {} })
      .finally(() => { loading.value = false })
  }
})
</script>
