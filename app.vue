<template>
  <NuxtPage />

  <Teleport to="body">
    <Transition v-for="(toast, index) in activeToasts" appear>
      <div class="fixed right-0 border-l-4 w-72 bg-neutral-100 px-5 py-3 text-lg" :class="toast.type === 'error' ? 'border-red-500' : 'border-green-500'" :style="{ top: `${2 + index * 4}rem` }">
        {{ toast.message }}
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const globalStore = useGlobalStore();
const { activeToasts } = storeToRefs(globalStore);

onMounted(() => {
  setInterval(() => {
    for (const toast of activeToasts.value) setTimeout(() => activeToasts.value.splice(0, 1), 5000);
  }, 6000);
});
</script>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: all 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  transform: translateX(5rem);
  opacity: 0;
}
</style>
