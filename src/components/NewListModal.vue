<script setup>
import { ref } from 'vue'
import Button from '@/components/Button.vue'
import Modal from '@/components/Modal.vue'
import IconPlus from '@/components/icons/IconPlus.vue'

const props = defineProps({
  table: Object
})

const modal = ref(null)
const showError = ref(false)
const errorText = ref('')
const badCharInName = ref(false)

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
    tableName.endsWith(' ') ||
    tableName.startsWith(' ')
}

const addList = () => {
  const tables = JSON.parse(localStorage.getItem('tables'))
  const listName = document.getElementById('list-name').value
  const nameTaken = ref(false)
  const table = ref('')

  tables.forEach((tab) => {
    tab.name == props.table.name && (table.value = tab)
  })

  const newList = {
    name: listName,
    tasks: []
  }

  props.table.lists.forEach((list) => {
    list.name == listName && (nameTaken.value = true)
  })

  checkForBadChar(listName)
  badCharInName.value && setError("List name can't start or end with space")

  !badCharInName.value &&
    (listName === ''
      ? setError("List name can't be empty")
      : nameTaken.value
        ? setError('This name is already taken')
        : (table.value.lists.push(newList),
          tables.forEach((tab) => {
            tab.name == table.value.name && (tab = table)
          }),
          clearError(),
          modal.value.closeModal()))

  localStorage.setItem('tables', JSON.stringify(tables))
}

defineEmits(['newList'])
</script>

<template>
  <Modal :title="'New list'" ref="modal" @close-modal="clearError()" :custom-button="true">
    <template v-slot:customButton>
      <div
        class="flex h-fit max-h-full min-w-72 max-w-96 rounded-lg border-2 border-white/20 p-2 text-white backdrop-blur-md transition-all duration-200 hover:cursor-pointer hover:border-white/70 hover:bg-white/30"
      >
        <text class="flex items-center gap-1 text-lg font-semibold">
          <IconPlus class="size-5" />Add list
        </text>
      </div>
    </template>
    <template v-slot:inputs>
      <form @submit.prevent="addList(), $emit('newList')">
        <div class="flex w-full flex-col">
          <label for="list-name">Name:</label>
          <input
            type="text"
            active="false"
            class="mt-1 rounded-md bg-white/30 p-2 text-white"
            :class="{ 'border-2 border-red-500/80': showError == true }"
            id="list-name"
            required
          />
          <text
            class="mt-1 hidden text-sm font-semibold text-red-500"
            :class="{ '!block': showError == true }"
            >{{ errorText }}</text
          >
        </div>
      </form>
    </template>
    <template v-slot:confirmButton>
      <Button as="submit" @click.prevent="addList(), $emit('newList')" class="mt-4">Create</Button>
    </template>
  </Modal>
</template>
