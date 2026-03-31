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
            <p class="text-rose-400 font-display font-bold text-2xl mb-1">Метеорит!</p>
            <p class="text-white">Продержался: {{ time }}с</p>
          </div>
          <button @click="startGame" class="btn-primary">{{ gameOver ? 'Снова' : 'Старт' }}</button>
        </div>
      </div>
      <div class="glass-card p-3 mt-4 text-center text-slate-500 text-xs">Двигай мышкой или пальцем</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onUnmounted } from 'vue'
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
  frames++

  ship.x += (targetX - ship.x) * 0.15
  ship.y += (targetY - ship.y) * 0.15

  time.value = Math.floor(frames / 60)
  combo.value = Math.min(10, 1 + Math.floor(time.value / 10))

  const spawnRate = Math.max(20, 80 - Math.floor(frames / 200))
  if (frames % spawnRate === 0) spawnMeteor()

  meteors.forEach(m => { m.y += m.speed; m.rot += m.rotSpeed })
  meteors = meteors.filter(m => m.y < H + 30)

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

  if (frames % 60 === 0) gameStore.setScore('cosmic-dodge', time.value)

  draw()
  animId = requestAnimationFrame(loop)
}

function draw() {
  const ctx = canvasRef.value?.getContext('2d')
  if (!ctx) return

  ctx.fillStyle = '#020617'
  ctx.fillRect(0, 0, W, H)

  ctx.fillStyle = '#ffffff20'
  for (let i = 0; i < 50; i++) {
    ctx.fillRect((i * 173) % W, ((i * 97) + frames * 0.5) % H, 1, 1)
  }

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

  ctx.save()
  ctx.translate(ship.x, ship.y)
  ctx.shadowColor = '#6366f1'
  ctx.shadowBlur = 20
  ctx.fillStyle = '#6366f1'
  ctx.beginPath()
  ctx.moveTo(0, -ship.r)
  ctx.lineTo(ship.r * 0.7, ship.r * 0.8)
  ctx.lineTo(-ship.r * 0.7, ship.r * 0.8)
  ctx.closePath()
  ctx.fill()
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

  ctx.fillStyle = '#f1f5f9'
  ctx.font = 'bold 14px Inter, sans-serif'
  ctx.fillText(`${time.value}с`, 10, 25)
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
