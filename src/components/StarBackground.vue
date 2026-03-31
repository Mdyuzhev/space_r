<template>
  <canvas
    ref="canvasRef"
    class="fixed inset-0 w-full h-full pointer-events-none z-0"
    aria-hidden="true"
  />
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const canvasRef = ref(null)
let animationId = null

onMounted(() => {
  const canvas = canvasRef.value
  const ctx = canvas.getContext('2d')

  const resize = () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }
  resize()
  window.addEventListener('resize', resize)

  const stars = Array.from({ length: 200 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.5 + 0.3,
    alpha: Math.random(),
    speed: Math.random() * 0.01 + 0.003,
    dir: Math.random() > 0.5 ? 1 : -1,
  }))

  const shootingStars = []
  let nextShoot = Date.now() + 3000

  function spawnShooting() {
    shootingStars.push({
      x: Math.random() * canvas.width * 0.7,
      y: Math.random() * canvas.height * 0.3,
      len: Math.random() * 80 + 60,
      speed: Math.random() * 8 + 6,
      alpha: 1,
      angle: Math.PI / 4 + (Math.random() - 0.5) * 0.3,
    })
    nextShoot = Date.now() + Math.random() * 4000 + 2000
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const grad = ctx.createLinearGradient(0, 0, 0, canvas.height)
    grad.addColorStop(0, '#020617')
    grad.addColorStop(0.5, '#0a0f2e')
    grad.addColorStop(1, '#020617')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    stars.forEach(s => {
      s.alpha += s.speed * s.dir
      if (s.alpha >= 1 || s.alpha <= 0.1) s.dir *= -1
      ctx.beginPath()
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(255,255,255,${s.alpha})`
      ctx.fill()
    })

    if (Date.now() > nextShoot) spawnShooting()
    for (let i = shootingStars.length - 1; i >= 0; i--) {
      const ss = shootingStars[i]
      ss.x += Math.cos(ss.angle) * ss.speed
      ss.y += Math.sin(ss.angle) * ss.speed
      ss.alpha -= 0.02
      if (ss.alpha <= 0) { shootingStars.splice(i, 1); continue }
      ctx.beginPath()
      ctx.moveTo(ss.x, ss.y)
      ctx.lineTo(ss.x - Math.cos(ss.angle) * ss.len, ss.y - Math.sin(ss.angle) * ss.len)
      const lineGrad = ctx.createLinearGradient(ss.x, ss.y, ss.x - Math.cos(ss.angle) * ss.len, ss.y - Math.sin(ss.angle) * ss.len)
      lineGrad.addColorStop(0, `rgba(255,255,255,${ss.alpha})`)
      lineGrad.addColorStop(1, 'rgba(255,255,255,0)')
      ctx.strokeStyle = lineGrad
      ctx.lineWidth = 1.5
      ctx.stroke()
    }

    animationId = requestAnimationFrame(draw)
  }

  draw()

  onUnmounted(() => {
    cancelAnimationFrame(animationId)
    window.removeEventListener('resize', resize)
  })
})
</script>
