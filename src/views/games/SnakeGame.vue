<template>
  <div class="min-h-screen py-20 px-4">
    <div class="w-full md:w-[62%] mx-auto">
      <RouterLink to="/games" class="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors">← Назад</RouterLink>

      <div class="text-center mb-6">
        <h1 class="font-display font-black text-4xl text-white mb-1">🐍 Змейка</h1>
        <div class="flex justify-center gap-8 text-slate-400 text-sm">
          <span>Счёт: <strong class="text-emerald-400">{{ score }}</strong></span>
          <span>Рекорд: <strong class="text-amber-400">{{ gameStore.getHighScore('snake') }}</strong></span>
        </div>
      </div>

      <div class="glass-card p-4 flex justify-center relative">
        <canvas
          ref="canvasRef"
          :width="canvasWidth"
          :height="canvasHeight"
          class="rounded-lg w-full"
          @touchstart="onSwipeStart"
          @touchend.prevent="onSwipeEnd"
        />
        <div v-if="!running" class="absolute inset-4 flex flex-col items-center justify-center bg-slate-950/80 rounded-lg">
          <p v-if="gameOver" class="text-rose-400 font-display font-bold text-2xl mb-4">Конец!</p>
          <button @click="startGame" class="btn-primary">{{ gameOver ? 'Снова' : 'Старт' }}</button>
        </div>
      </div>

      <GameDpad layout="arrows" @press="onDpadPress" />

      <div class="glass-card p-3 mt-4 text-center text-slate-500 text-xs">
        <span class="hidden md:inline">WASD / стрелки — управление · Змейка проходит сквозь стены</span>
        <span class="md:hidden">Свайп или D-pad для управления</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onUnmounted } from 'vue'
import { useGameStore } from '@/stores/useGameStore.js'
import { useGameCanvas } from '@/composables/useGameCanvas.js'
import GameDpad from '@/components/GameDpad.vue'

const gameStore = useGameStore()
const canvasRef = ref(null)
const COLS = 20, ROWS = 20
let CELL = 20
const SPEED = 120

const { canvasWidth, canvasHeight } = useGameCanvas({ aspectRatio: 1, minSize: 280, maxSize: 600 })

const score = ref(0)
const running = ref(false)
const gameOver = ref(false)

let snake, dir, food, animId, lastStep

function wrap(v, max) { return ((v % max) + max) % max }

function startGame() {
  CELL = Math.floor(canvasWidth.value / COLS)
  snake = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }]
  dir = { x: 1, y: 0 }
  score.value = 0
  gameOver.value = false
  placeFood()
  running.value = true
  lastStep = performance.now()
  animId = requestAnimationFrame(loop)
}

function placeFood() {
  do {
    food = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) }
  } while (snake.some(s => s.x === food.x && s.y === food.y))
}

function step() {
  const head = { x: wrap(snake[0].x + dir.x, COLS), y: wrap(snake[0].y + dir.y, ROWS) }
  if (snake.some(s => s.x === head.x && s.y === head.y)) {
    running.value = false; gameOver.value = true
    cancelAnimationFrame(animId); return
  }
  snake.unshift(head)
  if (head.x === food.x && head.y === food.y) {
    score.value += 10
    gameStore.setScore('snake', score.value)
    placeFood()
  } else {
    snake.pop()
  }
}

function draw() {
  const ctx = canvasRef.value?.getContext('2d')
  if (!ctx) return
  CELL = Math.floor(canvasWidth.value / COLS)
  const W = COLS * CELL, H = ROWS * CELL

  ctx.fillStyle = '#0f172a'
  ctx.fillRect(0, 0, W, H)

  ctx.strokeStyle = '#1e293b40'
  ctx.lineWidth = 0.5
  for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) ctx.strokeRect(c*CELL, r*CELL, CELL, CELL)

  ctx.fillStyle = '#f43f5e'
  ctx.beginPath()
  ctx.arc(food.x * CELL + CELL/2, food.y * CELL + CELL/2, CELL/2 - 2, 0, Math.PI * 2)
  ctx.fill()

  snake.forEach((s, i) => {
    const alpha = 1 - (i / snake.length) * 0.5
    ctx.fillStyle = i === 0 ? '#10b981' : `rgba(16, 185, 129, ${alpha})`
    ctx.beginPath()
    ctx.roundRect(s.x * CELL + 1, s.y * CELL + 1, CELL - 2, CELL - 2, 4)
    ctx.fill()
    if (i === 0) {
      ctx.fillStyle = '#fff'
      const eyeOffX = dir.x !== 0 ? dir.x * 5 : 0
      const eyeOffY = dir.y !== 0 ? dir.y * 5 : 0
      ctx.beginPath()
      ctx.arc(s.x * CELL + CELL/2 - 3 + eyeOffX, s.y * CELL + CELL/2 - 3 + eyeOffY, 2, 0, Math.PI*2)
      ctx.arc(s.x * CELL + CELL/2 + 3 + eyeOffX, s.y * CELL + CELL/2 - 3 + eyeOffY, 2, 0, Math.PI*2)
      ctx.fill()
    }
  })
}

function loop(ts) {
  if (!running.value) return
  if (ts - lastStep >= SPEED) { step(); lastStep = ts }
  draw()
  animId = requestAnimationFrame(loop)
}

// Keyboard
const KEY_MAP = {
  ArrowLeft:  { x: -1, y:  0 }, a: { x: -1, y:  0 },
  ArrowRight: { x:  1, y:  0 }, d: { x:  1, y:  0 },
  ArrowUp:    { x:  0, y: -1 }, w: { x:  0, y: -1 },
  ArrowDown:  { x:  0, y:  1 }, s: { x:  0, y:  1 },
}
function onKey(e) {
  const d = KEY_MAP[e.key]
  if (d && !(d.x === -dir.x && d.y === -dir.y)) dir = d
}

// D-pad
function onDpadPress(btn) {
  const map = { up: {x:0,y:-1}, down: {x:0,y:1}, left: {x:-1,y:0}, right: {x:1,y:0} }
  const d = map[btn]
  if (d && !(d.x === -dir.x && d.y === -dir.y)) dir = d
}

// Swipe
let swipeStartX = 0, swipeStartY = 0
function onSwipeStart(e) {
  swipeStartX = e.touches[0].clientX
  swipeStartY = e.touches[0].clientY
}
function onSwipeEnd(e) {
  if (!running.value) return
  const dx = e.changedTouches[0].clientX - swipeStartX
  const dy = e.changedTouches[0].clientY - swipeStartY
  if (Math.abs(dx) < 30 && Math.abs(dy) < 30) return
  if (Math.abs(dx) > Math.abs(dy)) {
    const newDir = dx > 0 ? { x: 1, y: 0 } : { x: -1, y: 0 }
    if (!(newDir.x === -dir.x && newDir.y === -dir.y)) dir = newDir
  } else {
    const newDir = dy > 0 ? { x: 0, y: 1 } : { x: 0, y: -1 }
    if (!(newDir.x === -dir.x && newDir.y === -dir.y)) dir = newDir
  }
}

window.addEventListener('keydown', onKey)
onUnmounted(() => { window.removeEventListener('keydown', onKey); cancelAnimationFrame(animId) })
</script>
