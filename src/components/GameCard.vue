<template>
  <RouterLink :to="game.route" class="block group">
    <div
      class="glass-card p-6 h-full transition-all duration-300 hover:scale-105 relative overflow-hidden"
      :style="`--accent: ${game.accentColor}`"
    >
      <div
        class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        :style="`background: radial-gradient(circle at 50% 0%, ${game.accentColor}10, transparent 70%)`"
      />

      <div class="text-5xl mb-4 text-center transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1">
        {{ game.icon }}
      </div>

      <h3 class="font-display font-bold text-white text-center text-lg mb-2">{{ game.name }}</h3>

      <p class="text-slate-400 text-sm text-center mb-4">{{ game.description }}</p>

      <p class="text-slate-600 text-xs text-center mb-4">{{ game.controls }}</p>

      <div
        class="w-full py-2 rounded-xl text-center text-sm font-semibold transition-all duration-200"
        :style="`background: ${game.accentColor}20; color: ${game.accentColor}; border: 1px solid ${game.accentColor}40`"
      >
        ▶ Играть
      </div>

      <p v-if="highScore > 0" class="text-slate-500 text-xs text-center mt-2">
        Рекорд: {{ highScore }}
      </p>
    </div>
  </RouterLink>
</template>

<script setup>
import { computed } from 'vue'
import { useGameStore } from '@/stores/useGameStore.js'

const props = defineProps({ game: { type: Object, required: true } })
const gameStore = useGameStore()
const highScore = computed(() => gameStore.getHighScore(props.game.id))
</script>
