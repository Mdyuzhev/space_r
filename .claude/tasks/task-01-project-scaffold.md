# T01 — Project Scaffold

**Проект:** `E:\Politech\space_r`
**Волна:** 1 (параллельно с T02)
**Зависимости:** нет

---

## Цель

Создать полный скелет Vue 3 SPA: конфиги, entrypoint, router, stores, базовый App.vue.

---

## Шаги выполнения

### 1. package.json

```json
{
  "name": "space-r",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "vue": "^3.4.0",
    "vue-router": "^4.3.0",
    "pinia": "^2.1.7",
    "@vueuse/motion": "^2.1.0",
    "lucide-vue-next": "^0.400.0"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.0.4",
    "vite": "^5.2.0",
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.4.19",
    "postcss": "^8.4.38"
  }
}
```

### 2. vite.config.js

```js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  base: '/space_r/',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
```

### 3. tailwind.config.js

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts}'],
  theme: {
    extend: {
      colors: {
        space: {
          950: '#020617',
          900: '#0f172a',
          800: '#1e293b',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Orbitron', 'monospace'],
      },
      animation: {
        'twinkle': 'twinkle 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'spin-slow': 'spin 20s linear infinite',
      },
      keyframes: {
        twinkle: {
          '0%, 100%': { opacity: '0.2' },
          '50%': { opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          'from': { boxShadow: '0 0 10px #22d3ee40' },
          'to':   { boxShadow: '0 0 25px #22d3ee80, 0 0 50px #22d3ee40' },
        }
      },
      backdropBlur: {
        xs: '2px',
      }
    }
  },
  plugins: []
}
```

### 4. postcss.config.js

```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

### 5. index.html

```html
<!DOCTYPE html>
<html lang="ru">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/space_r/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>🚀 Space Roblox</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Orbitron:wght@400;700;900&display=swap" rel="stylesheet" />
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.js"></script>
  </body>
</html>
```

### 6. src/main.js

```js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { MotionPlugin } from '@vueuse/motion'
import router from './router/index.js'
import App from './App.vue'
import './index.css'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(MotionPlugin)
app.mount('#app')
```

### 7. src/index.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html { @apply bg-slate-950 text-slate-100 scroll-smooth; }
  * { @apply box-border; }
}

@layer components {
  .glass-card {
    @apply bg-slate-800/60 backdrop-blur-md border border-slate-700/50 rounded-2xl;
  }
  .neon-text-cyan {
    text-shadow: 0 0 10px #22d3ee80, 0 0 30px #22d3ee40;
  }
  .neon-text-purple {
    text-shadow: 0 0 10px #a855f780, 0 0 30px #a855f740;
  }
  .btn-primary {
    @apply px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/40;
  }
  .btn-secondary {
    @apply px-6 py-3 border border-slate-600 hover:border-purple-500 text-slate-300 hover:text-white font-semibold rounded-xl transition-all duration-200 hover:scale-105;
  }
}
```

### 8. src/router/index.js

```js
import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  { path: '/', component: () => import('@/views/HomeView.vue'), meta: { title: 'Home' } },
  { path: '/characters', component: () => import('@/views/CharactersView.vue'), meta: { title: 'Персонажи' } },
  { path: '/games', component: () => import('@/views/GamesHubView.vue'), meta: { title: 'Игры' } },
  { path: '/games/tetris', component: () => import('@/views/games/TetrisGame.vue'), meta: { title: 'Тетрис' } },
  { path: '/games/snake', component: () => import('@/views/games/SnakeGame.vue'), meta: { title: 'Змейка' } },
  { path: '/games/car-race', component: () => import('@/views/games/CarRaceGame.vue'), meta: { title: 'Гонка машин' } },
  { path: '/games/pong', component: () => import('@/views/games/PongGame.vue'), meta: { title: 'Понг' } },
  { path: '/games/clicker', component: () => import('@/views/games/ClickerGame.vue'), meta: { title: 'Кликер' } },
  { path: '/games/cosmic-dodge', component: () => import('@/views/games/CosmicDodgeGame.vue'), meta: { title: 'Космическое Уклонение' } },
  { path: '/facts', component: () => import('@/views/FactsView.vue'), meta: { title: 'Космические Факты' } },
  { path: '/workshop', component: () => import('@/views/WorkshopView.vue'), meta: { title: 'Воркшоп' } },
  { path: '/quiz', component: () => import('@/views/MathQuizView.vue'), meta: { title: 'Математическая Викторина' } },
]

export default createRouter({
  history: createWebHashHistory('/space_r/'),
  routes,
  scrollBehavior: () => ({ top: 0 })
})
```

### 9. src/stores/useGameStore.js

```js
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useGameStore = defineStore('game', () => {
  const scores = ref({})
  const highScores = ref(JSON.parse(localStorage.getItem('space_r_scores') || '{}'))

  function setScore(game, score) {
    scores.value[game] = score
    if (!highScores.value[game] || score > highScores.value[game]) {
      highScores.value[game] = score
      localStorage.setItem('space_r_scores', JSON.stringify(highScores.value))
    }
  }

  function getHighScore(game) {
    return highScores.value[game] || 0
  }

  return { scores, highScores, setScore, getHighScore }
})
```

### 10. src/stores/useMusicStore.js

```js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useMusicStore = defineStore('music', () => {
  const isPlaying = ref(false)
  const currentTrack = ref(0)
  const tracks = ref([
    { name: 'Space Theme 1', src: '/space_r/assets/audio/track1.mp3' },
    { name: 'Space Theme 2', src: '/space_r/assets/audio/track2.mp3' },
  ])

  let audio = null

  function toggle() {
    if (!audio) {
      audio = new Audio(tracks.value[currentTrack.value].src)
      audio.loop = true
    }
    if (isPlaying.value) {
      audio.pause()
      isPlaying.value = false
    } else {
      audio.play().catch(() => {})
      isPlaying.value = true
    }
  }

  return { isPlaying, currentTrack, tracks, toggle }
})
```

### 11. src/App.vue

```vue
<template>
  <div class="min-h-screen bg-slate-950 text-slate-100 relative overflow-x-hidden">
    <StarBackground />
    <AppNavbar />
    <main class="relative z-10">
      <RouterView v-slot="{ Component }">
        <Transition name="page" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>
    <AppFooter />
    <MusicPlayer />
  </div>
</template>

<script setup>
import StarBackground from '@/components/StarBackground.vue'
import AppNavbar from '@/components/AppNavbar.vue'
import AppFooter from '@/components/AppFooter.vue'
import MusicPlayer from '@/components/MusicPlayer.vue'
</script>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.3s ease;
}
.page-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.page-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
```

### Проверка

```bash
cd E:\Politech\space_r
npm install
npm run dev
# → http://localhost:5173/space_r/ должна открыться (пустая пока)
```

---

**Следующий шаг:** T02 (параллельно), затем T03 + T04.
