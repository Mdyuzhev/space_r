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
