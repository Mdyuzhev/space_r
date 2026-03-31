# T10 — Pong + Clicker Games

**Проект:** `E:\Politech\space_r`
**Волна:** 4 (параллельно с T08, T09)
**Зависимости:** T03

---

## Цель

Создать PongGame.vue и ClickerGame.vue.

---

## src/views/games/PongGame.vue

Классический Понг: игрок против AI, Canvas.

```vue
<template>
  <div class="min-h-screen py-20 px-4">
    <div class="max-w-xl mx-auto">
      <RouterLink to="/games" class="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors">← Назад</RouterLink>
      <div class="text-center mb-6">
        <h1 class="font-display font-black text-4xl text-white mb-1">🏓 Понг</h1>
        <div class="flex justify-center gap-8 text-slate-400 text-sm">
          <span>Ты: <strong class="text-purple-400">{{ playerScore }}</strong></span>
          <span>AI: <strong class="text-rose-400">{{ aiScore }}</strong></span>
          <span>Рекорд: <strong class="text-amber-400">{{ gameStore.getHighScore('pong') }}</strong></span>
        </div>
      </div>

      <div class="glass-card p-4 flex justify-center relative">
        <canvas ref="canvasRef" width="400" height="450" class="rounded-lg" />
        <div v-if="!running" class="absolute inset-4 flex flex-col items-center justify-center bg-slate-950/80 rounded-lg text-center">
          <p v-if="message" class="text-white font-display font-bold text-xl mb-4">{{ message }}</p>
          <button @click="startGame" class="btn-primary">{{ playerScore + aiScore > 0 ? '🔄 Снова' : '▶️ Старт' }}</button>
        </div>
      </div>
      <div class="glass-card p-3 mt-4 text-center text-slate-500 text-xs">W/S или стрелки ↑↓ — ракетка</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useGameStore } from '@/stores/useGameStore.js'

const gameStore = useGameStore()
const canvasRef = ref(null)

const playerScore = ref(0)
const aiScore = ref(0)
const running = ref(false)
const message = ref('')

const W = 400, H = 450
const PAD_W = 12, PAD_H = 70, BALL_R = 8

let player, ai, ball, animId, keys

function startBall(dir = 1) {
  const angle = (Math.random() * 0.4 - 0.2)
  ball = {
    x: W/2, y: H/2,
    vx: dir * (4 + Math.random() * 2),
    vy: Math.sin(angle) * 4,
    speed: 4,
  }
}

function startGame() {
  player = { y: H/2 - PAD_H/2 }
  ai = { y: H/2 - PAD_H/2 }
  playerScore.value = 0
  aiScore.value = 0
  message.value = ''
  keys = {}
  startBall()
  running.value = true
  animId = requestAnimationFrame(loop)
}

function loop() {
  if (!running.value) return

  // Player input
  const speed = 6
  if (keys['ArrowUp'] || keys['w']) player.y = Math.max(0, player.y - speed)
  if (keys['ArrowDown'] || keys['s']) player.y = Math.min(H - PAD_H, player.y + speed)

  // AI
  const aiCenter = ai.y + PAD_H/2
  if (aiCenter < ball.y - 5) ai.y = Math.min(H - PAD_H, ai.y + 3.5)
  if (aiCenter > ball.y + 5) ai.y = Math.max(0, ai.y - 3.5)

  // Ball
  ball.x += ball.vx
  ball.y += ball.vy

  // Wall bounce
  if (ball.y - BALL_R < 0) { ball.y = BALL_R; ball.vy *= -1 }
  if (ball.y + BALL_R > H) { ball.y = H - BALL_R; ball.vy *= -1 }

  // Player paddle
  if (ball.x - BALL_R < PAD_W + 10 && ball.y > player.y && ball.y < player.y + PAD_H && ball.vx < 0) {
    ball.vx = Math.abs(ball.vx) * 1.05
    ball.vy += ((ball.y - (player.y + PAD_H/2)) / PAD_H) * 4
  }

  // AI paddle
  if (ball.x + BALL_R > W - PAD_W - 10 && ball.y > ai.y && ball.y < ai.y + PAD_H && ball.vx > 0) {
    ball.vx = -Math.abs(ball.vx) * 1.05
    ball.vy += ((ball.y - (ai.y + PAD_H/2)) / PAD_H) * 4
  }

  // Clamp ball vy
  ball.vy = Math.max(-8, Math.min(8, ball.vy))

  // Score
  if (ball.x < 0) {
    aiScore.value++
    if (aiScore.value >= 7) { message.value = '🤖 AI победил!'; running.value = false; return }
    startBall(1)
  }
  if (ball.x > W) {
    playerScore.value++
    gameStore.setScore('pong', playerScore.value)
    if (playerScore.value >= 7) { message.value = '🏆 Ты победил!'; running.value = false; return }
    startBall(-1)
  }

  draw()
  animId = requestAnimationFrame(loop)
}

function draw() {
  const ctx = canvasRef.value?.getContext('2d')
  if (!ctx) return

  ctx.fillStyle = '#0f172a'
  ctx.fillRect(0, 0, W, H)

  // Center line
  ctx.setLineDash([10, 10])
  ctx.strokeStyle = '#334155'
  ctx.lineWidth = 2
  ctx.beginPath(); ctx.moveTo(W/2, 0); ctx.lineTo(W/2, H); ctx.stroke()
  ctx.setLineDash([])

  // Paddles
  ctx.fillStyle = '#a855f7'
  ctx.beginPath(); ctx.roundRect(10, player.y, PAD_W, PAD_H, 4); ctx.fill()
  ctx.fillStyle = '#f43f5e'
  ctx.beginPath(); ctx.roundRect(W - PAD_W - 10, ai.y, PAD_W, PAD_H, 4); ctx.fill()

  // Ball
  ctx.shadowColor = '#22d3ee'; ctx.shadowBlur = 15
  ctx.fillStyle = '#22d3ee'
  ctx.beginPath(); ctx.arc(ball.x, ball.y, BALL_R, 0, Math.PI*2); ctx.fill()
  ctx.shadowBlur = 0

  // Scores
  ctx.fillStyle = '#a855f780'; ctx.font = 'bold 48px Orbitron, monospace'
  ctx.fillText(playerScore.value, W/4 - 15, 60)
  ctx.fillStyle = '#f43f5e80'
  ctx.fillText(aiScore.value, 3*W/4 - 15, 60)
}

function onKey(e) { keys[e.key] = e.type === 'keydown' }
window.addEventListener('keydown', onKey)
window.addEventListener('keyup', onKey)
onUnmounted(() => { window.removeEventListener('keydown', onKey); window.removeEventListener('keyup', onKey); cancelAnimationFrame(animId) })
</script>
```

