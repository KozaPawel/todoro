<script setup>
import { onMounted, ref } from 'vue'
import { RouterView } from 'vue-router'

const backgroundColor = ref('')

onMounted(() => {
  backgroundColor.value =
    localStorage.getItem('background') != undefined
      ? JSON.parse(localStorage.getItem('background'))
      : '#2a32e0'

  window.addEventListener('background-changed', (event) => {
    backgroundColor.value = event.detail.background
  })
})
</script>

<template>
  <div
    class="h-svh w-screen bg-grain"
    :style="{
      'background-color': `${backgroundColor}`
    }"
  >
    <RouterView class="h-full w-full" />
  </div>
</template>
