# T08 — Tetris + Snake Games

**Проект:** `E:\Politech\space_r`
**Волна:** 4 (параллельно с T09, T10)
**Зависимости:** T03 (App structure)

---

## Цель

Два Canvas-игровых компонента: Тетрис и Змейка.
Оба должны: запускаться по кнопке, показывать счёт, сохранять рекорд в useGameStore.

---

## Общая обёртка для игровых страниц

Каждая игровая страница использует следующую структуру:

```vue
<template>
  <div class="min-h-screen py-20 px-4">
    <div class="max-w-2xl mx-auto">
      <!-- Back button -->
      <RouterLink to="/games" class="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors">
        ← Назад к играм
      </RouterLink>

      <!-- Header -->
      <div class="text-center mb-6">
        <h1 class="font-display font-black text-4xl text-white">🧱 Тетрис</h1>
        <p class="text-slate-400">Рекорд: {{ gameStore.getHighScore('tetris') }}</p>
      </div>

      <!-- Canvas container -->
      <div class="glass-card p-4 flex justify-center">
        <canvas ref="canvasRef" class="border border-slate-700 rounded-lg" />
      </div>

      <!-- Controls info -->
      <div class="glass-card p-4 mt-4 text-center text-slate-400 text-sm">
        ← → двигать · ↑ повернуть · ↓ ускорить · Пробел — сброс
      </div>
    </div>
  </div>
</template>
```

---

## src/views/games/TetrisGame.vue

Полный Тетрис на Canvas API. Создать файл `src/views/games/TetrisGame.vue` со следующей логикой:

