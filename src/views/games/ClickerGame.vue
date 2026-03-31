<template>
  <div class="min-h-screen py-20 px-4">
    <div class="w-full md:w-[62%] mx-auto">
      <RouterLink to="/games" class="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors">← Назад</RouterLink>

      <div class="text-center mb-6">
        <h1 class="font-display font-black text-4xl text-white mb-1">👆 Космический Кликер</h1>
        <p class="text-slate-400 text-sm">Строй флот межзвёздных ракет!</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="glass-card p-8 flex flex-col items-center justify-center gap-4">
          <div class="font-display font-black text-3xl text-amber-400">
            {{ formatNum(coins) }}
          </div>
          <div class="text-slate-400 text-sm">+{{ cps }}/сек</div>

          <button
            @click="click"
            class="text-7xl md:text-8xl transition-transform duration-75 hover:scale-110 active:scale-95 select-none cursor-pointer py-4"
            style="filter: drop-shadow(0 0 20px #6366f180)"
          >
            🚀
          </button>

          <div class="text-sm text-slate-400">+{{ clickPower }} за клик</div>
        </div>

        <div class="flex flex-col gap-3">
          <h3 class="font-display font-bold text-white text-lg">Улучшения</h3>
          <div
            v-for="upgrade in upgrades"
            :key="upgrade.id"
            class="glass-card p-4 flex items-center justify-between gap-3 cursor-pointer transition-all duration-200"
            :class="coins >= upgrade.cost ? 'hover:border-amber-500/60 hover:scale-102' : 'opacity-50'"
            @click="buyUpgrade(upgrade)"
          >
            <div class="flex items-center gap-3">
              <span class="text-3xl">{{ upgrade.icon }}</span>
              <div>
                <p class="font-semibold text-white text-sm">{{ upgrade.name }}</p>
                <p class="text-slate-400 text-xs">{{ upgrade.description }}</p>
                <p class="text-slate-500 text-xs">Куплено: {{ upgrade.count }}</p>
              </div>
            </div>
            <div class="text-right flex-shrink-0">
              <p class="text-amber-400 font-bold text-sm">{{ formatNum(upgrade.cost) }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-3 gap-4 mt-6">
        <div class="glass-card p-4 text-center">
          <div class="text-2xl font-black text-cyan-400">{{ formatNum(totalClicks) }}</div>
          <div class="text-slate-500 text-xs">Кликов</div>
        </div>
        <div class="glass-card p-4 text-center">
          <div class="text-2xl font-black text-purple-400">{{ formatNum(totalEarned) }}</div>
          <div class="text-slate-500 text-xs">Заработано</div>
        </div>
        <div class="glass-card p-4 text-center">
          <div class="text-2xl font-black text-amber-400">{{ formatNum(coins) }}</div>
          <div class="text-slate-500 text-xs">Монет</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useGameStore } from '@/stores/useGameStore.js'

const gameStore = useGameStore()

const coins = ref(0)
const totalClicks = ref(0)
const totalEarned = ref(0)

const upgrades = ref([
  { id: 'fuel',    name: 'Топливо',        icon: '⛽', description: '+1 за клик',      baseCost: 10,   cost: 10,   count: 0, clickBonus: 1, cpsBonus: 0 },
  { id: 'engine',  name: 'Двигатель',      icon: '🔥', description: '+1 в секунду',    baseCost: 50,   cost: 50,   count: 0, clickBonus: 0, cpsBonus: 1 },
  { id: 'station', name: 'Орбит. Станция', icon: '🛸', description: '+5 в секунду',    baseCost: 500,  cost: 500,  count: 0, clickBonus: 0, cpsBonus: 5 },
  { id: 'fleet',   name: 'Флот Ракет',     icon: '🚀', description: '+20 в секунду',   baseCost: 3000, cost: 3000, count: 0, clickBonus: 0, cpsBonus: 20 },
])

const clickPower = computed(() => 1 + upgrades.value.reduce((s, u) => s + u.clickBonus * u.count, 0))
const cps = computed(() => upgrades.value.reduce((s, u) => s + u.cpsBonus * u.count, 0))

function click() {
  const earned = clickPower.value
  coins.value += earned
  totalClicks.value++
  totalEarned.value += earned
  gameStore.setScore('clicker', Math.floor(totalEarned.value))
}

function buyUpgrade(u) {
  if (coins.value < u.cost) return
  coins.value -= u.cost
  u.count++
  u.cost = Math.floor(u.baseCost * Math.pow(1.5, u.count))
}

function formatNum(n) {
  if (n >= 1e9) return (n/1e9).toFixed(1) + 'B'
  if (n >= 1e6) return (n/1e6).toFixed(1) + 'M'
  if (n >= 1e3) return (n/1e3).toFixed(1) + 'K'
  return Math.floor(n).toString()
}

let interval
onMounted(() => { interval = setInterval(() => { coins.value += cps.value / 10; totalEarned.value += cps.value / 10 }, 100) })
onUnmounted(() => clearInterval(interval))
</script>
