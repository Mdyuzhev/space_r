# T04 — Shared UI Components

**Проект:** `E:\Politech\space_r`
**Волна:** 2 (параллельно с T03)
**Зависимости:** T01, T02

---

## Цель

CharacterCard, GameCard, MusicPlayer — переиспользуемые компоненты.

---

## src/components/CharacterCard.vue

```vue
<template>
  <div
    class="glass-card p-6 cursor-pointer group transition-all duration-300 hover:scale-105"
    :class="`hover:border-[${character.accentColor}]/60`"
    :style="`--accent: ${character.accentColor}`"
    @click="$emit('select', character)"
  >
    <!-- Avatar -->
    <div class="flex justify-center mb-4">
      <div
        class="w-24 h-24 rounded-full flex items-center justify-center overflow-hidden border-2 transition-all duration-300"
        :style="`border-color: ${character.accentColor}40; background: ${character.accentColor}10`"
        :class="`group-hover:shadow-[0_0_20px_${character.accentColor}60]`"
      >
        <img
          v-if="character.image"
          :src="character.image"
          :alt="character.name"
          class="w-full h-full object-cover"
        />
        <span v-else class="text-5xl">{{ character.emoji }}</span>
      </div>
    </div>

    <!-- Name & Role -->
    <div class="text-center mb-3">
      <h3 class="font-display font-bold text-white text-lg">{{ character.name }}</h3>
      <span
        class="text-xs font-semibold px-2 py-0.5 rounded-full"
        :style="`background: ${character.accentColor}20; color: ${character.accentColor}`"
      >{{ character.role }}</span>
    </div>

    <!-- Description -->
    <p class="text-slate-400 text-sm text-center mb-4">{{ character.description }}</p>

    <!-- Stats -->
    <div class="grid grid-cols-3 gap-2 mb-4 text-center">
      <div>
        <div class="flex justify-center mb-1">
          <span v-for="i in 5" :key="i" class="text-xs" :style="i <= character.stats.experience ? `color: ${character.accentColor}` : 'color: #374151'">★</span>
        </div>
        <p class="text-slate-500 text-xs">Опыт</p>
      </div>
      <div>
        <p class="font-bold text-white">{{ character.stats.missions }}</p>
        <p class="text-slate-500 text-xs">Миссий</p>
      </div>
      <div>
        <p class="font-semibold text-xs" :style="`color: ${character.accentColor}`">{{ character.stats.rank }}</p>
        <p class="text-slate-500 text-xs">Ранг</p>
      </div>
    </div>

    <!-- Ability button -->
    <RouterLink
      :to="character.ability.route"
      class="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-105"
      :style="`background: ${character.accentColor}20; color: ${character.accentColor}; border: 1px solid ${character.accentColor}40`"
      @click.stop
    >
      <span>{{ character.ability.icon }}</span>
      {{ character.ability.name }}
    </RouterLink>
  </div>
</template>

<script setup>
defineProps({ character: { type: Object, required: true } })
defineEmits(['select'])
</script>
```

---

## src/components/GameCard.vue

```vue
<template>
  <RouterLink :to="game.route" class="block group">
    <div
      class="glass-card p-6 h-full transition-all duration-300 hover:scale-105 relative overflow-hidden"
      :style="`--accent: ${game.accentColor}`"
    >
      <!-- Neon glow bg on hover -->
      <div
        class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        :style="`background: radial-gradient(circle at 50% 0%, ${game.accentColor}10, transparent 70%)`"
      />

      <!-- Icon -->
      <div class="text-5xl mb-4 text-center transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1">
        {{ game.icon }}
      </div>

      <!-- Name -->
      <h3 class="font-display font-bold text-white text-center text-lg mb-2">{{ game.name }}</h3>

      <!-- Description -->
      <p class="text-slate-400 text-sm text-center mb-4">{{ game.description }}</p>

      <!-- Controls hint -->
      <p class="text-slate-600 text-xs text-center mb-4">{{ game.controls }}</p>

      <!-- Play button -->
      <div
        class="w-full py-2 rounded-xl text-center text-sm font-semibold transition-all duration-200"
        :style="`background: ${game.accentColor}20; color: ${game.accentColor}; border: 1px solid ${game.accentColor}40`"
      >
        ▶ Играть
      </div>

      <!-- High score -->
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
```

---

## src/components/MusicPlayer.vue

```vue
<template>
  <div class="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
    <!-- Track name tooltip -->
    <Transition name="fade">
      <div v-if="store.isPlaying" class="glass-card px-3 py-1.5 text-xs text-slate-300">
        🎵 {{ store.tracks[store.currentTrack]?.name ?? 'Space Music' }}
      </div>
    </Transition>

    <!-- Toggle button -->
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
```

---

**Результат:** CharacterCard.vue, GameCard.vue, MusicPlayer.vue
**Следующий шаг:** T05, T06, T07 (параллельно)
