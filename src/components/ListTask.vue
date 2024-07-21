<script setup>
import { ref, onMounted } from 'vue'
import Button from '@/components/Button.vue'
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal.vue'
import Modal from '@/components/Modal.vue'
import IconPen from '@/components/icons/IconPen.vue'

const props = defineProps({
  table: Object,
  list: Object,
  task: Object
})

const task = ref(props.task)
const newName = ref(task.value.name)
const nameInput = ref(null)
const dueDate = ref(task.value.due_on != null ? task.value.due_on.slice(0, 10) : '')
const dueDaysLeft = ref('')
const listIndex = ref(props.table.lists.indexOf(props.list))
const newListIndex = ref(props.table.lists.indexOf(props.list))
const showEdit = ref(false)
const showError = ref(false)
const errorText = ref('')
const modal = ref(null)

const saveChanges = () => {
  if (newName.value.trim().length == 0) {
    showError.value = true
    errorText.value = "Task name can't be empty"
    return
  }

  const date = new Date(dueDate.value)
  task.value.name = newName.value
  date == 'Invalid Date' && (task.value.due_on = null)

  !isNaN(date) && (task.value.due_on = dueDate.value)
  !isNaN(date) ? emit('saveChanges', newName.value, date) : emit('saveChanges', newName.value)

  listIndex.value != newListIndex.value && emit('moveTask', listIndex.value, newListIndex.value)

  showEdit.value = false
  modal.value.closeModal()
  showError.value = false
  daysToDueDate()
}

const formatDate = (date) => {
  const formattedDate = new Date(date)
  return (
    formattedDate.getDate() +
    '/' +
    (formattedDate.getMonth() < 10
      ? '0' + (formattedDate.getMonth() + 1)
      : formattedDate.getMonth() + 1) +
    '/' +
    formattedDate.getFullYear()
  )
}

const openModal = () => {
  modal.value.openModal()
}

const resetInputs = () => {
  newName.value = task.value.name
  dueDate.value = task.value.due_on != null ? task.value.due_on.toString().slice(0, 10) : ''
  newListIndex.value = props.table.lists.indexOf(props.list)
  showError.value = false
}

const daysToDueDate = () => {
  const today = new Date()
  const taskDue = new Date(dueDate.value)
  const differenceInTime = today.getTime() - taskDue.getTime()
  const differenceInDays = Math.round(differenceInTime / (1000 * 3600 * 24))

  dueDate.value != '' && (dueDaysLeft.value = differenceInDays)
}

onMounted(() => daysToDueDate())

const emit = defineEmits(['saveChanges', 'deleteTask', 'moveTask'])
</script>

<template>
  <div
    @click="openModal()"
    class="relative mx-2 shadow-lg"
    @mouseenter="showEdit = true"
    @mouseleave="showEdit = false"
  >
    <div
      class="overflow-hidden rounded-md border-2 border-white/40 p-2 hover:cursor-pointer hover:border-white/70"
    >
      <div class="flex flex-col gap-2">
        <div class="flex items-center justify-between">
          <div class="text-md w-full break-all font-semibold">
            <div class="flex w-full flex-row items-center justify-between">
              <p>{{ task.name }}</p>
              <Modal
                ref="modal"
                :custom-button="true"
                :title="`Edit task ${task.name}`"
                @close-modal="resetInputs()"
              >
                <template v-slot:customButton>
                  <IconPen
                    class="size-7 min-h-7 min-w-7 self-start rounded-md p-1 transition-all duration-200 ease-in-out hover:cursor-pointer hover:bg-white/20 hover:opacity-100 md:opacity-0"
                    :class="{
                      'md:opacity-100': showEdit
                    }"
                  />
                </template>
                <template v-slot:inputs>
                  <form @submit.prevent="saveChanges()" class="mr-2 flex w-full flex-col gap-2">
                    <label for="name">Name:</label>
                    <input
                      ref="nameInput"
                      v-model="newName"
                      class="rounded-md bg-white/30 p-2 text-white"
                      :class="{ 'border-2 border-red-500/80': showError }"
                      id="name"
                    />
                    <text
                      class="hidden text-sm font-semibold text-red-500"
                      :class="{ '!block': showError == true }"
                      >{{ errorText }}</text
                    >
                    <label for="date">Due date:</label>
                    <input
                      v-model="dueDate"
                      class="w-full rounded-md bg-white/30 p-2 text-white hover:cursor-pointer"
                      type="date"
                      id="date"
                    />
                    <label for="move">List:</label>
                    <select
                      id="move"
                      class="rounded-md bg-white/30 p-2 text-white hover:cursor-pointer"
                      v-model="newListIndex"
                    >
                      <option
                        v-for="(list, index) in props.table.lists"
                        :value="index"
                        :key="list.name"
                        class="text-dark"
                        :selected="newListIndex === index"
                      >
                        {{ list.name }}
                      </option>
                    </select>
                  </form>
                </template>
                <template v-slot:confirmButton>
                  <div class="mt-8 flex w-full flex-col gap-1">
                    <Button @click.prevent="saveChanges()"> Save </Button>
                    <div>
                      <ConfirmDeleteModal
                        :visible="true"
                        :normal-button="true"
                        :name="`task ${task.name}`"
                        @confirm-deletion="$emit('deleteTask')"
                      />
                    </div>
                  </div>
                </template>
              </Modal>
            </div>
            <p class="text-sm">
              <text class="text-zinc-300">Created on: </text>{{ formatDate(task.created_on) }}
            </p>
            <p class="text-sm" v-if="task.due_on">
              <text class="text-zinc-300">Due on: </text>
              <text
                :class="{
                  'rounded-md bg-amber-500/90 px-1': dueDaysLeft == 1,
                  'rounded-md bg-red-500/90 px-1': dueDaysLeft > 1
                }"
                >{{ formatDate(task.due_on) }}</text
              >
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
