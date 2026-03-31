# T09 — Car Race + Cosmic Dodge Games

**Проект:** `E:\Politech\space_r`
**Волна:** 4 (параллельно с T08, T10)
**Зависимости:** T03

---

## Цель

Создать две Canvas-игры: гонку машин и космическое уклонение.

---

## src/views/games/CarRaceGame.vue

Боковая прокрутка трассы, враги едут навстречу, уклоняться ← →.

```vue
<template>
  <div class="min-h-screen py-20 px-4">
    <div class="max-w-xl mx-auto">
      <RouterLink to="/games" class="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors">← Назад</RouterLink>
      <div class="text-center mb-6">
        <h1 class="font-display font-black text-4xl text-white mb-1">🏎️ Гонка Машин</h1>
        <div class="flex justify-center gap-8 text-slate-400 text-sm">
          <span>Счёт: <strong class="text-rose-400">{{ score }}</strong></span>
          <span>Рекорд: <strong class="text-amber-400">{{ gameStore.getHighScore('car-race') }}</strong></span>
        </div>
      </div>

      <div class="glass-card p-4 flex justify-center relative">
        <canvas ref="canvasRef" width="300" height="500" class="rounded-lg" />
        <div v-if="!running" class="absolute inset-4 flex flex-col items-center justify-center bg-slate-950/80 rounded-lg">
          <p v-if="gameOver" class="text-rose-400 font-display font-bold text-2xl mb-4">💥 Авария!</p>
          <button @click="startGame" class="btn-primary">{{ gameOver ? '🔄 Снова' : '▶️ Старт' }}</button>
        </div>
      </div>
      <div class="glass-card p-3 mt-4 text-center text-slate-500 text-xs">← → или A D — движение</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useGameStore } from '@/stores/useGameStore.js'

const gameStore = useGameStore()
const canvasRef = ref(null)

const score = ref(0)
const running = ref(false)
const gameOver = ref(false)

const W = 300, H = 500
const LANES = [60, 150, 240]
const CAR_W = 40, CAR_H = 70

let player, enemies, roadOffset, speed, animId, frames, keys

function startGame() {
  player = { x: LANES[1], y: H - 100, lane: 1 }
  enemies = []
  roadOffset = 0
  speed = 4
  frames = 0
  score.value = 0
  gameOver.value = false
  keys = {}
  running.value = true
  animId = requestAnimationFrame(loop)
}

function spawnEnemy() {
  const lane = Math.floor(Math.random() * 3)
  enemies.push({ x: LANES[lane], y: -CAR_H, color: ['#f43f5e','#a855f7','#22d3ee'][Math.floor(Math.random()*3)] })
}

function loop() {
  if (!running.value) return
  frames++

  // Input
  if ((keys['ArrowLeft'] || keys['a']) && player.lane > 0) {
    player.lane--; player.x = LANES[player.lane]; keys = {}
  }
  if ((keys['ArrowRight'] || keys['d']) && player.lane < 2) {
    player.lane++; player.x = LANES[player.lane]; keys = {}
  }

  // Road scroll
  roadOffset = (roadOffset + speed) % 40

  // Spawn
  if (frames % Math.max(40, 80 - Math.floor(frames/200)) === 0) spawnEnemy()

  // Move enemies
  enemies.forEach(e => { e.y += speed })
  enemies = enemies.filter(e => e.y < H + CAR_H)

  // Score
  if (frames % 60 === 0) {
    score.value++
    speed = Math.min(12, 4 + score.value * 0.05)
    gameStore.setScore('car-race', score.value)
  }

  // Collision
  const hit = enemies.some(e =>
    Math.abs(e.x - player.x) < CAR_W * 0.8 &&
    Math.abs(e.y - player.y) < CAR_H * 0.8
  )
  if (hit) { running.value = false; gameOver.value = true }

  draw()
  animId = requestAnimationFrame(loop)
}

function drawCar(ctx, x, y, color, isPlayer) {
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.roundRect(x - CAR_W/2, y - CAR_H/2, CAR_W, CAR_H, 8)
  ctx.fill()
  // Windows
  ctx.fillStyle = isPlayer ? '#22d3ee80' : '#00000060'
  ctx.fillRect(x - CAR_W/2 + 5, y - CAR_H/2 + 10, CAR_W - 10, 20)
  // Wheels
  ctx.fillStyle = '#111'
  ;[[-1,-1],[-1,1],[1,-1],[1,1]].forEach(([rx,ry]) => {
    ctx.beginPath()
    ctx.ellipse(x + rx * (CAR_W/2 + 3), y + ry * (CAR_H/2 - 12), 6, 8, 0, 0, Math.PI*2)
    ctx.fill()
  })
}

function draw() {
  const ctx = canvasRef.value?.getContext('2d')
  if (!ctx) return

  // Road
  ctx.fillStyle = '#1e293b'
  ctx.fillRect(0, 0, W, H)

  // Lane dividers
  ctx.strokeStyle = '#fbbf24'
  ctx.setLineDash([20, 20])
  ctx.lineDashOffset = -roadOffset
  ctx.lineWidth = 2
  ;[105, 195].forEach(x => {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke()
  })
  ctx.setLineDash([])

  // Road edges
  ctx.strokeStyle = '#f1f5f9'
  ctx.lineWidth = 3
  ;[20, 280].forEach(x => {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke()
  })

  // Enemies
  enemies.forEach(e => drawCar(ctx, e.x, e.y, e.color, false))

  // Player
  drawCar(ctx, player.x, player.y, '#22d3ee', true)

  // Score overlay
  ctx.fillStyle = '#fff'
  ctx.font = 'bold 16px Inter, sans-serif'
  ctx.fillText(`Счёт: ${score.value}`, 10, 25)
}

function onKey(e) { keys[e.key] = e.type === 'keydown' }
window.addEventListener('keydown', onKey)
window.addEventListener('keyup', onKey)
onUnmounted(() => {
  window.removeEventListener('keydown', onKey)
  window.removeEventListener('keyup', onKey)
  cancelAnimationFrame(animId)
})
</script>
```

