<script setup>
import { RouterLink } from 'vue-router'
import IconArrow from '@/components/icons/IconArrow.vue'
</script>

<template>
  <RouterLink :to="'/'">
    <div
      class="flex select-none items-center gap-1 rounded-md p-2 transition-all duration-200 hover:cursor-pointer hover:border-white/70 hover:bg-white/30"
    >
      <IconArrow class="size-5" />
      <text class="text-xl font-semibold text-white">Tables</text>
    </div>
  </RouterLink>
</template>
