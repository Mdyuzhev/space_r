<template>
  <div class="min-h-screen bg-slate-950 text-slate-100 relative overflow-x-hidden">
    <StarBackground />
    <AppNavbar />
    <main class="relative z-10">
      <RouterView v-slot="{ Component }">
        <Transition name="page" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>
    <AppFooter />
    <MusicPlayer />
  </div>
</template>

<script setup>
import { watch } from 'vue'
import { useRoute } from 'vue-router'
import StarBackground from '@/components/StarBackground.vue'
import AppNavbar from '@/components/AppNavbar.vue'
import AppFooter from '@/components/AppFooter.vue'
import MusicPlayer from '@/components/MusicPlayer.vue'
import { usePlayerStore } from '@/stores/usePlayerStore.js'

const route = useRoute()
const playerStore = usePlayerStore()
watch(() => route.path, (path) => playerStore.visit(path), { immediate: true })
</script>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.3s ease;
}
.page-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.page-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
