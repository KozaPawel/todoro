<script setup>
import { onBeforeMount, ref } from 'vue'
import NewTableModal from '@/components/NewTableModal.vue'
import TableCard from '@/components/TableCard.vue'

const tables = ref([])
const deadlines = ref([])

const getTables = () => {
  const storage = JSON.parse(localStorage.getItem('tables'))
  storage != null ? (tables.value = storage) : (tables.value = [])
}

const getDeadlines = () => {
  const storage = JSON.parse(localStorage.getItem('tables'))
  const today = new Date()

  storage != null &&
    storage.forEach((table, index) => {
      deadlines.value.push({
        name: table.name,
        tasks: {
          due: 0,
          late: 0
        }
      })
      table.lists.forEach((list) => {
        list.tasks.forEach((task) => {
          if (task.due_on) {
            const daysToDueDate = Math.round(
              (today.getTime() - new Date(task.due_on).getTime()) / (1000 * 3600 * 24)
            )
            daysToDueDate == 1 && (deadlines.value[index].tasks.due += 1)
            daysToDueDate > 1 && (deadlines.value[index].tasks.late += 1)
          }
        })
      })
    })
}

onBeforeMount(() => {
  getTables()
  getDeadlines()
})
</script>

<template>
  <div class="grid h-full grid-rows-12 overflow-hidden text-white">
    <div class="row-span-1 flex items-center justify-start gap-4 pl-4">
      <h1 class="self-center overflow-hidden text-3xl font-bold text-white hover:overflow-x-auto">
        Tables
      </h1>
    </div>
    <div
      class="row-span-11 grid h-full grid-cols-1 content-start gap-4 overflow-auto px-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
    >
      <TableCard
        v-for="(table, index) in tables"
        :key="table.name"
        :table="table"
        :deadlines="deadlines[index]"
        class="xl:w-1/10 col-span-1"
        @delete-table="getTables()"
      />
      <NewTableModal :tables="tables" :open-button-name="'Add table'" />
    </div>
  </div>
</template>
