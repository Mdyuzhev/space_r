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
          <p v-if="gameOver" class="text-rose-400 font-display font-bold text-2xl mb-4">Авария!</p>
          <button @click="startGame" class="btn-primary">{{ gameOver ? 'Снова' : 'Старт' }}</button>
        </div>
      </div>
      <div class="glass-card p-3 mt-4 text-center text-slate-500 text-xs">← → или A D — движение</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onUnmounted } from 'vue'
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

  if ((keys['ArrowLeft'] || keys['a']) && player.lane > 0) {
    player.lane--; player.x = LANES[player.lane]; keys = {}
  }
  if ((keys['ArrowRight'] || keys['d']) && player.lane < 2) {
    player.lane++; player.x = LANES[player.lane]; keys = {}
  }

  roadOffset = (roadOffset + speed) % 40
  if (frames % Math.max(40, 80 - Math.floor(frames/200)) === 0) spawnEnemy()

  enemies.forEach(e => { e.y += speed })
  enemies = enemies.filter(e => e.y < H + CAR_H)

  if (frames % 60 === 0) {
    score.value++
    speed = Math.min(12, 4 + score.value * 0.05)
    gameStore.setScore('car-race', score.value)
  }

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
  ctx.fillStyle = isPlayer ? '#22d3ee80' : '#00000060'
  ctx.fillRect(x - CAR_W/2 + 5, y - CAR_H/2 + 10, CAR_W - 10, 20)
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

  ctx.fillStyle = '#1e293b'
  ctx.fillRect(0, 0, W, H)

  ctx.strokeStyle = '#fbbf24'
  ctx.setLineDash([20, 20])
  ctx.lineDashOffset = -roadOffset
  ctx.lineWidth = 2
  ;[105, 195].forEach(x => {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke()
  })
  ctx.setLineDash([])

  ctx.strokeStyle = '#f1f5f9'
  ctx.lineWidth = 3
  ;[20, 280].forEach(x => {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke()
  })

  enemies.forEach(e => drawCar(ctx, e.x, e.y, e.color, false))
  drawCar(ctx, player.x, player.y, '#22d3ee', true)

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
