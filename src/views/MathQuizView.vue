<template>
  <div class="min-h-screen py-20 px-4 flex flex-col items-center justify-center">
    <div class="max-w-lg w-full">

      <div class="text-center mb-8">
        <h1 class="font-display font-black text-4xl text-white mb-2">🎓 Математическая Викторина</h1>
        <p class="text-slate-400">Испытание от Командира Блока</p>
      </div>

      <div class="grid grid-cols-3 gap-4 mb-8">
        <div class="glass-card p-4 text-center">
          <div class="text-2xl font-black text-emerald-400">{{ correct }}</div>
          <div class="text-slate-500 text-xs">Правильно</div>
        </div>
        <div class="glass-card p-4 text-center">
          <div class="text-2xl font-black text-rose-400">{{ wrong }}</div>
          <div class="text-slate-500 text-xs">Неверно</div>
        </div>
        <div class="glass-card p-4 text-center">
          <div class="text-2xl font-black text-cyan-400">{{ total }}</div>
          <div class="text-slate-500 text-xs">Всего</div>
        </div>
      </div>

      <div v-if="!finished" class="glass-card p-8 text-center mb-6">
        <p class="text-slate-400 text-sm mb-4">Вопрос {{ total + 1 }} из 10</p>
        <div class="font-display font-black text-5xl text-white mb-8">
          {{ question.a }} × {{ question.b }} = ?
        </div>

        <div class="w-full bg-slate-800 rounded-full h-1.5 mb-8">
          <div class="h-1.5 rounded-full bg-cyan-500 transition-all duration-300" :style="`width: ${(total / 10) * 100}%`" />
        </div>

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

        <Transition name="feedback">
          <div v-if="lastAnswer !== null" class="mt-6">
            <p v-if="lastAnswer === question.correct" class="text-emerald-400 font-bold text-lg">Правильно!</p>
            <p v-else class="text-rose-400 font-bold text-lg">Правильный ответ: {{ question.correct }}</p>
            <button @click="nextQuestion" class="btn-primary mt-4">
              {{ total < 10 ? 'Следующий →' : 'Результат' }}
            </button>
          </div>
        </Transition>
      </div>

      <div v-else class="glass-card p-10 text-center">
        <div class="text-6xl mb-4">{{ resultEmoji }}</div>
        <h2 class="font-display font-black text-3xl text-white mb-2">Результат: {{ correct }}/10</h2>
        <p class="text-slate-400 mb-6">{{ resultMessage }}</p>
        <button @click="restart" class="btn-primary">Играть снова</button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useGameStore } from '@/stores/useGameStore.js'

const gameStore = useGameStore()

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
  if (total.value >= 10) { finished.value = true; gameStore.setScore('math-quiz', correct.value); return }
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