```vue
<template>
  <div class="min-h-screen py-20 px-4">
    <div class="max-w-xl mx-auto">
      <RouterLink to="/games" class="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors">← Назад</RouterLink>

      <div class="text-center mb-6">
        <h1 class="font-display font-black text-4xl text-white mb-1">🧱 Тетрис</h1>
        <div class="flex justify-center gap-8 text-slate-400 text-sm">
          <span>Счёт: <strong class="text-cyan-400">{{ score }}</strong></span>
          <span>Рекорд: <strong class="text-amber-400">{{ gameStore.getHighScore('tetris') }}</strong></span>
          <span>Уровень: <strong class="text-purple-400">{{ level }}</strong></span>
        </div>
      </div>

      <div class="glass-card p-4 flex justify-center relative">
        <canvas ref="canvasRef" :width="COLS * CELL" :height="ROWS * CELL" class="rounded-lg" />

        <!-- Overlay (start/game over) -->
        <div v-if="!running" class="absolute inset-4 flex flex-col items-center justify-center bg-slate-950/80 rounded-lg">
          <div v-if="gameOver" class="text-center mb-6">
            <p class="text-rose-400 font-display font-bold text-2xl mb-2">💥 Игра окончена!</p>
            <p class="text-white text-lg">Счёт: {{ score }}</p>
          </div>
          <button @click="startGame" class="btn-primary text-lg">
            {{ gameOver ? '🔄 Снова' : '▶️ Старт' }}
          </button>
        </div>
      </div>

      <div class="glass-card p-3 mt-4 text-center text-slate-500 text-xs">
        ← → двигать · ↑ повернуть · ↓ ускорить · Пробел — сброс на дно
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useGameStore } from '@/stores/useGameStore.js'

const gameStore = useGameStore()
const canvasRef = ref(null)

const COLS = 10
const ROWS = 20
const CELL = 30

const score = ref(0)
const level = ref(1)
const running = ref(false)
const gameOver = ref(false)

// Tetromino shapes [shape][rotation] — represented as arrays of [row, col] offsets from pivot
const TETROMINOES = {
  I: { color: '#22d3ee', cells: [[0,-1],[0,0],[0,1],[0,2]] },
  O: { color: '#fbbf24', cells: [[0,0],[0,1],[1,0],[1,1]] },
  T: { color: '#a855f7', cells: [[0,0],[-1,0],[0,-1],[0,1]] },
  S: { color: '#10b981', cells: [[0,0],[0,1],[-1,-1],[-1,0]] },
  Z: { color: '#f43f5e', cells: [[0,0],[0,-1],[-1,0],[-1,1]] },
  J: { color: '#6366f1', cells: [[0,0],[0,-1],[0,1],[-1,-1]] },
  L: { color: '#f97316', cells: [[0,0],[0,-1],[0,1],[-1,1]] },
}

let board = []
let piece = null
let animId = null
let dropInterval = 500
let lastDrop = 0

function emptyBoard() {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(null))
}

function randomPiece() {
  const keys = Object.keys(TETROMINOES)
  const key = keys[Math.floor(Math.random() * keys.length)]
  const t = TETROMINOES[key]
  return {
    color: t.color,
    cells: t.cells.map(([r, c]) => [r + 1, c + Math.floor(COLS / 2)]),
  }
}

function isValid(cells) {
  return cells.every(([r, c]) =>
    r >= 0 && r < ROWS && c >= 0 && c < COLS && !board[r][c]
  )
}

function rotatePiece() {
  const rotated = piece.cells.map(([r, c]) => [-c, r])
  const minR = Math.min(...rotated.map(([r]) => r))
  const minC = Math.min(...rotated.map(([,c]) => c))
  const pivot = piece.cells[0]
  const newCells = rotated.map(([r, c]) => [pivot[0] + r - minR, pivot[1] + c - minC])
  // Simplistic rotation: offset from center of current piece
  const centerR = Math.round(piece.cells.reduce((s,[r])=>s+r,0)/piece.cells.length)
  const centerC = Math.round(piece.cells.reduce((s,[,c])=>s+c,0)/piece.cells.length)
  const rotCells = piece.cells.map(([r,c]) => [centerR - (c - centerC), centerC + (r - centerR)])
  if (isValid(rotCells)) piece.cells = rotCells
}

function move(dr, dc) {
  const newCells = piece.cells.map(([r, c]) => [r + dr, c + dc])
  if (isValid(newCells)) { piece.cells = newCells; return true }
  return false
}

function hardDrop() {
  while (move(1, 0)) {}
  lockPiece()
}

function lockPiece() {
  piece.cells.forEach(([r, c]) => { board[r][c] = piece.color })
  clearLines()
  piece = randomPiece()
  if (!isValid(piece.cells)) { endGame(); return }
}

function clearLines() {
  let cleared = 0
  for (let r = ROWS - 1; r >= 0; r--) {
    if (board[r].every(c => c !== null)) {
      board.splice(r, 1)
      board.unshift(Array(COLS).fill(null))
      cleared++; r++
    }
  }
  if (cleared > 0) {
    score.value += [0, 100, 300, 500, 800][cleared] * level.value
    level.value = Math.floor(score.value / 1000) + 1
    dropInterval = Math.max(100, 500 - (level.value - 1) * 50)
    gameStore.setScore('tetris', score.value)
  }
}

function draw() {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')

  // Background
  ctx.fillStyle = '#0f172a'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // Grid
  ctx.strokeStyle = '#1e293b'
  ctx.lineWidth = 0.5
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      ctx.strokeRect(c * CELL, r * CELL, CELL, CELL)
    }
  }

  // Board cells
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (board[r][c]) {
        drawCell(ctx, r, c, board[r][c])
      }
    }
  }

  // Ghost piece
  const ghost = { cells: piece.cells.map(c => [...c]) }
  while (true) {
    const moved = ghost.cells.map(([r, c]) => [r + 1, c])
    if (moved.every(([r, c]) => r >= 0 && r < ROWS && c >= 0 && c < COLS && !board[r][c])) {
      ghost.cells = moved
    } else break
  }
  ghost.cells.forEach(([r, c]) => {
    ctx.fillStyle = piece.color + '30'
    ctx.fillRect(c * CELL + 1, r * CELL + 1, CELL - 2, CELL - 2)
  })

  // Active piece
  piece.cells.forEach(([r, c]) => drawCell(ctx, r, c, piece.color))
}

function drawCell(ctx, r, c, color) {
  ctx.fillStyle = color
  ctx.fillRect(c * CELL + 1, r * CELL + 1, CELL - 2, CELL - 2)
  ctx.fillStyle = 'rgba(255,255,255,0.2)'
  ctx.fillRect(c * CELL + 1, r * CELL + 1, CELL - 2, 4)
  ctx.fillRect(c * CELL + 1, r * CELL + 1, 4, CELL - 2)
}

function gameLoop(ts) {
  if (!running.value) return
  if (ts - lastDrop > dropInterval) {
    if (!move(1, 0)) lockPiece()
    lastDrop = ts
  }
  draw()
  animId = requestAnimationFrame(gameLoop)
}

function startGame() {
  board = emptyBoard()
  score.value = 0
  level.value = 1
  dropInterval = 500
  gameOver.value = false
  piece = randomPiece()
  running.value = true
  lastDrop = performance.now()
  animId = requestAnimationFrame(gameLoop)
}

function endGame() {
  running.value = false
  gameOver.value = true
  cancelAnimationFrame(animId)
}

function onKey(e) {
  if (!running.value) return
  if (e.key === 'ArrowLeft')  move(0, -1)
  if (e.key === 'ArrowRight') move(0, 1)
  if (e.key === 'ArrowDown')  move(1, 0)
  if (e.key === 'ArrowUp')    rotatePiece()
  if (e.key === ' ')          { e.preventDefault(); hardDrop() }
}

window.addEventListener('keydown', onKey)
onUnmounted(() => {
  window.removeEventListener('keydown', onKey)
  cancelAnimationFrame(animId)
})
</script>
```

