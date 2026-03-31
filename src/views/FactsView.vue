<template>
  <div class="min-h-screen py-20 px-4 flex flex-col items-center">
    <div class="max-w-2xl w-full">

      <div class="text-center mb-12">
        <h1 class="font-display font-black text-4xl md:text-5xl text-white mb-4">🌌 Космические Факты</h1>
        <p class="text-slate-400">Узнай удивительные вещи о нашей Вселенной</p>
      </div>

      <div class="w-full bg-slate-800 rounded-full h-2 mb-8">
        <div
          class="h-2 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-500"
          :style="`width: ${((currentIndex + 1) / facts.length) * 100}%`"
        />
      </div>

      <Transition name="fact" mode="out-in">
        <div :key="currentIndex" class="glass-card p-10 text-center mb-8">
          <div class="font-display font-black text-8xl text-slate-800 mb-4 select-none">
            {{ String(currentIndex + 1).padStart(2, '0') }}
          </div>
          <div class="text-6xl mb-6">{{ facts[currentIndex].icon }}</div>
          <p class="text-white text-xl leading-relaxed">{{ facts[currentIndex].text }}</p>
          <p class="text-slate-500 text-sm mt-6">{{ currentIndex + 1 }} / {{ facts.length }}</p>
        </div>
      </Transition>

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
