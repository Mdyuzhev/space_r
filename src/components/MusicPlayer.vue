<template>
  <div class="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
    <Transition name="fade">
      <div v-if="store.isPlaying" class="glass-card px-3 py-1.5 text-xs text-slate-300">
        🎵 {{ store.tracks[store.currentTrack]?.name ?? 'Space Music' }}
      </div>
    </Transition>

    <button
      @click="store.toggle()"
      class="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg"
      :class="store.isPlaying
        ? 'bg-cyan-500 hover:bg-cyan-400 shadow-cyan-500/50 animate-glow'
        : 'bg-slate-800 hover:bg-slate-700 border border-slate-600'"
      :title="store.isPlaying ? 'Выключить музыку' : 'Включить музыку'"
    >
      <span class="text-xl">{{ store.isPlaying ? '⏸️' : '🎵' }}</span>
    </button>
  </div>
</template>

<script setup>
import { useMusicStore } from '@/stores/useMusicStore.js'
const store = useMusicStore()
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: all 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateX(10px); }
</style>