---

## src/views/games/SnakeGame.vue

```vue
<template>
  <div class="min-h-screen py-20 px-4">
    <div class="max-w-xl mx-auto">
      <RouterLink to="/games" class="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors">← Назад</RouterLink>

      <div class="text-center mb-6">
        <h1 class="font-display font-black text-4xl text-white mb-1">🐍 Змейка</h1>
        <div class="flex justify-center gap-8 text-slate-400 text-sm">
          <span>Счёт: <strong class="text-emerald-400">{{ score }}</strong></span>
          <span>Рекорд: <strong class="text-amber-400">{{ gameStore.getHighScore('snake') }}</strong></span>
        </div>
      </div>

      <div class="glass-card p-4 flex justify-center relative">
        <canvas ref="canvasRef" :width="COLS * CELL" :height="ROWS * CELL" class="rounded-lg" />
        <div v-if="!running" class="absolute inset-4 flex flex-col items-center justify-center bg-slate-950/80 rounded-lg">
          <p v-if="gameOver" class="text-rose-400 font-display font-bold text-2xl mb-4">💀 Конец!</p>
          <button @click="startGame" class="btn-primary">{{ gameOver ? '🔄 Снова' : '▶️ Старт' }}</button>
        </div>
      </div>

      <div class="glass-card p-3 mt-4 text-center text-slate-500 text-xs">
        WASD / стрелки — управление · Змейка проходит сквозь стены
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useGameStore } from '@/stores/useGameStore.js'

const gameStore = useGameStore()
const canvasRef = ref(null)
const COLS = 20, ROWS = 20, CELL = 20
const SPEED = 120  // ms per step (slowed down as per latest commit)

const score = ref(0)
const running = ref(false)
const gameOver = ref(false)

let snake, dir, food, animId, lastStep

function wrap(v, max) { return ((v % max) + max) % max }

function startGame() {
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
  ctx.fillStyle = '#0f172a'
  ctx.fillRect(0, 0, COLS * CELL, ROWS * CELL)

  // Grid
  ctx.strokeStyle = '#1e293b40'
  ctx.lineWidth = 0.5
  for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) ctx.strokeRect(c*CELL, r*CELL, CELL, CELL)

  // Food
  ctx.fillStyle = '#f43f5e'
  ctx.beginPath()
  ctx.arc(food.x * CELL + CELL/2, food.y * CELL + CELL/2, CELL/2 - 2, 0, Math.PI * 2)
  ctx.fill()

  // Snake
  snake.forEach((s, i) => {
    const alpha = 1 - (i / snake.length) * 0.5
    ctx.fillStyle = i === 0 ? '#10b981' : `rgba(16, 185, 129, ${alpha})`
    ctx.beginPath()
    ctx.roundRect(s.x * CELL + 1, s.y * CELL + 1, CELL - 2, CELL - 2, 4)
    ctx.fill()
    if (i === 0) {
      // Eyes
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

window.addEventListener('keydown', onKey)
onUnmounted(() => { window.removeEventListener('keydown', onKey); cancelAnimationFrame(animId) })
</script>
```

---

**Результат:** TetrisGame.vue + SnakeGame.vue в `src/views/games/`
**Следующий шаг:** T09, T10 (параллельно)
