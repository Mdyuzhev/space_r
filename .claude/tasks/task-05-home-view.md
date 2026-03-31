# T05 — Home View

**Проект:** `E:\Politech\space_r`
**Волна:** 3 (параллельно с T06, T07)
**Зависимости:** T03, T04

---

## Цель

Создать `src/views/HomeView.vue` — главная страница с Hero, превью персонажей и игр.

---

## src/views/HomeView.vue

```vue
<template>
  <div>
    <!-- HERO -->
    <section class="min-h-screen flex flex-col items-center justify-center px-4 text-center relative">
      <!-- Floating planet decorations -->
      <div class="absolute top-20 left-10 text-6xl opacity-20 animate-spin-slow pointer-events-none select-none">🪐</div>
      <div class="absolute bottom-32 right-10 text-4xl opacity-20 animate-float pointer-events-none select-none">☄️</div>
      <div class="absolute top-40 right-20 text-3xl opacity-15 animate-float pointer-events-none select-none" style="animation-delay:2s">⭐</div>

      <div v-motion-fade-visible class="max-w-4xl">
        <!-- Badge -->
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-sm font-medium mb-6">
          <span class="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          Космическое приключение в стиле Roblox
        </div>

        <!-- Title -->
        <h1 class="font-display font-black text-5xl md:text-7xl lg:text-8xl mb-6 leading-tight">
          <span class="text-white">🌌 Space</span>
          <br />
          <span class="bg-gradient-to-r from-cyan-400 via-purple-400 to-amber-400 bg-clip-text text-transparent neon-text-cyan">
            Roblox
          </span>
        </h1>

        <p class="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          Исследуй бесконечную вселенную, знакомься с персонажами,
          играй в мини-игры и открывай секреты космоса!
        </p>

        <!-- CTA Buttons -->
        <div class="flex flex-wrap justify-center gap-4">
          <RouterLink to="/games" class="btn-primary text-base">
            🎮 Играть
          </RouterLink>
          <RouterLink to="/characters" class="btn-secondary text-base">
            👨‍🚀 Познакомиться с командой
          </RouterLink>
        </div>
      </div>

      <!-- Scroll indicator -->
      <div class="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-500 animate-bounce">
        <span class="text-xs">Листай вниз</span>
        <span class="text-lg">↓</span>
      </div>
    </section>

    <!-- CHARACTERS PREVIEW -->
    <section class="py-20 px-4">
      <div class="max-w-7xl mx-auto">
        <div v-motion-slide-visible-once-bottom class="text-center mb-12">
          <h2 class="font-display font-bold text-3xl md:text-4xl text-white mb-4">
            👨‍🚀 Команда Космонавтов
          </h2>
          <p class="text-slate-400 max-w-xl mx-auto">
            Пять уникальных персонажей, каждый со своей суперспособностью
          </p>
        </div>

        <!-- Horizontal scroll on mobile, grid on desktop -->
        <div class="flex gap-4 overflow-x-auto pb-4 md:grid md:grid-cols-3 lg:grid-cols-5 md:overflow-visible snap-x snap-mandatory">
          <div
            v-for="char in characters"
            :key="char.id"
            class="flex-shrink-0 w-64 md:w-auto snap-center"
          >
            <CharacterCard :character="char" @select="() => {}" />
          </div>
        </div>

        <div class="text-center mt-8">
          <RouterLink to="/characters" class="btn-secondary">
            Все персонажи →
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- GAMES PREVIEW -->
    <section class="py-20 px-4 bg-gradient-to-b from-transparent via-slate-900/50 to-transparent">
      <div class="max-w-7xl mx-auto">
        <div v-motion-slide-visible-once-bottom class="text-center mb-12">
          <h2 class="font-display font-bold text-3xl md:text-4xl text-white mb-4">
            🎮 Мини-Игры
          </h2>
          <p class="text-slate-400 max-w-xl mx-auto">
            Шесть увлекательных игр прямо в браузере
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <GameCard v-for="game in previewGames" :key="game.id" :game="game" />
        </div>

        <div class="text-center mt-8">
          <RouterLink to="/games" class="btn-primary">
            Все игры 🚀
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- STATS SECTION -->
    <section class="py-20 px-4">
      <div class="max-w-4xl mx-auto">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div v-for="stat in stats" :key="stat.label" class="glass-card p-6 text-center">
            <div class="text-4xl mb-2">{{ stat.icon }}</div>
            <div class="font-display font-black text-3xl text-white mb-1">{{ stat.value }}</div>
            <div class="text-slate-400 text-sm">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import CharacterCard from '@/components/CharacterCard.vue'
import GameCard from '@/components/GameCard.vue'
import { characters } from '@/data/characters.js'
import { games } from '@/data/games.js'

const previewGames = computed(() => games.slice(0, 3))

const stats = [
  { icon: '👨‍🚀', value: '5', label: 'Персонажей' },
  { icon: '🎮', value: '6', label: 'Игр' },
  { icon: '🌌', value: '20', label: 'Космофактов' },
  { icon: '✏️', value: '∞', label: 'Чертежей' },
]
</script>
```

---

**Результат:** `src/views/HomeView.vue` — полная главная страница
**Следующий шаг:** T06 + T07 (параллельно)
