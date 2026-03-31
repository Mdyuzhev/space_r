<template>
  <div class="min-h-screen py-20 px-4">
    <div class="max-w-4xl mx-auto">

      <div class="text-center mb-8">
        <div class="text-6xl mb-3">🔧</div>
        <h1 class="font-display font-black text-4xl text-white mb-2">Воркшоп Инженера Гайки</h1>
        <p class="text-slate-400">Создавай чертежи космических кораблей!</p>
      </div>

      <!-- Toolbar -->
      <div class="glass-card p-4 mb-4 flex flex-wrap items-center gap-4">
        <div class="flex items-center gap-2">
          <label class="text-slate-400 text-sm">Цвет:</label>
          <input type="color" v-model="color" class="w-10 h-10 rounded-lg cursor-pointer border-0 bg-transparent" />
        </div>

        <div class="flex gap-2">
          <button
            v-for="c in quickColors"
            :key="c"
            @click="color = c"
            class="w-8 h-8 rounded-full border-2 transition-transform hover:scale-110"
            :style="`background: ${c}; border-color: ${color === c ? '#fff' : 'transparent'}`"
          />
        </div>

        <div class="flex items-center gap-2">
          <label class="text-slate-400 text-sm">Размер:</label>
          <input type="range" v-model.number="brushSize" min="1" max="40" class="w-24 accent-cyan-400" />
          <span class="text-slate-400 text-sm w-8">{{ brushSize }}</span>
        </div>

        <div class="flex gap-2">
          <button
            @click="tool = 'brush'"
            class="px-3 py-2 rounded-lg text-sm font-medium transition-all"
            :class="tool === 'brush' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50' : 'text-slate-400 hover:text-white border border-transparent hover:border-slate-600'"
          >Кисть</button>
          <button
            @click="tool = 'eraser'"
            class="px-3 py-2 rounded-lg text-sm font-medium transition-all"
            :class="tool === 'eraser' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50' : 'text-slate-400 hover:text-white border border-transparent hover:border-slate-600'"
          >Ластик</button>
        </div>

        <div class="flex gap-2 ml-auto">
          <button @click="undo" :disabled="historyStack.length === 0" class="px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-white border border-slate-700 hover:border-slate-500 disabled:opacity-30 transition-all">Отмена</button>
          <button @click="clearCanvas" class="px-3 py-2 rounded-lg text-sm text-rose-400 hover:text-rose-300 border border-rose-900 hover:border-rose-700 transition-all">Очистить</button>
          <button @click="save" class="btn-primary text-sm py-2">Сохранить</button>
        </div>
      </div>

      <!-- Canvas -->
      <div class="glass-card p-2 relative">
        <canvas
          ref="canvasRef"
          class="rounded-xl w-full block"
          style="cursor: crosshair; touch-action: none;"
          @mousedown="startDraw"
          @mousemove="drawLine"
          @mouseup="stopDraw"
          @mouseleave="stopDraw"
          @touchstart.prevent="startDraw"
          @touchmove.prevent="drawLine"
          @touchend="stopDraw"
        />
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const canvasRef = ref(null)

const color = ref('#22d3ee')
const brushSize = ref(8)
const tool = ref('brush')
const isDrawing = ref(false)
const historyStack = ref([])

const quickColors = ['#22d3ee', '#a855f7', '#fbbf24', '#10b981', '#f43f5e', '#f97316', '#ffffff', '#334155']

let ctx = null
let lastX = 0, lastY = 0

onMounted(() => {
  const canvas = canvasRef.value
  canvas.width = canvas.offsetWidth * window.devicePixelRatio
  canvas.height = Math.min(500, window.innerHeight * 0.6) * window.devicePixelRatio
  canvas.style.height = Math.min(500, window.innerHeight * 0.6) + 'px'
  ctx = canvas.getContext('2d')
  ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
  ctx.fillStyle = '#0f172a'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = '#1e293b'
  for (let x = 0; x < 2000; x += 30) {
    for (let y = 0; y < 1000; y += 30) {
      ctx.beginPath()
      ctx.arc(x, y, 1, 0, Math.PI * 2)
      ctx.fill()
    }
  }
})

function getPos(e) {
  const rect = canvasRef.value.getBoundingClientRect()
  const touch = e.touches?.[0] ?? e
  return { x: touch.clientX - rect.left, y: touch.clientY - rect.top }
}

function startDraw(e) {
  isDrawing.value = true
  const pos = getPos(e)
  lastX = pos.x; lastY = pos.y
  saveHistory()
}

function drawLine(e) {
  if (!isDrawing.value) return
  const pos = getPos(e)
  ctx.beginPath()
  ctx.moveTo(lastX, lastY)
  ctx.lineTo(pos.x, pos.y)
  ctx.strokeStyle = tool.value === 'eraser' ? '#0f172a' : color.value
  ctx.lineWidth = tool.value === 'eraser' ? brushSize.value * 3 : brushSize.value
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  if (tool.value !== 'eraser') {
    ctx.shadowColor = color.value
    ctx.shadowBlur = 8
  } else {
    ctx.shadowBlur = 0
  }
  ctx.stroke()
  lastX = pos.x; lastY = pos.y
}

function stopDraw() {
  isDrawing.value = false
  if (ctx) ctx.shadowBlur = 0
}

function saveHistory() {
  if (historyStack.value.length > 20) historyStack.value.shift()
  historyStack.value.push(ctx.getImageData(0, 0, canvasRef.value.width, canvasRef.value.height))
}

function undo() {
  if (historyStack.value.length === 0) return
  ctx.putImageData(historyStack.value.pop(), 0, 0)
}

function clearCanvas() {
  saveHistory()
  ctx.fillStyle = '#0f172a'
  ctx.fillRect(0, 0, canvasRef.value.width, canvasRef.value.height)
}

function save() {
  const data = canvasRef.value.toDataURL('image/png')
  const a = document.createElement('a')
  a.href = data
  a.download = `chertezh-${Date.now()}.png`
  a.click()
}
</script>
