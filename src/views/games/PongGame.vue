<template>
  <div class="min-h-screen py-20 px-4">
    <div class="w-full md:w-[62%] mx-auto">
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
        <canvas
          ref="canvasRef"
          :width="canvasWidth"
          :height="canvasHeight"
          class="rounded-lg w-full"
          @touchmove.prevent="onTouchMove"
        />
        <div v-if="!running" class="absolute inset-4 flex flex-col items-center justify-center bg-slate-950/80 rounded-lg text-center">
          <p v-if="message" class="text-white font-display font-bold text-xl mb-4">{{ message }}</p>
          <button @click="startGame" class="btn-primary">{{ playerScore + aiScore > 0 ? 'Снова' : 'Старт' }}</button>
        </div>
      </div>

      <div class="glass-card p-3 mt-4 text-center text-slate-500 text-xs">
        <span class="hidden md:inline">W/S или стрелки ↑↓ — ракетка</span>
        <span class="md:hidden">Тяни пальцем по игровому полю ↑↓</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onUnmounted } from 'vue'
import { useGameStore } from '@/stores/useGameStore.js'
import { useGameCanvas } from '@/composables/useGameCanvas.js'

const gameStore = useGameStore()
const canvasRef = ref(null)

const { canvasWidth, canvasHeight } = useGameCanvas({ aspectRatio: 1.1, minSize: 280, maxSize: 700 })

const playerScore = ref(0)
const aiScore = ref(0)
const running = ref(false)
const message = ref('')

const PAD_W = 12, PAD_H = 70, BALL_R = 8

let player, ai, ball, animId, keys

function startBall(dir = 1) {
  const W = canvasWidth.value, H = canvasHeight.value
  const angle = (Math.random() * 0.4 - 0.2)
  ball = {
    x: W/2, y: H/2,
    vx: dir * (4 + Math.random() * 2),
    vy: Math.sin(angle) * 4,
  }
}

function startGame() {
  const H = canvasHeight.value
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
  const W = canvasWidth.value, H = canvasHeight.value

  const speed = 6
  if (keys['ArrowUp'] || keys['w']) player.y = Math.max(0, player.y - speed)
  if (keys['ArrowDown'] || keys['s']) player.y = Math.min(H - PAD_H, player.y + speed)

  const aiCenter = ai.y + PAD_H/2
  if (aiCenter < ball.y - 5) ai.y = Math.min(H - PAD_H, ai.y + 3.5)
  if (aiCenter > ball.y + 5) ai.y = Math.max(0, ai.y - 3.5)

  ball.x += ball.vx
  ball.y += ball.vy

  if (ball.y - BALL_R < 0) { ball.y = BALL_R; ball.vy *= -1 }
  if (ball.y + BALL_R > H) { ball.y = H - BALL_R; ball.vy *= -1 }

  if (ball.x - BALL_R < PAD_W + 10 && ball.y > player.y && ball.y < player.y + PAD_H && ball.vx < 0) {
    ball.vx = Math.abs(ball.vx) * 1.05
    ball.vy += ((ball.y - (player.y + PAD_H/2)) / PAD_H) * 4
  }

  if (ball.x + BALL_R > W - PAD_W - 10 && ball.y > ai.y && ball.y < ai.y + PAD_H && ball.vx > 0) {
    ball.vx = -Math.abs(ball.vx) * 1.05
    ball.vy += ((ball.y - (ai.y + PAD_H/2)) / PAD_H) * 4
  }

  ball.vy = Math.max(-8, Math.min(8, ball.vy))

  if (ball.x < 0) {
    aiScore.value++
    if (aiScore.value >= 7) { message.value = 'AI победил!'; running.value = false; return }
    startBall(1)
  }
  if (ball.x > W) {
    playerScore.value++
    gameStore.setScore('pong', playerScore.value)
    if (playerScore.value >= 7) { message.value = 'Ты победил!'; running.value = false; return }
    startBall(-1)
  }

  draw()
  animId = requestAnimationFrame(loop)
}

function draw() {
  const ctx = canvasRef.value?.getContext('2d')
  if (!ctx) return
  const W = canvasWidth.value, H = canvasHeight.value

  ctx.fillStyle = '#0f172a'
  ctx.fillRect(0, 0, W, H)

  ctx.setLineDash([10, 10])
  ctx.strokeStyle = '#334155'
  ctx.lineWidth = 2
  ctx.beginPath(); ctx.moveTo(W/2, 0); ctx.lineTo(W/2, H); ctx.stroke()
  ctx.setLineDash([])

  ctx.fillStyle = '#a855f7'
  ctx.beginPath(); ctx.roundRect(10, player.y, PAD_W, PAD_H, 4); ctx.fill()
  ctx.fillStyle = '#f43f5e'
  ctx.beginPath(); ctx.roundRect(W - PAD_W - 10, ai.y, PAD_W, PAD_H, 4); ctx.fill()

  ctx.shadowColor = '#22d3ee'; ctx.shadowBlur = 15
  ctx.fillStyle = '#22d3ee'
  ctx.beginPath(); ctx.arc(ball.x, ball.y, BALL_R, 0, Math.PI*2); ctx.fill()
  ctx.shadowBlur = 0

  ctx.fillStyle = '#a855f780'; ctx.font = 'bold 48px Orbitron, monospace'
  ctx.fillText(playerScore.value, W/4 - 15, 60)
  ctx.fillStyle = '#f43f5e80'
  ctx.fillText(aiScore.value, 3*W/4 - 15, 60)
}

// Touch drag
function onTouchMove(e) {
  if (!running.value) return
  const rect = canvasRef.value.getBoundingClientRect()
  const touchY = e.touches[0].clientY - rect.top
  const scale = canvasHeight.value / rect.height
  player.y = Math.max(0, Math.min(canvasHeight.value - PAD_H, touchY * scale - PAD_H / 2))
}

function onKey(e) { keys[e.key] = e.type === 'keydown' }
window.addEventListener('keydown', onKey)
window.addEventListener('keyup', onKey)
onUnmounted(() => { window.removeEventListener('keydown', onKey); window.removeEventListener('keyup', onKey); cancelAnimationFrame(animId) })
</script>
