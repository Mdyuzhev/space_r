# T07 — Games Hub + Facts View + Math Quiz View

**Проект:** `E:\Politech\space_r`
**Волна:** 3 (параллельно с T05, T06)
**Зависимости:** T03, T04

---

## Цель

Создать три view: GamesHubView, FactsView, MathQuizView.

---

## src/views/GamesHubView.vue

```vue
<template>
  <div class="min-h-screen py-20 px-4">
    <div class="max-w-7xl mx-auto">
      <div class="text-center mb-16">
        <h1 class="font-display font-black text-4xl md:text-6xl text-white mb-4">🎮 Игровой Центр</h1>
        <p class="text-slate-400 text-lg">Шесть мини-игр прямо в браузере — выбирай!</p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <GameCard v-for="game in games" :key="game.id" :game="game" />
      </div>
    </div>
  </div>
</template>

<script setup>
import GameCard from '@/components/GameCard.vue'
import { games } from '@/data/games.js'
</script>
```

---

## src/views/FactsView.vue

```vue
<template>
  <div class="min-h-screen py-20 px-4 flex flex-col items-center">
    <div class="max-w-2xl w-full">

      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="font-display font-black text-4xl md:text-5xl text-white mb-4">🌌 Космические Факты</h1>
        <p class="text-slate-400">Узнай удивительные вещи о нашей Вселенной</p>
      </div>

      <!-- Progress bar -->
      <div class="w-full bg-slate-800 rounded-full h-2 mb-8">
        <div
          class="h-2 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-500"
          :style="`width: ${((currentIndex + 1) / facts.length) * 100}%`"
        />
      </div>

      <!-- Fact card -->
      <Transition name="fact" mode="out-in">
        <div :key="currentIndex" class="glass-card p-10 text-center mb-8">
          <!-- Number -->
          <div class="font-display font-black text-8xl text-slate-800 mb-4 select-none">
            {{ String(currentIndex + 1).padStart(2, '0') }}
          </div>

          <!-- Icon -->
          <div class="text-6xl mb-6">{{ facts[currentIndex].icon }}</div>

          <!-- Text -->
          <p class="text-white text-xl leading-relaxed">{{ facts[currentIndex].text }}</p>

          <!-- Fact counter -->
          <p class="text-slate-500 text-sm mt-6">{{ currentIndex + 1 }} / {{ facts.length }}</p>
        </div>
      </Transition>

      <!-- Navigation -->
      <div class="flex items-center justify-between gap-4">
        <button
          @click="prev"
          :disabled="currentIndex === 0"
          class="flex-1 py-3 rounded-xl border border-slate-700 text-slate-300 hover:border-cyan-500 hover:text-cyan-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 font-semibold"
        >
          ← Назад
        </button>

        <button
          @click="random"
          class="p-3 rounded-xl border border-slate-700 text-slate-400 hover:border-purple-500 hover:text-purple-400 transition-all duration-200"
          title="Случайный факт"
        >
          🎲
        </button>

        <button
          @click="next"
          :disabled="currentIndex === facts.length - 1"
          class="flex-1 py-3 rounded-xl border border-slate-700 text-slate-300 hover:border-cyan-500 hover:text-cyan-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 font-semibold"
        >
          Вперёд →
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { facts } from '@/data/facts.js'

const currentIndex = ref(0)

function next() { if (currentIndex.value < facts.length - 1) currentIndex.value++ }
function prev() { if (currentIndex.value > 0) currentIndex.value-- }
function random() { currentIndex.value = Math.floor(Math.random() * facts.length) }
</script>

<style scoped>
.fact-enter-active, .fact-leave-active { transition: all 0.3s ease; }
.fact-enter-from { opacity: 0; transform: translateX(30px); }
.fact-leave-to   { opacity: 0; transform: translateX(-30px); }
</style>
```

---

## src/views/MathQuizView.vue

