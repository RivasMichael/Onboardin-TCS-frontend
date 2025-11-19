<template>
  <div class="document-selector">
    <div class="row items-center justify-between q-mb-md">
      <div class="text-h6 text-weight-bold">Documentos disponibles</div>
      <q-btn
        flat
        round
        dense
        :icon="isExpanded ? 'o_expand_less' : 'o_expand_more'"
        @click="isExpanded = !isExpanded"
      />
    </div>

    <q-slide-transition>
      <div v-if="isExpanded" class="q-gutter-md">
        <q-option-group
          v-model="selectedDocuments"
          :options="documents"
          color="primary"
          type="checkbox"
          class="q-gutter-y-sm"
        >
          <template v-slot="scope">
            <q-card flat bordered class="full-width doc-card cursor-pointer" :class="{ 'selected': scope.opt.value === selectedDocuments }">
              <q-card-section class="row items-center">
                <q-icon :name="scope.opt.icon" :color="scope.opt.color" size="md" class="q-mr-md" />
                <div class="col">
                  <div class="text-weight-bold">{{ scope.opt.label }}</div>
                  <div class="text-caption text-grey-7">{{ scope.opt.description }}</div>
                </div>
                <q-checkbox
                  :model-value="isSelected(scope.opt.value)"
                  @update:model-value="toggleDocument(scope.opt.value)"
                />
              </q-card-section>
            </q-card>
          </template>
        </q-option-group>

        <!-- Resumen de documentos seleccionados -->
        <div v-if="selectedDocuments.length > 0" class="q-pa-md bg-blue-1 rounded-borders">
          <div class="text-weight-bold q-mb-sm">Documentos seleccionados ({{ selectedDocuments.length }}):</div>
          <div class="row q-gutter-sm">
            <q-chip
              v-for="docId in selectedDocuments"
              :key="docId"
              removable
              color="primary"
              text-color="white"
              :label="getDocumentLabel(docId)"
              @remove="removeDocument(docId)"
            />
          </div>
        </div>

        <q-btn
          v-if="selectedDocuments.length > 0"
          outline
          rounded
          color="primary"
          label="Limpiar selección"
          class="full-width q-mt-sm"
          @click="selectedDocuments = []"
        />
      </div>
    </q-slide-transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const isExpanded = ref(true)
const selectedDocuments = ref([])

const documents = ref([
  {
    value: 'politicas',
    label: 'Políticas Empresariales',
    description: 'Normativas y políticas generales de TCS',
    icon: 'o_description',
    color: 'blue-6'
  },
  {
    value: 'beneficios',
    label: 'Beneficios y Compensación',
    description: 'Información sobre beneficios, salario y compensaciones',
    icon: 'o_paid',
    color: 'green-6'
  },
  {
    value: 'onboarding',
    label: 'Plan de Onboarding',
    description: 'Tu cronograma y actividades de bienvenida',
    icon: 'o_event',
    color: 'purple-6'
  },
  {
    value: 'codigo_conducta',
    label: 'Código de Conducta',
    description: 'Normas de conducta y ética profesional',
    icon: 'o_balance',
    color: 'orange-6'
  },
  {
    value: 'sistemas',
    label: 'Acceso a Sistemas',
    description: 'Guía de acceso a sistemas internos',
    icon: 'o_computer',
    color: 'indigo-6'
  },
  {
    value: 'organo',
    label: 'Estructura Organizacional',
    description: 'Organigrama y departamentos',
    icon: 'o_account_tree',
    color: 'teal-6'
  }
])

const isSelected = (docId) => selectedDocuments.value.includes(docId)

const toggleDocument = (docId) => {
  const index = selectedDocuments.value.indexOf(docId)
  if (index > -1) {
    selectedDocuments.value.splice(index, 1)
  } else {
    selectedDocuments.value.push(docId)
  }
}

const removeDocument = (docId) => {
  const index = selectedDocuments.value.indexOf(docId)
  if (index > -1) {
    selectedDocuments.value.splice(index, 1)
  }
}

const getDocumentLabel = (docId) => {
  const doc = documents.value.find(d => d.value === docId)
  return doc ? doc.label : docId
}

defineExpose({
  selectedDocuments
})
</script>

<style scoped lang="scss">
.document-selector {
  background: white;
  border-radius: 8px;
  padding: 1rem;
  border: 1px solid $grey-3;
}

.doc-card {
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  &.selected {
    border: 2px solid $primary;
    background-color: $blue-1;
  }
}
</style>
