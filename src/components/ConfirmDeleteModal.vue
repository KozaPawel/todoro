<script setup>
import { computed } from 'vue'
import Button from '@/components/Button.vue'
import Modal from '@/components/Modal.vue'
import IconTrash from '@/components/icons/IconTrash.vue'

const props = defineProps({
  name: String,
  visible: Boolean,
  normalButton: Boolean
})

const showOptions = computed(() => props.visible)

defineEmits(['confirmDeletion'])
</script>

<template>
  <Modal
    :title="`Are you sure you want to delete ${props.name}?`"
    :customButton="!normalButton ? true : false"
    :open-button-name="'Delete'"
    ref="modal"
  >
    <template v-slot:customButton>
      <IconTrash
        class="h-8 w-8 rounded-md p-1 opacity-100 transition-opacity duration-200 ease-in-out hover:cursor-pointer hover:bg-white/20 md:opacity-0"
        :class="{ 'md:opacity-100': showOptions }"
        @click.prevent
      />
    </template>
    <template v-slot:inputs="{ closeModal }">
      <div class="mt-6 flex items-center justify-center gap-2">
        <Button class="w-full" @click="closeModal"> Cancel </Button>
        <Button
          class="w-full !bg-red-500/90 !text-white hover:!bg-red-500 hover:!shadow-red-500/50"
          @click="$emit('confirmDeletion')"
        >
          Delete
        </Button>
      </div>
    </template>
  </Modal>
</template>
