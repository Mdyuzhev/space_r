# T06 — Characters View

**Проект:** `E:\Politech\space_r`
**Волна:** 3 (параллельно с T05, T07)
**Зависимости:** T03, T04

---

## Цель

`src/views/CharactersView.vue` — полная страница со всеми 5 персонажами.

---

## src/views/CharactersView.vue

```vue
<template>
  <div class="min-h-screen py-20 px-4">
    <div class="max-w-7xl mx-auto">

      <!-- Header -->
      <div class="text-center mb-16">
        <h1 class="font-display font-black text-4xl md:text-6xl text-white mb-4">
          🌟 Команда Космонавтов
        </h1>
        <p class="text-slate-400 text-lg max-w-2xl mx-auto">
          Познакомься с каждым членом экипажа и открой их уникальные способности
        </p>
      </div>

      <!-- Characters Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <CharacterCard
          v-for="char in characters"
          :key="char.id"
          :character="char"
          @select="selectedChar = char"
        />
      </div>

      <!-- Selected character expanded panel -->
      <Transition name="panel">
        <div
          v-if="selectedChar"
          class="glass-card p-8 mt-8"
          :style="`border-color: ${selectedChar.accentColor}40`"
        >
          <div class="flex flex-col md:flex-row gap-8 items-start">

            <!-- Avatar large -->
            <div class="flex-shrink-0 flex flex-col items-center gap-4">
              <div
                class="w-32 h-32 rounded-2xl flex items-center justify-center overflow-hidden border-2"
                :style="`border-color: ${selectedChar.accentColor}; box-shadow: 0 0 30px ${selectedChar.accentColor}40; background: ${selectedChar.accentColor}10`"
              >
                <img v-if="selectedChar.image" :src="selectedChar.image" :alt="selectedChar.name" class="w-full h-full object-cover" />
                <span v-else class="text-7xl">{{ selectedChar.emoji }}</span>
              </div>
              <span
                class="px-3 py-1 rounded-full text-sm font-bold"
                :style="`background: ${selectedChar.accentColor}20; color: ${selectedChar.accentColor}`"
              >{{ selectedChar.role }}</span>
            </div>

            <!-- Details -->
            <div class="flex-1">
              <div class="flex items-center justify-between mb-4">
                <h2 class="font-display font-black text-3xl text-white">{{ selectedChar.name }}</h2>
                <button @click="selectedChar = null" class="text-slate-500 hover:text-white text-2xl transition-colors">✕</button>
              </div>

              <p class="text-slate-300 text-lg mb-6">{{ selectedChar.description }}</p>

              <!-- Full stats -->
              <div class="grid grid-cols-3 gap-6 mb-6">
                <div class="glass-card p-4 text-center">
                  <div class="flex justify-center mb-2">
                    <span v-for="i in 5" :key="i" class="text-lg" :style="i <= selectedChar.stats.experience ? `color: ${selectedChar.accentColor}` : 'color: #374151'">★</span>
                  </div>
                  <p class="text-slate-400 text-sm">Опыт</p>
                </div>
                <div class="glass-card p-4 text-center">
                  <p class="text-3xl font-black text-white">{{ selectedChar.stats.missions }}</p>
                  <p class="text-slate-400 text-sm">Миссий</p>
                </div>
                <div class="glass-card p-4 text-center">
                  <p class="font-bold" :style="`color: ${selectedChar.accentColor}`">{{ selectedChar.stats.rank }}</p>
                  <p class="text-slate-400 text-sm">Ранг</p>
                </div>
              </div>

              <!-- Ability CTA -->
              <RouterLink
                :to="selectedChar.ability.route"
                class="inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-200 hover:scale-105"
                :style="`background: ${selectedChar.accentColor}20; color: ${selectedChar.accentColor}; border: 1px solid ${selectedChar.accentColor}60; box-shadow: 0 0 20px ${selectedChar.accentColor}20`"
              >
                <span class="text-2xl">{{ selectedChar.ability.icon }}</span>
                Открыть: {{ selectedChar.ability.name }}
              </RouterLink>
            </div>
          </div>
        </div>
      </Transition>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import CharacterCard from '@/components/CharacterCard.vue'
import { characters } from '@/data/characters.js'

const selectedChar = ref(null)
</script>

<style scoped>
.panel-enter-active, .panel-leave-active { transition: all 0.3s ease; }
.panel-enter-from, .panel-leave-to { opacity: 0; transform: translateY(20px); }
</style>
```

---

**Результат:** `src/views/CharactersView.vue` — страница персонажей с expand-панелью
**Следующий шаг:** T05, T07 (параллельно), затем Wave 4
