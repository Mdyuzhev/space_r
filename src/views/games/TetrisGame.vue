<template>
  <div class="min-h-screen py-20 px-4">
    <div class="w-full md:w-[62%] mx-auto">
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
        <canvas
          ref="canvasRef"
          :width="canvasWidth"
          :height="canvasHeight"
          class="rounded-lg w-full"
          @touchstart="onTouchStart"
          @touchend.prevent="onTouchEnd"
        />
        <div v-if="!running" class="absolute inset-4 flex flex-col items-center justify-center bg-slate-950/80 rounded-lg">
          <div v-if="gameOver" class="text-center mb-6">
            <p class="text-rose-400 font-display font-bold text-2xl mb-2">Игра окончена!</p>
            <p class="text-white text-lg">Счёт: {{ score }}</p>
          </div>
          <button @click="startGame" class="btn-primary text-lg">
            {{ gameOver ? 'Снова' : 'Старт' }}
          </button>
        </div>
      </div>

      <GameDpad layout="arrows" @press="onDpadPress" />

      <div class="glass-card p-3 mt-4 text-center text-slate-500 text-xs">
        <span class="hidden md:inline">← → двигать · ↑ повернуть · ↓ ускорить · Пробел — сброс на дно</span>
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

const COLS = 10
const ROWS = 20
let CELL = 30

const { canvasWidth, canvasHeight } = useGameCanvas({ aspectRatio: 2, minSize: 280, maxSize: 500 })

const score = ref(0)
const level = ref(1)
const running = ref(false)
const gameOver = ref(false)

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
  CELL = Math.floor(canvasWidth.value / COLS)

  ctx.fillStyle = '#0f172a'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  ctx.strokeStyle = '#1e293b'
  ctx.lineWidth = 0.5
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      ctx.strokeRect(c * CELL, r * CELL, CELL, CELL)
    }
  }

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (board[r][c]) drawCellFn(ctx, r, c, board[r][c])
    }
  }

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

  piece.cells.forEach(([r, c]) => drawCellFn(ctx, r, c, piece.color))
}

function drawCellFn(ctx, r, c, color) {
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
  CELL = Math.floor(canvasWidth.value / COLS)
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

// Keyboard
function onKey(e) {
  if (!running.value) return
  if (e.key === 'ArrowLeft')  move(0, -1)
  if (e.key === 'ArrowRight') move(0, 1)
  if (e.key === 'ArrowDown')  move(1, 0)
  if (e.key === 'ArrowUp')    rotatePiece()
  if (e.key === ' ')          { e.preventDefault(); hardDrop() }
}

// D-pad
function onDpadPress(btn) {
  if (!running.value) return
  if (btn === 'left')   move(0, -1)
  if (btn === 'right')  move(0,  1)
  if (btn === 'down')   move(1,  0)
  if (btn === 'up')     move(1,  0)
  if (btn === 'rotate') rotatePiece()
}

// Swipe
let touchStartX = 0, touchStartY = 0
function onTouchStart(e) {
  touchStartX = e.touches[0].clientX
  touchStartY = e.touches[0].clientY
}
function onTouchEnd(e) {
  if (!running.value) return
  const dx = e.changedTouches[0].clientX - touchStartX
  const dy = e.changedTouches[0].clientY - touchStartY
  const absDx = Math.abs(dx), absDy = Math.abs(dy)

  if (absDx < 10 && absDy < 10) { rotatePiece(); return }

  if (absDx > absDy) {
    move(0, dx > 0 ? 1 : -1)
  } else {
    if (dy > 0) hardDrop()
  }
}

window.addEventListener('keydown', onKey)
onUnmounted(() => {
  window.removeEventListener('keydown', onKey)
  cancelAnimationFrame(animId)
})
</script>