```vue
<template>
  <div class="min-h-screen py-20 px-4 flex flex-col items-center justify-center">
    <div class="max-w-lg w-full">

      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="font-display font-black text-4xl text-white mb-2">🎓 Математическая Викторина</h1>
        <p class="text-slate-400">Испытание от Командира Блока</p>
      </div>

      <!-- Scores -->
      <div class="grid grid-cols-3 gap-4 mb-8">
        <div class="glass-card p-4 text-center">
          <div class="text-2xl font-black text-emerald-400">{{ correct }}</div>
          <div class="text-slate-500 text-xs">✅ Правильно</div>
        </div>
        <div class="glass-card p-4 text-center">
          <div class="text-2xl font-black text-rose-400">{{ wrong }}</div>
          <div class="text-slate-500 text-xs">❌ Неверно</div>
        </div>
        <div class="glass-card p-4 text-center">
          <div class="text-2xl font-black text-cyan-400">{{ total }}</div>
          <div class="text-slate-500 text-xs">📊 Всего</div>
        </div>
      </div>

      <!-- Question card -->
      <div v-if="!finished" class="glass-card p-8 text-center mb-6">
        <p class="text-slate-400 text-sm mb-4">Вопрос {{ total + 1 }} из 10</p>
        <div class="font-display font-black text-5xl text-white mb-8">
          {{ question.a }} × {{ question.b }} = ?
        </div>

        <!-- Progress bar -->
        <div class="w-full bg-slate-800 rounded-full h-1.5 mb-8">
          <div class="h-1.5 rounded-full bg-cyan-500 transition-all duration-300" :style="`width: ${(total / 10) * 100}%`" />
        </div>

        <!-- Answer options -->
        <div class="grid grid-cols-2 gap-3">
          <button
            v-for="option in question.options"
            :key="option"
            @click="answer(option)"
            :class="[
              'py-4 rounded-xl font-bold text-xl transition-all duration-200 hover:scale-105',
              lastAnswer === null ? 'glass-card text-white hover:border-cyan-500/60' : '',
              lastAnswer !== null && option === question.correct ? 'bg-emerald-500/20 border border-emerald-500 text-emerald-400' : '',
              lastAnswer !== null && option === lastAnswer && option !== question.correct ? 'bg-rose-500/20 border border-rose-500 text-rose-400' : '',
              lastAnswer !== null && option !== question.correct && option !== lastAnswer ? 'glass-card text-slate-500 opacity-50' : '',
            ]"
            :disabled="lastAnswer !== null"
          >
            {{ option }}
          </button>
        </div>

        <!-- Feedback -->
        <Transition name="feedback">
          <div v-if="lastAnswer !== null" class="mt-6">
            <p v-if="lastAnswer === question.correct" class="text-emerald-400 font-bold text-lg">✅ Правильно!</p>
            <p v-else class="text-rose-400 font-bold text-lg">❌ Правильный ответ: {{ question.correct }}</p>
            <button @click="nextQuestion" class="btn-primary mt-4">
              {{ total < 10 ? 'Следующий →' : 'Результат 🏆' }}
            </button>
          </div>
        </Transition>
      </div>

      <!-- Results -->
      <div v-else class="glass-card p-10 text-center">
        <div class="text-6xl mb-4">{{ resultEmoji }}</div>
        <h2 class="font-display font-black text-3xl text-white mb-2">Результат: {{ correct }}/10</h2>
        <p class="text-slate-400 mb-6">{{ resultMessage }}</p>
        <button @click="restart" class="btn-primary">🔄 Играть снова</button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const correct = ref(0)
const wrong = ref(0)
const total = ref(0)
const finished = ref(false)
const lastAnswer = ref(null)
const question = ref(generateQuestion())

function generateQuestion() {
  const a = Math.floor(Math.random() * 10) + 1
  const b = Math.floor(Math.random() * 10) + 1
  const correctAns = a * b
  const wrongAnswers = new Set()
  while (wrongAnswers.size < 3) {
    const w = correctAns + (Math.floor(Math.random() * 10) - 5)
    if (w !== correctAns && w > 0) wrongAnswers.add(w)
  }
  const options = [...wrongAnswers, correctAns].sort(() => Math.random() - 0.5)
  return { a, b, correct: correctAns, options }
}

function answer(opt) {
  if (lastAnswer.value !== null) return
  lastAnswer.value = opt
  if (opt === question.value.correct) correct.value++
  else wrong.value++
}

function nextQuestion() {
  total.value++
  if (total.value >= 10) { finished.value = true; return }
  question.value = generateQuestion()
  lastAnswer.value = null
}

function restart() {
  correct.value = 0; wrong.value = 0; total.value = 0
  finished.value = false; lastAnswer.value = null
  question.value = generateQuestion()
}

const resultEmoji = computed(() => {
  if (correct.value >= 9) return '🏆'
  if (correct.value >= 7) return '🥇'
  if (correct.value >= 5) return '🥈'
  return '📚'
})

const resultMessage = computed(() => {
  if (correct.value >= 9) return 'Отличный результат! Командир Блок впечатлён!'
  if (correct.value >= 7) return 'Хорошая работа! Ещё немного тренировки!'
  if (correct.value >= 5) return 'Неплохо! Таблицу умножения нужно повторить!'
  return 'Надо позаниматься! Ракеты сами себя не считают!'
})
</script>

<style scoped>
.feedback-enter-active { transition: all 0.3s ease; }
.feedback-enter-from { opacity: 0; transform: translateY(10px); }
</style>
```

---

**Результат:** GamesHubView.vue, FactsView.vue, MathQuizView.vue
**Следующий шаг:** T08, T09, T10 (параллельно)
