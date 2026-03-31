# T03 — Layout Components

**Проект:** `E:\Politech\space_r`
**Волна:** 2 (параллельно с T04)
**Зависимости:** T01, T02

---

## Цель

Создать AppNavbar, AppFooter, StarBackground — фундамент всего UI.

---

## src/components/StarBackground.vue

Анимированный фон: 150 звёзд + мигание через CSS animation. Используем Canvas API.

```vue
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

  // Генерируем звёзды
  const stars = Array.from({ length: 200 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.5 + 0.3,
    alpha: Math.random(),
    speed: Math.random() * 0.01 + 0.003,
    dir: Math.random() > 0.5 ? 1 : -1,
  }))

  // Shooting stars
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

    // Фоновый градиент
    const grad = ctx.createLinearGradient(0, 0, 0, canvas.height)
    grad.addColorStop(0, '#020617')
    grad.addColorStop(0.5, '#0a0f2e')
    grad.addColorStop(1, '#020617')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Звёзды
    stars.forEach(s => {
      s.alpha += s.speed * s.dir
      if (s.alpha >= 1 || s.alpha <= 0.1) s.dir *= -1
      ctx.beginPath()
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(255,255,255,${s.alpha})`
      ctx.fill()
    })

    // Shooting stars
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
```

---

## src/components/AppNavbar.vue

```vue
<template>
  <nav class="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-800/50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">

        <!-- Logo -->
        <RouterLink to="/" class="flex items-center gap-2 group">
          <span class="text-2xl group-hover:animate-bounce">🚀</span>
          <span class="font-display font-bold text-lg text-white group-hover:text-cyan-400 transition-colors">
            Space<span class="text-cyan-400">Roblox</span>
          </span>
        </RouterLink>

        <!-- Desktop nav -->
        <div class="hidden md:flex items-center gap-1">
          <NavLink to="/">Главная</NavLink>
          <NavLink to="/characters">Персонажи</NavLink>
          <NavLink to="/games">Игры</NavLink>
          <NavLink to="/facts">Факты</NavLink>
          <NavLink to="/workshop">Воркшоп</NavLink>
          <NavLink to="/quiz">Викторина</NavLink>
        </div>

        <!-- Mobile burger -->
        <button
          @click="menuOpen = !menuOpen"
          class="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Меню"
        >
          <component :is="menuOpen ? 'X' : 'Menu'" class="w-5 h-5" />
        </button>

      </div>

      <!-- Mobile menu -->
      <Transition name="slide-down">
        <div v-if="menuOpen" class="md:hidden pb-4 flex flex-col gap-1">
          <MobileNavLink to="/" @click="menuOpen = false">Главная</MobileNavLink>
          <MobileNavLink to="/characters" @click="menuOpen = false">Персонажи</MobileNavLink>
          <MobileNavLink to="/games" @click="menuOpen = false">Игры</MobileNavLink>
          <MobileNavLink to="/facts" @click="menuOpen = false">Факты</MobileNavLink>
          <MobileNavLink to="/workshop" @click="menuOpen = false">Воркшоп</MobileNavLink>
          <MobileNavLink to="/quiz" @click="menuOpen = false">Викторина</MobileNavLink>
        </div>
      </Transition>
    </div>
  </nav>

  <!-- Spacer for fixed navbar -->
  <div class="h-16" />
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { Menu, X } from 'lucide-vue-next'

const menuOpen = ref(false)

// Desktop nav link component (inline)
const NavLink = {
  props: ['to'],
  template: `
    <RouterLink
      :to="to"
      class="px-3 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-all duration-200"
      activeClass="!text-cyan-400 !bg-cyan-400/10"
    ><slot /></RouterLink>
  `
}

const MobileNavLink = {
  props: ['to'],
  emits: ['click'],
  template: `
    <RouterLink
      :to="to"
      @click="$emit('click')"
      class="px-4 py-3 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
      activeClass="!text-cyan-400 !bg-cyan-400/10"
    ><slot /></RouterLink>
  `
}
</script>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active { transition: all 0.2s ease; }
.slide-down-enter-from,
.slide-down-leave-to { opacity: 0; transform: translateY(-10px); }
</style>
```

---

## src/components/AppFooter.vue

```vue
<template>
  <footer class="relative z-10 mt-20 border-t border-slate-800/50 bg-slate-950/80 backdrop-blur-md">
    <div class="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
      <div class="flex items-center gap-2">
        <span class="text-xl">🚀</span>
        <span class="font-display font-bold text-white">SpaceRoblox</span>
      </div>
      <p class="text-slate-500 text-sm text-center">
        Vue 3 SPA · Разработано Ильёй Зяровским · Менторство Flomaster
      </p>
      <div class="flex gap-4 text-slate-500 text-sm">
        <RouterLink to="/games" class="hover:text-cyan-400 transition-colors">Игры</RouterLink>
        <RouterLink to="/facts" class="hover:text-cyan-400 transition-colors">Факты</RouterLink>
        <RouterLink to="/workshop" class="hover:text-cyan-400 transition-colors">Воркшоп</RouterLink>
      </div>
    </div>
  </footer>
</template>
```

---

**Результат:** StarBackground.vue, AppNavbar.vue, AppFooter.vue
**Следующий шаг:** T04 (параллельно), затем T05-T07
