# FITCH: Форк Space_roblox → Vue 3 SPA

_Проект: space_r · Дата: 2026-03-31 · Путь: E:\Politech\space_r_

---

## Команда проработки

| Роль        | Статус  | Ключевой вывод |
|-------------|---------|----------------|
| Аналитик    | ✅ done | 15 требований, 10 критериев приёмки |
| Дизайнер    | ✅ done | Тёмная космическая тема, glassmorphism, neon акценты, дизайн-система на Tailwind |
| Тех-лид     | ✅ done | 14 задач в 6 волнах, Vue 3 + Vite + Pinia + Tailwind + Canvas API |
| Тестировщик | ✅ done | 14 проверок, 100% покрытие всех 15 требований |
| DevOps      | ✅ done | GitHub Actions → gh-pages, инструкция по форку |

---

## Требования

| ID  | Требование | Тип | Приоритет |
|-----|-----------|-----|-----------|
| R01 | Форк репо, ассеты (images/, audio/) в public/assets/ | functional | must |
| R02 | Vue 3 SPA scaffold (Vite + Router + Pinia + Tailwind + motion) | technical | must |
| R03 | Home page: Hero + персонажи превью + игры превью | functional | must |
| R04 | Characters page: 5 карточек + expand-панель с деталями | functional | must |
| R05 | Games Hub: 6 игр, карточки с рекордами | functional | must |
| R06 | Все 6 игр играбельны (Тетрис, Змейка, Гонка, Понг, Кликер, Уклонение) | functional | must |
| R07 | Космические факты: 20 штук, пагинация, progress bar | functional | must |
| R08 | Воркшоп: canvas, кисть/ластик/цвет/размер, undo, save PNG | functional | should |
| R09 | Math Quiz: вопросы умножения, 4 варианта, счёт, итог | functional | should |
| R10 | Navbar: sticky, active route, мобильный бургер | ui | must |
| R11 | Music Player: floating кнопка ▶/⏸, фоновая музыка | functional | should |
| R12 | Star Background: анимированные звёзды на всех страницах | ui | must |
| R13 | Responsive: 375px / 768px / 1280px | ui | must |
| R14 | GitHub Actions deploy → GitHub Pages | devops | must |
| R15 | README.md с описанием и командами | docs | should |

---

## Матрица покрытия

| Требование | Задачи | Проверки |
|-----------|--------|----------|
| R01 | T02 | QA01 |
| R02 | T01 | QA02, QA03 |
| R03 | T05 | QA04 |
| R04 | T06 | QA05 |
| R05 | T07 | QA06 |
| R06 | T08, T09, T10 | QA07 |
| R07 | T07 | QA08 |
| R08 | T11 | QA09 |
| R09 | T07, T12 | QA10 |
| R10 | T03 | QA04 |
| R11 | T01 (store), T04 (компонент), T13 | QA11 |
| R12 | T03 | QA04 |
| R13 | T03, T04, T05, T06, T07 | QA12 |
| R14 | T14 | QA13 |
| R15 | T14 | QA14 |

⚠️ Непокрытые требования: **нет** ✅

---

## Технологический стек

```
Vue 3.4          — Composition API, <script setup>
Vite 5           — сборщик
Vue Router 4     — hash-режим (/space_r/#/...)
Pinia 2          — useGameStore, useMusicStore, usePlayerStore
Tailwind CSS 3   — утилити-классы + custom tokens
@vueuse/motion   — page transitions, scroll animations
lucide-vue-next  — иконки
Canvas API       — все 6 игр (без внешних зависимостей)
```

---

## Архитектура