---

## src/views/games/ClickerGame.vue

Idle кликер: ракета, монеты, 4 улучшения.

```vue
<template>
  <div class="min-h-screen py-20 px-4">
    <div class="max-w-2xl mx-auto">
      <RouterLink to="/games" class="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors">← Назад</RouterLink>

      <div class="text-center mb-6">
        <h1 class="font-display font-black text-4xl text-white mb-1">👆 Космический Кликер</h1>
        <p class="text-slate-400 text-sm">Строй флот межзвёздных ракет!</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

        <!-- Click area -->
        <div class="glass-card p-8 flex flex-col items-center justify-center gap-4">
          <div class="font-display font-black text-3xl text-amber-400">
            🪙 {{ formatNum(coins) }}
          </div>
          <div class="text-slate-400 text-sm">+{{ cps }}/сек</div>

          <button
            @click="click"
            class="text-8xl transition-transform duration-75 hover:scale-110 active:scale-95 select-none cursor-pointer"
            style="filter: drop-shadow(0 0 20px #6366f180)"
          >
            🚀
          </button>

          <!-- Click particles -->
          <div class="text-sm text-slate-400">+{{ clickPower }} за клик</div>
        </div>

        <!-- Upgrades -->
        <div class="flex flex-col gap-3">
          <h3 class="font-display font-bold text-white text-lg">🔧 Улучшения</h3>
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
              <p class="text-amber-400 font-bold text-sm">🪙 {{ formatNum(upgrade.cost) }}</p>
            </div>
          </div>
        </div>

      </div>

      <!-- Stats -->
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
import { RouterLink } from 'vue-router'
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
```

---

**Результат:** PongGame.vue + ClickerGame.vue в `src/views/games/`
**Следующий шаг:** T11, T12, T13 (параллельно)
