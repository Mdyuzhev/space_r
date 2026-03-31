# PLAN: space-r-vue-spa

**Проект:** `E:\Politech\space_r`
**Задача:** Форк Space_roblox → крутое Vue 3 SPA (аналог lab-ecosystem)
**Источник:** https://github.com/MMDyuzhev/Space_roblox

---

## Перед стартом

```bash
# 1. Форкнуть репо студента на GitHub (вручную)
# 2. Скачать assets из форка:
#    images/ → E:\Politech\space_r\public\assets\images\
#    audio/  → E:\Politech\space_r\public\assets\audio\
# 3. Проверить что директория пуста и начать выполнение задач
```

---

## Волны выполнения

### Wave 1 — Setup (выполнять параллельно)

| Таск | Файл | Описание |
|------|------|----------|
| **T01** | `task-01-project-scaffold.md` | package.json, vite.config.js, tailwind, main.js, App.vue, router, stores |
| **T02** | `task-02-assets-and-data.md` | public/assets/ структура + data/*.js (characters, facts, games) |

### Wave 2 — Layout & Components (параллельно, после Wave 1)

| Таск | Файл | Описание |
|------|------|----------|
| **T03** | `task-03-layout-components.md` | AppNavbar, AppFooter, StarBackground, PageTransition |
| **T04** | `task-04-shared-ui.md` | CharacterCard, GameCard, FactCard, Modal, MusicPlayer |

### Wave 3 — Core Pages (параллельно, после Wave 2)

| Таск | Файл | Описание |
|------|------|----------|
| **T05** | `task-05-home-view.md` | HomeView: Hero + Characters preview + Games preview |
| **T06** | `task-06-characters-view.md` | CharactersView: 5 персонажей с деталями |
| **T07** | `task-07-games-hub-facts.md` | GamesHubView + FactsView + MathQuizView |

### Wave 4 — Games (параллельно, после T03)

| Таск | Файл | Описание |
|------|------|----------|
| **T08** | `task-08-tetris-snake.md` | TetrisGame.vue + SnakeGame.vue (Canvas API) |
| **T09** | `task-09-carrace-cosmicdodge.md` | CarRaceGame.vue + CosmicDodgeGame.vue (Canvas API) |
| **T10** | `task-10-pong-clicker.md` | PongGame.vue + ClickerGame.vue |

### Wave 5 — Features (параллельно, после Wave 2)

| Таск | Файл | Описание |
|------|------|----------|
| **T11** | `task-11-workshop.md` | WorkshopView.vue — canvas рисовалка |
| **T12** | `task-12-math-quiz.md` | MathQuizView.vue — викторина умножения |
| **T13** | `task-13-music-player.md` | useMusicStore + MusicPlayer компонент |

### Wave 6 — Deploy (после всего)

| Таск | Файл | Описание |
|------|------|----------|
| **T14** | `task-14-deploy-readme.md` | .github/workflows/deploy.yml + README.md |

---

## Финализация

```bash
cd E:\Politech\space_r
git init
git add .
git commit -m "feat: Vue 3 SPA space_r — initial release"
git remote add origin https://github.com/YOUR_USERNAME/space_r.git
git branch -M main
git push -u origin main
```

---

## QA после завершения

```bash
npm install
npm run dev          # → http://localhost:5173/
npm run build        # → dist/ без ошибок
```

Проверить все роуты: / | /characters | /games | /games/tetris | /games/snake |
/games/car-race | /games/pong | /games/clicker | /games/cosmic-dodge |
/facts | /workshop | /quiz

---

_Контракт: .claude/fitch/space-r-vue-spa/contract.json_