```
src/
├── App.vue                        ← Root + StarBg + Navbar + Footer + MusicPlayer
├── main.js                        ← createApp + Pinia + Router + MotionPlugin
├── index.css                      ← Tailwind + custom classes (glass-card, btn-*)
├── router/index.js                ← 12 роутов, hash history
├── stores/
│   ├── useGameStore.js            ← High scores (localStorage)
│   ├── useMusicStore.js           ← Audio player
│   └── usePlayerStore.js          ← Visited pages, achievements
├── data/
│   ├── characters.js              ← 5 персонажей с полными данными
│   ├── facts.js                   ← 20 космических фактов
│   └── games.js                   ← 6 игр с метаданными
├── components/
│   ├── StarBackground.vue         ← Canvas: 200 звёзд + shooting stars
│   ├── AppNavbar.vue              ← Sticky, blur, active route, mobile burger
│   ├── AppFooter.vue              ← Footer с навигацией
│   ├── CharacterCard.vue          ← Glassmorphism карточка персонажа
│   ├── GameCard.vue               ← Neon карточка игры с рекордом
│   └── MusicPlayer.vue            ← Floating player bottom-right
├── views/
│   ├── HomeView.vue               ← Hero + previews + stats
│   ├── CharactersView.vue         ← Grid + expand-панель
│   ├── GamesHubView.vue           ← Все 6 игр
│   ├── FactsView.vue              ← 20 фактов с пагинацией
│   ├── WorkshopView.vue           ← Canvas рисовалка + gallery
│   ├── MathQuizView.vue           ← Викторина умножения
│   └── games/
│       ├── TetrisGame.vue         ← Canvas, ghost-piece, уровни
│       ├── SnakeGame.vue          ← Canvas, сквозь стены, глазки
│       ├── CarRaceGame.vue        ← Canvas, 3 полосы, нарастающая сложность
│       ├── PongGame.vue           ← Canvas, AI соперник, счёт до 7
│       ├── ClickerGame.vue        ← Idle-кликер, 4 улучшения, auto-earn
│       └── CosmicDodgeGame.vue    ← Canvas, мышь/тач, метеориты, комбо
└── public/assets/
    ├── images/                    ← robot_assistant.png, mexa.png, cap_racketa.png
    └── audio/                     ← track1.mp3, track2.mp3
```

---

## Роуты

| Путь | Компонент |
|------|----------|
| `/#/` | HomeView |
| `/#/characters` | CharactersView |
| `/#/games` | GamesHubView |
| `/#/games/tetris` | TetrisGame |
| `/#/games/snake` | SnakeGame |
| `/#/games/car-race` | CarRaceGame |
| `/#/games/pong` | PongGame |
| `/#/games/clicker` | ClickerGame |
| `/#/games/cosmic-dodge` | CosmicDodgeGame |
| `/#/facts` | FactsView |
| `/#/workshop` | WorkshopView |
| `/#/quiz` | MathQuizView |

_Hash-режим для корректной работы на GitHub Pages без server-side redirect._

---

## План реализации

### Wave 1 — Project Setup (параллельно)

