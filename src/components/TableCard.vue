<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal.vue'

const props = defineProps({
  table: Object,
  deadlines: Object
})

const showOptions = ref(false)
const emit = defineEmits(['deleteTable'])

const deleteTable = () => {
  let storage = JSON.parse(localStorage.getItem('tables'))
  const tableIndex = storage.findIndex((tab) => tab.name == props.table.name)
  storage.splice(tableIndex, 1)
  localStorage.setItem('tables', JSON.stringify(storage))
  emit('deleteTable')
}
</script>

<template>
  <RouterLink
    :to="`/t/${props.table.name}`"
    :style="{
      'background-color': `${props.table.background}`
    }"
    class="h-32 w-full rounded-md border-2 border-white/20 !bg-opacity-25 shadow-lg shadow-dark/60 hover:border-white/70"
    @mouseenter="showOptions = true"
    @mouseleave="showOptions = false"
  >
    <div class="flex h-full w-full flex-row justify-between p-4">
      <div class="font-semibold">
        <text class="truncate break-all text-xl font-semibold" :title="props.table.name">
          {{ props.table.name }}
        </text>
        <p class="text-sm">
          <text class="text-zinc-300">Today's tasks: </text>
          <text>{{ props.deadlines != undefined ? props.deadlines.tasks.due : 0 }}</text>
        </p>
        <p class="text-sm">
          <text class="text-zinc-300">Late tasks: </text>
          <text>{{ props.deadlines != undefined ? props.deadlines.tasks.late : 0 }}</text>
        </p>
      </div>
      <div class="self-end">
        <ConfirmDeleteModal
          :visible="showOptions"
          :name="`table ${props.table.name}`"
          @confirm-deletion="deleteTable()"
        />
      </div>
    </div>
  </RouterLink>
</template>
