<script setup>
import { ref, nextTick, watch, toRaw } from 'vue'
import Button from '@/components/Button.vue'
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal.vue'
import ListTask from '@/components/ListTask.vue'
import IconX from '@/components/icons/IconX.vue'

const props = defineProps({
  list: Object,
  listIndex: Number,
  tableIndex: Number
})

const table = defineModel('table')
const inputVisible = ref(false)
const taskName = ref('')
const list = ref(props.list)
const input = ref(null)
const showDeleteButton = ref(false)

const addTask = () => {
  const storage = JSON.parse(localStorage.getItem('tables'))
  if (taskName.value.trim().length == 0) {
    hideInput()
    return
  }

  const newTask = {
    name: taskName.value,
    created_on: new Date(),
    due_on: null
  }

  list.value.tasks.push(newTask)
  table.value.lists[props.listIndex] = list.value
  storage[props.tableIndex] = table.value

  localStorage.setItem('tables', JSON.stringify(storage))
  hideInput()
}

const showInput = () => {
  inputVisible.value = true
  nextTick(() => input.value.focus())
}

const hideInput = () => {
  taskName.value = ''
  inputVisible.value = false
}

const getStorage = () => {
  return JSON.parse(localStorage.getItem('tables'))
}

const updateTask = (taskIndex, taskName, taskDueDate) => {
  const storage = getStorage()
  storage[props.tableIndex].lists[props.listIndex].tasks[taskIndex].name = taskName
  storage[props.tableIndex].lists[props.listIndex].tasks[taskIndex].due_on = taskDueDate

  localStorage.setItem('tables', JSON.stringify(storage))
}

const deleteTask = (taskIndex) => {
  const storage = getStorage()

  table.value.lists[props.listIndex].tasks.splice(taskIndex, 1)
  storage[props.tableIndex] = table.value
  localStorage.setItem('tables', JSON.stringify(storage))
}

const moveTask = (taskIndex, oldIndex, newIndex) => {
  let storage = getStorage()
  const task = toRaw(table.value.lists[props.listIndex].tasks[taskIndex])

  storage[props.tableIndex].lists[oldIndex].tasks.splice(taskIndex, 1)
  storage[props.tableIndex].lists[newIndex].tasks.push(task)

  localStorage.setItem('tables', JSON.stringify(storage))
  storage = getStorage()
  table.value = storage[props.tableIndex]
}

watch(table, (newValue) => {
  table.value = newValue
  list.value = newValue.lists[props.listIndex]
})

defineEmits(['deleteList'])
</script>

<template>
  <div>
    <div
      class="flex h-fit max-h-full min-w-96 max-w-fit flex-col rounded-lg border-2 border-white/20 text-white backdrop-blur-md"
      @mouseenter="showDeleteButton = true"
      @mouseleave="showDeleteButton = false"
    >
      <div class="flex w-full justify-between p-2">
        <h3 class="w-96 break-all text-xl font-bold">{{ list.name }}</h3>
        <ConfirmDeleteModal
          :visible="showDeleteButton"
          :name="`list ${list.name}`"
          @confirm-deletion="$emit('deleteList')"
        />
      </div>
      <div class="overflow-y-auto">
        <ListTask
          v-for="(task, index) in list.tasks"
          :key="task.created_on"
          :class="{ 'mb-2': index != list.tasks.length - 1 }"
          :table="table"
          :list="list"
          :task="task"
          @save-changes="(name, date) => updateTask(index, name, date)"
          @delete-task="deleteTask(index)"
          @move-task="(oldIndex, newIndex) => moveTask(index, oldIndex, newIndex)"
        />
      </div>
      <form
        @submit.prevent
        class="m-2 flex flex-row items-center justify-between"
        :class="{ 'justify-around gap-2': inputVisible }"
      >
        <input
          v-model="taskName"
          type="text"
          class="h-8 grow rounded-md bg-white/30 p-2 text-white placeholder:text-zinc-200"
          :class="{ hidden: !inputVisible, block: inputVisible }"
          placeholder="Task name.."
          ref="input"
        />
        <div class="flex flex-row items-center gap-2">
          <Button class="min-w-fit" @click="!inputVisible ? showInput() : addTask()"
            >Add task</Button
          >
          <IconX
            class="min-w-fit rounded-md hover:cursor-pointer hover:bg-white/20"
            :class="{ hidden: !inputVisible, block: inputVisible }"
            @click="hideInput()"
          />
        </div>
      </form>
    </div>
  </div>
</template>
