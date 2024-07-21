<script setup>
import { ref } from 'vue'
import Button from '@/components/Button.vue'
import Modal from '@/components/Modal.vue'
import IconPlus from '@/components/icons/IconPlus.vue'
const props = defineProps({
  tables: Array
})

const modal = ref(null)
const showError = ref(false)
const errorText = ref('')
const badCharInName = ref(false)

const backgrounds = [
  { id: 'bgColorBlue', value: '#2a32e0' },
  { id: 'bgColorPurple', value: '#7e22ce' },
  { id: 'bgColorSlateBlue', value: '#5471a9' },
  { id: 'bgColorGreen', value: '#16a34a' },
  { id: 'bgColorOrange', value: '#c2410c' },
  { id: 'bgColorRed', value: '#b91c1c' },
  { id: 'bgColorZinc', value: '#18181b' },
  { id: 'bgColorSlate', value: '#0f172a' }
]

const clearError = () => {
  showError.value = false
  errorText.value = ''
}

const setError = (text) => {
  showError.value = true
  errorText.value = text
}

const checkForBadChar = (tableName) => {
  badCharInName.value =
    tableName.endsWith(' ') ||
    tableName.startsWith(' ') ||
    tableName.includes('?') ||
    tableName.includes('/') ||
    tableName.endsWith(' ') ||
    tableName.startsWith(' ')
}

const addTable = () => {
  const tableName = document.getElementById('table-name').value
  const colors = document.getElementsByName('bgColor')
  const nameTaken = ref(false)
  let tableBg = ''
  let tables = props.tables

  colors.forEach((color) => {
    color.checked && (tableBg = color.value)
  })

  const newTable = {
    name: tableName,
    background: tableBg,
    lists: []
  }

  checkForBadChar(tableName)
  badCharInName.value &&
    setError("Table name can't have '?' or '/' characters, and can't start or end with a space")

  !badCharInName.value &&
    (tableName === ''
      ? setError("Table name can't be empty")
      : (tables.forEach((table) => {
          table.name == newTable.name && (nameTaken.value = true)
        }),
        nameTaken.value
          ? setError('This name is already taken')
          : (tables.push(newTable), modal.value.closeModal(), clearError())))

  localStorage.setItem('tables', JSON.stringify(tables))
}
</script>

<template>
  <Modal :title="'New table'" ref="modal" @close-modal="clearError()" :custom-button="true">
    <template v-slot:customButton>
      <div
        class="mb-2 flex min-h-32 items-start rounded-lg border-2 border-white/20 p-4 text-white backdrop-blur-md transition-all duration-200 hover:cursor-pointer hover:border-white/70 hover:bg-white/30"
      >
        <text class="flex items-center gap-1 text-lg font-semibold">
          <IconPlus class="size-5" />Add table
        </text>
      </div>
    </template>
    <template v-slot:inputs>
      <form @submit.prevent="addTable()">
        <div class="flex w-full flex-col">
          <label for="table-name">Name:</label>
          <input
            type="text"
            active="false"
            class="mt-1 rounded-md bg-white/30 p-2 text-white"
            :class="{ 'border-2 border-red-500/80': showError == true }"
            id="table-name"
            required
          />
          <text
            class="mt-1 hidden text-sm font-semibold text-red-500"
            :class="{ '!block': showError == true }"
            >{{ errorText }}</text
          >
        </div>
        <div class="mt-4">
          <label>Background Color:</label>
          <div class="mt-1 flex flex-wrap gap-2">
            <div v-for="background in backgrounds" :key="background.id">
              <input
                type="radio"
                :id="background.id"
                name="bgColor"
                :value="background.value"
                :checked="background.id == 'bgColorBlue'"
              />
              <label
                class="inline-block h-12 w-16 cursor-pointer rounded-md"
                :style="{
                  'background-color': `${background.value}`
                }"
                :for="background.id"
              ></label>
            </div>
          </div>
        </div>
      </form>
    </template>
    <template v-slot:confirmButton>
      <Button as="submit" @click.prevent="addTable()" class="mt-4">Create</Button>
    </template>
  </Modal>
</template>
