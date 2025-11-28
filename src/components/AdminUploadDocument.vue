<template>
  <q-card class="q-pa-lg" style="max-width: 500px; margin: auto;">
    <q-form @submit.prevent="handleSubmit">
      <div class="text-h6 q-mb-md">Subir PDF con descripción</div>
      <q-input filled v-model="titulo" label="Título" :rules="[val => !!val || 'Requerido']" class="q-mb-md" />
      <q-input filled v-model="descripcion" label="Descripción" type="textarea" :rules="[val => !!val || 'Requerido']" class="q-mb-md" />
      <q-select
        filled
        v-model="categoria"
        label="Categoría"
        :options="categoriaOptions"
        :rules="[val => !!val || 'Requerido']"
        class="q-mb-md"
        emit-value
        map-options
      />
      <q-toggle v-model="visibleTodos" label="Visible para todos" class="q-mb-md" />
      <q-toggle v-model="obligatorio" label="Obligatorio" class="q-mb-md" />
      <q-file filled v-model="file" label="Seleccionar PDF" accept="application/pdf" :rules="[val => !!val || 'Archivo requerido']" class="q-mb-md" />
      <div class="row q-gutter-sm q-mt-md">
        <q-btn label="Subir" color="primary" type="submit" :loading="loading" />
        <q-btn label="Limpiar" color="secondary" flat @click="resetForm" />
      </div>
    </q-form>
  </q-card>
</template>

<script setup>
import { ref, defineEmits } from 'vue'
const emit = defineEmits(['close', 'uploaded'])
import { useQuasar } from 'quasar'
import { api } from 'src/boot/axios'

const $q = useQuasar()
const titulo = ref('')
const descripcion = ref('')
const categoria = ref('')
const categoriaOptions = [
  'Onboarding',
  'Seguridad',
  'Herramientas',
  'Recursos Humanos',
  'Políticas'
]
const visibleTodos = ref(true)
const obligatorio = ref(true)
const file = ref(null)
const loading = ref(false)

function resetForm() {
  titulo.value = ''
  descripcion.value = ''
  categoria.value = ''
  visibleTodos.value = true
  obligatorio.value = true
  file.value = null
}

async function handleSubmit() {
  if (!file.value) {
    $q.notify({ type: 'negative', message: 'Selecciona un archivo PDF.' })
    return
  }
  loading.value = true
  try {
    const formData = new FormData()
    formData.append('file', file.value)
    formData.append('Titulo', titulo.value)
    formData.append('Descripcion', descripcion.value)
    formData.append('Categoria', categoria.value)
    formData.append('VisibleTodos', visibleTodos.value ? 'true' : 'false')
    formData.append('Obligatorio', obligatorio.value ? 'true' : 'false')

    await api.post('/documentos/upload-complete', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    $q.notify({ type: 'positive', message: 'Documento subido correctamente.' })
    resetForm()
    emit('uploaded')
  } catch (err) {
    $q.notify({ type: 'negative', message: 'Error al subir el documento.' })
    console.error(err)
  } finally {
    loading.value = false
  }
}
</script>