---

## src/views/games/CosmicDodgeGame.vue

Корабль следует за мышью/тачем, уклоняется от метеоритов. Комбо-система.

```vue
<template>
  <div class="min-h-screen py-20 px-4">
    <div class="max-w-xl mx-auto">
      <RouterLink to="/games" class="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors">← Назад</RouterLink>
      <div class="text-center mb-6">
        <h1 class="font-display font-black text-4xl text-white mb-1">🚀 Космическое Уклонение</h1>
        <div class="flex justify-center gap-8 text-slate-400 text-sm">
          <span>Время: <strong class="text-indigo-400">{{ time }}с</strong></span>
          <span>Комбо: <strong class="text-cyan-400">x{{ combo }}</strong></span>
          <span>Рекорд: <strong class="text-amber-400">{{ gameStore.getHighScore('cosmic-dodge') }}с</strong></span>
        </div>
      </div>

      <div
        class="glass-card p-4 flex justify-center relative"
        @mousemove="onMouseMove"
        @touchmove.prevent="onTouch"
      >
        <canvas ref="canvasRef" width="400" height="500" class="rounded-lg cursor-none" />
        <div v-if="!running" class="absolute inset-4 flex flex-col items-center justify-center bg-slate-950/80 rounded-lg text-center">
          <div v-if="gameOver" class="mb-4">
            <p class="text-rose-400 font-display font-bold text-2xl mb-1">💥 Метеорит!</p>
            <p class="text-white">Продержался: {{ time }}с</p>
          </div>
          <button @click="startGame" class="btn-primary">{{ gameOver ? '🔄 Снова' : '▶️ Старт' }}</button>
        </div>
      </div>
      <div class="glass-card p-3 mt-4 text-center text-slate-500 text-xs">Двигай мышкой или пальцем</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useGameStore } from '@/stores/useGameStore.js'

const gameStore = useGameStore()
const canvasRef = ref(null)

const time = ref(0)
const combo = ref(1)
const running = ref(false)
const gameOver = ref(false)

const W = 400, H = 500
let ship, meteors, animId, lastTime, frames, targetX, targetY

function startGame() {
  ship = { x: W/2, y: H - 60, r: 18 }
  meteors = []
  frames = 0
  time.value = 0
  combo.value = 1
  gameOver.value = false
  targetX = W/2; targetY = H-60
  running.value = true
  lastTime = performance.now()
  animId = requestAnimationFrame(loop)
}

function spawnMeteor() {
  meteors.push({
    x: Math.random() * W,
    y: -20,
    r: Math.random() * 18 + 10,
    speed: Math.random() * 3 + 2 + (time.value * 0.03),
    rot: 0,
    rotSpeed: (Math.random() - 0.5) * 0.1,
  })
}

function loop(ts) {
  if (!running.value) return
  const dt = ts - lastTime
  lastTime = ts
  frames++

  // Smooth ship follow
  ship.x += (targetX - ship.x) * 0.15
  ship.y += (targetY - ship.y) * 0.15

  // Timer
  time.value = Math.floor((ts - (lastTime - dt)) / 1000 * frames / 60)
  time.value = Math.floor(frames / 60)

  // Combo
  combo.value = Math.min(10, 1 + Math.floor(time.value / 10))

  // Spawn
  const spawnRate = Math.max(20, 80 - Math.floor(frames / 200))
  if (frames % spawnRate === 0) spawnMeteor()

  // Move meteors
  meteors.forEach(m => { m.y += m.speed; m.rot += m.rotSpeed })
  meteors = meteors.filter(m => m.y < H + 30)

  // Collision
  const hit = meteors.some(m => {
    const dx = m.x - ship.x, dy = m.y - ship.y
    return Math.sqrt(dx*dx + dy*dy) < m.r + ship.r - 5
  })
  if (hit) {
    running.value = false
    gameOver.value = true
    gameStore.setScore('cosmic-dodge', time.value)
    cancelAnimationFrame(animId)
    return
  }

  // Record
  if (frames % 60 === 0) gameStore.setScore('cosmic-dodge', time.value)

  draw()
  animId = requestAnimationFrame(loop)
}

function draw() {
  const ctx = canvasRef.value?.getContext('2d')
  if (!ctx) return

  ctx.fillStyle = '#020617'
  ctx.fillRect(0, 0, W, H)

  // Stars bg (simple)
  ctx.fillStyle = '#ffffff20'
  for (let i = 0; i < 50; i++) {
    ctx.fillRect((i * 173) % W, ((i * 97) + frames * 0.5) % H, 1, 1)
  }

  // Meteors
  meteors.forEach(m => {
    ctx.save()
    ctx.translate(m.x, m.y)
    ctx.rotate(m.rot)
    ctx.fillStyle = '#78716c'
    ctx.beginPath()
    const pts = 7
    for (let i = 0; i < pts; i++) {
      const a = (i / pts) * Math.PI * 2
      const r = m.r * (0.7 + Math.sin(a * 3) * 0.3)
      i === 0 ? ctx.moveTo(Math.cos(a)*r, Math.sin(a)*r) : ctx.lineTo(Math.cos(a)*r, Math.sin(a)*r)
    }
    ctx.closePath()
    ctx.fill()
    ctx.restore()
  })

  // Ship
  ctx.save()
  ctx.translate(ship.x, ship.y)
  // Glow
  ctx.shadowColor = '#6366f1'
  ctx.shadowBlur = 20
  // Body
  ctx.fillStyle = '#6366f1'
  ctx.beginPath()
  ctx.moveTo(0, -ship.r)
  ctx.lineTo(ship.r * 0.7, ship.r * 0.8)
  ctx.lineTo(-ship.r * 0.7, ship.r * 0.8)
  ctx.closePath()
  ctx.fill()
  // Engine flame
  ctx.shadowColor = '#fbbf24'
  ctx.shadowBlur = 15
  ctx.fillStyle = '#fbbf24'
  ctx.beginPath()
  ctx.moveTo(-6, ship.r * 0.8)
  ctx.lineTo(6, ship.r * 0.8)
  ctx.lineTo(0, ship.r * 1.5 + Math.sin(frames * 0.3) * 5)
  ctx.closePath()
  ctx.fill()
  ctx.restore()

  // HUD
  ctx.fillStyle = '#f1f5f9'
  ctx.font = 'bold 14px Inter, sans-serif'
  ctx.fillText(`⏱ ${time.value}с`, 10, 25)
  ctx.fillStyle = '#22d3ee'
  ctx.fillText(`x${combo.value} КОМБО`, W - 90, 25)
}

function onMouseMove(e) {
  const rect = canvasRef.value?.getBoundingClientRect()
  if (!rect) return
  targetX = e.clientX - rect.left
  targetY = e.clientY - rect.top
}

function onTouch(e) {
  const rect = canvasRef.value?.getBoundingClientRect()
  if (!rect) return
  targetX = e.touches[0].clientX - rect.left
  targetY = e.touches[0].clientY - rect.top
}

onUnmounted(() => cancelAnimationFrame(animId))
</script>
```

---

**Результат:** CarRaceGame.vue + CosmicDodgeGame.vue в `src/views/games/`
**Следующий шаг:** T10 (параллельно)
