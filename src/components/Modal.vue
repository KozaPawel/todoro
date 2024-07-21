<script setup>
import { ref } from 'vue'
import { TransitionRoot, TransitionChild, Dialog, DialogPanel, DialogTitle } from '@headlessui/vue'
import Button from '@/components/Button.vue'
import IconX from '@/components/icons/IconX.vue'

const props = defineProps({
  title: String,
  openButtonName: String,
  customButton: Boolean
})

const isOpen = ref(false)

const closeModal = () => {
  isOpen.value = false
}
const openModal = () => {
  isOpen.value = true
}

defineExpose({
  closeModal,
  openModal
})

defineEmits(['closeModal'])
</script>

<template>
  <Button
    class="w-full !bg-red-500/90 !text-white hover:!bg-red-500 hover:!shadow-red-500/50"
    @click="openModal"
    v-if="props.customButton != null && props.customButton != true"
  >
    {{ props.openButtonName }}
  </Button>
  <button class="self-start" @click="openModal" v-else>
    <slot name="customButton"></slot>
  </button>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" @close="closeModal(), $emit('closeModal')" class="relative z-10 text-white">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-dark/50 backdrop-blur-sm"></div>
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel
              class="w-full max-w-lg transform overflow-hidden rounded-xl border-2 border-white/20 bg-white/10 p-6 text-left align-middle shadow-xl backdrop-blur-md transition-all"
            >
              <DialogTitle as="h3" class="text-xl font-semibold leading-6">
                <div class="flex flex-row items-center justify-between">
                  <text class="overflow-hidden text-ellipsis break-normal">{{ props.title }}</text>
                  <IconX
                    class="min-w-8 self-start rounded-lg hover:cursor-pointer hover:bg-white/20"
                    @click.prevent="closeModal(), $emit('closeModal')"
                  />
                </div>
              </DialogTitle>
              <div class="mt-2">
                <slot name="inputs" :close-modal="closeModal"></slot>
              </div>

              <slot name="confirmButton"></slot>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
