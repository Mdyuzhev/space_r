# T12 + T13 — Music Player Store (финальные компоненты)

**Проект:** `E:\Politech\space_r`
**Волна:** 5 (параллельно с T11)
**Зависимости:** T03, T04

---

## Цель

Финальные компоненты: MusicPlayer store (уже создан в T01) + проверка integration.

---

## Задача T12 — Проверка MathQuizView (уже в T07)

MathQuizView.vue создан в T07. Убедиться что файл создан по инструкции из task-07.

Дополнительно добавить хранение лучшего результата викторины в useGameStore:

В `src/views/MathQuizView.vue` в функции `nextQuestion()` добавить:
```js
import { useGameStore } from '@/stores/useGameStore.js'
const gameStore = useGameStore()
// В nextQuestion, при finished:
gameStore.setScore('math-quiz', correct.value)
```

---

## Задача T13 — Финальная интеграция MusicPlayer

MusicPlayer компонент создан в T04, store создан в T01.

Проверить что в App.vue:
1. Импортирован `MusicPlayer`
2. Вставлен в template

Добавить в `useMusicStore.js` обработку ошибок аудио:
```js
// В функции toggle() заменить play() вызов:
audio.play().catch(err => {
  console.warn('Audio play failed:', err)
  isPlaying.value = false
})
```

---

## Дополнительно: src/stores/usePlayerStore.js

Хранить прогресс игрока между сессиями:

```js
import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const usePlayerStore = defineStore('player', () => {
  const achievements = ref(JSON.parse(localStorage.getItem('space_r_achievements') || '[]'))
  const visitedPages = ref(JSON.parse(localStorage.getItem('space_r_visited') || '[]'))

  function visit(page) {
    if (!visitedPages.value.includes(page)) {
      visitedPages.value.push(page)
      localStorage.setItem('space_r_visited', JSON.stringify(visitedPages.value))
      checkAchievements()
    }
  }

  function checkAchievements() {
    const all = ['/', '/characters', '/games', '/facts', '/workshop', '/quiz']
    if (all.every(p => visitedPages.value.includes(p))) {
      unlock('explorer')
    }
  }

  function unlock(id) {
    if (!achievements.value.includes(id)) {
      achievements.value.push(id)
      localStorage.setItem('space_r_achievements', JSON.stringify(achievements.value))
    }
  }

  return { achievements, visitedPages, visit, unlock }
})
```

Вызывать `playerStore.visit(route.path)` в App.vue через router watch:
```js
// В App.vue <script setup>:
import { watch } from 'vue'
import { useRoute } from 'vue-router'
import { usePlayerStore } from '@/stores/usePlayerStore.js'

const route = useRoute()
const playerStore = usePlayerStore()
watch(() => route.path, (path) => playerStore.visit(path), { immediate: true })
```

---

## Финальная проверка перед T14

После завершения T01-T13 выполнить:

```bash
npm install
npm run dev
```

Убедиться в консоли браузера: нет Vue warnings, нет 404 для assets.

Если аудио-файлов нет — закомментировать инициализацию аудио в useMusicStore,
оставить кнопку видимой но неактивной.

---

**Результат:** Все stores проверены и интегрированы, App.vue с router tracking
**Следующий шаг:** T14 — Deploy
