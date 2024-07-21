<script setup>
import { ref, onBeforeMount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import TableList from '@/components/TableList.vue'
import NewListModal from '@/components/NewListModal.vue'
import BackButton from '@/components/BackButton.vue'

const route = useRoute()
const router = useRouter()
const currentRoute = route.params.id
const table = ref([])
const tableIndex = ref('')

const getTableData = () => {
  const storage = JSON.parse(localStorage.getItem('tables'))
  storage != null
    ? storage.forEach((tab, index) => {
        tab.name == currentRoute && ((table.value = tab), (tableIndex.value = index))
      })
    : router.push({ name: 'tables' })

  table.value == undefined
    ? router.push({ name: 'tables' })
    : (localStorage.setItem('background', JSON.stringify(table.value.background)),
      window.dispatchEvent(
        new CustomEvent('background-changed', {
          detail: {
            background: table.value.background
          }
        })
      ))
}

const deleteList = (list) => {
  const storage = JSON.parse(localStorage.getItem('tables'))
  const index = table.value.lists.indexOf(list)

  table.value.lists.splice(index, 1)
  storage[tableIndex.value] = table.value
  localStorage.setItem('tables', JSON.stringify(storage))
}

onBeforeMount(() => {
  getTableData()
})
</script>
<template>
  <div
    v-if="table != undefined"
    class="flex h-full flex-col items-start justify-start overflow-hidden"
  >
    <div class="flex flex-col items-center px-4 pb-4 pt-2">
      <BackButton />
      <h1 class="self-start overflow-hidden text-3xl font-bold text-white hover:overflow-x-auto">
        {{ table.name }}
      </h1>
    </div>

    <div class="flex h-full w-full gap-4 overflow-auto px-4 pb-2 text-white">
      <TableList
        v-for="(list, index) in table.lists"
        v-model:table="table"
        :key="list.name"
        :list="list"
        :list-index="index"
        :table-index="tableIndex"
        @delete-list="deleteList(list)"
      />
      <NewListModal :open-button-name="'Add list'" :table="table" @new-list="getTableData()" />
    </div>
  </div>
</template>