- **T01** `task-01-project-scaffold.md` — package.json, vite, tailwind, main.js, App.vue, router, stores · файлы: 11 файлов конфигурации
- **T02** `task-02-assets-and-data.md` — public/assets/ структура + data/*.js · файлы: characters.js, facts.js, games.js

### Wave 2 — Layout & Components (параллельно, после Wave 1)

- **T03** `task-03-layout-components.md` — StarBackground, AppNavbar, AppFooter · файлы: 3 компонента
- **T04** `task-04-shared-ui.md` — CharacterCard, GameCard, MusicPlayer · файлы: 3 компонента

### Wave 3 — Core Pages (параллельно, после Wave 2)

- **T05** `task-05-home-view.md` → HomeView.vue (Hero, персонажи, игры, статистика)
- **T06** `task-06-characters-view.md` → CharactersView.vue (5 карточек + expand)
- **T07** `task-07-games-hub-facts.md` → GamesHubView + FactsView + MathQuizView

### Wave 4 — Games (параллельно, после T01)

- **T08** `task-08-tetris-snake.md` → TetrisGame.vue + SnakeGame.vue
- **T09** `task-09-carrace-cosmicdodge.md` → CarRaceGame.vue + CosmicDodgeGame.vue
- **T10** `task-10-pong-clicker.md` → PongGame.vue + ClickerGame.vue

### Wave 5 — Features (параллельно, после Wave 2)

- **T11** `task-11-workshop.md` → WorkshopView.vue (canvas рисовалка + gallery)
- **T12-T13** `task-12-13-stores-integration.md` → Stores проверка + PlayerStore + интеграция

### Wave 6 — Deploy (после всего)

- **T14** `task-14-deploy-readme.md` → .github/workflows/deploy.yml + README.md + git init + push

---

## Финализация

```bash
# Перед деплоем убедиться что всё работает:
npm install && npm run dev
npm run build

# Инициализация и деплой:
cd E:\Politech\space_r
git init
git add .
git commit -m "feat: 🚀 Vue 3 SPA space_r — initial release"
git remote add origin https://github.com/YOUR_USERNAME/space_r.git
git branch -M main
git push -u origin main

# В GitHub: Settings → Pages → Source: GitHub Actions
```

---

## Чеклист приёмки

### Инфраструктура
- [ ] [QA01] `ls public/assets/images/` → robot_assistant.png, mexa.png, cap_racketa.png
- [ ] [QA02] `npm run dev` → сервер запущен, нет ошибок в консоли браузера
- [ ] [QA03] `npm run build` → dist/ создан без ошибок сборки

### Страницы
- [ ] [QA04] Открыть `/` → Hero с анимацией, звёзды движутся, секции персонажей и игр видны
- [ ] [QA05] Открыть `/characters` → 5 карточек с фото/emoji, hover-эффект, клик раскрывает панель
- [ ] [QA06] Открыть `/games` → 6 карточек с рекордами (0 при первом запуске)

### Игры
- [ ] [QA07] Открыть каждую из 6 игр, нажать Старт, убедиться что игра запускается, управление работает, Game Over фиксируется:
  - `/games/tetris` — фигуры падают, стрелки управляют, пробел сбрасывает
  - `/games/snake` — змея движется, ест еду, растёт, проходит сквозь стены
  - `/games/car-race` — машины едут, уклонение ← →, столкновение = конец
  - `/games/pong` — мяч летит, ракетки отбивают, счёт до 7
  - `/games/clicker` — клик даёт монеты, покупка улучшений работает
  - `/games/cosmic-dodge` — корабль следует за мышью, метеориты падают

### Фичи
- [ ] [QA08] `/facts` → факт 1/20, кнопки ← → переключают, progress bar движется
- [ ] [QA09] `/workshop` → нарисовать линию → ластик → очистить → сохранить → PNG скачан
- [ ] [QA10] `/quiz` → ответить на 5 вопросов → счёт обновляется → финальный результат виден
- [ ] [QA11] Floating кнопка музыки → включить → иконка ⏸️ → выключить → иконка 🎵
- [ ] [QA12] DevTools → 375px: navbar с бургером, карточки в 1 колонку, игры без overflow

### Деплой
- [ ] [QA13] Push в main → GitHub Actions workflow зелёный → сайт открывается на Pages
- [ ] [QA14] README.md: описание проекта, команды npm install/dev/build присутствуют

---

## Следующий шаг

Открой `E:\Politech\space_r` в Claude Code и выполни:

```
Прочитай .claude/tasks/PLAN-space-r-vue-spa.md и выполни как оркестратор.
Начинай с Wave 1 (T01 + T02 параллельно).
Каждую волну выполняй полностью перед переходом к следующей.
После T14 запусти npm run dev и проверь все QA чеклисты.
```

---

_Контракт: `.claude/fitch/space-r-vue-spa/contract.json`_
_Задачи: `.claude/tasks/task-01-*.md` ... `task-14-*.md`_
