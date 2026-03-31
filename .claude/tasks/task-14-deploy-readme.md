# T14 — Deploy & README

**Проект:** `E:\Politech\space_r`
**Волна:** 6 (после всех остальных)
**Зависимости:** T01 — T13

---

## Цель

GitHub Actions workflow для автодеплоя на GitHub Pages + README.md.

---

## Шаг 1 — Форк репозитория (ручное действие)

1. Открыть https://github.com/MMDyuzhev/Space_roblox
2. Нажать «Fork» → в свой аккаунт
3. Скачать из форка: `images/` и `audio/`
4. Скопировать в `E:\Politech\space_r\public\assets\`

---

## Шаг 2 — Создать `.github/workflows/deploy.yml`

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

---

## Шаг 3 — Инициализировать git и запушить

```bash
cd E:\Politech\space_r
git init
git add .
git commit -m "feat: 🚀 initial Vue 3 SPA — Space Roblox"
git remote add origin https://github.com/YOUR_USERNAME/space_r.git
git branch -M main
git push -u origin main
```

После пуша:
- GitHub → Settings → Pages → Source: **GitHub Actions**
- Запустится workflow автоматически
- Сайт будет доступен на `https://YOUR_USERNAME.github.io/space_r/`

---

## Шаг 4 — README.md

```markdown
# 🚀 Space Roblox — Vue 3 SPA

> Космическое приключение в стиле Roblox. Переработка [Space_roblox](https://github.com/MMDyuzhev/Space_roblox) студента Ильи Зяровского в полноценное SPA.

![Space Roblox Screenshot](https://YOUR_USERNAME.github.io/space_r/assets/images/screenshot.png)

## 🌌 Демо

**→ [Открыть сайт](https://YOUR_USERNAME.github.io/space_r/)**

## ✨ Возможности

| Раздел | Описание |
|--------|----------|
| 👨‍🚀 Персонажи | 5 уникальных космонавтов с характеристиками и способностями |
| 🎮 Игры | 6 мини-игр: Тетрис, Змейка, Гонка, Понг, Кликер, Космическое Уклонение |
| 🌌 Факты | 20 фактов о Вселенной с анимированной навигацией |
| 🔧 Воркшоп | Canvas рисовалка с инструментами, undo, сохранением |
| 🎓 Викторина | Математическая викторина от Командира Блока |
| 🎵 Музыка | Фоновая космическая музыка (Suno) |

## 🛠️ Технологии

- **Vue 3** (Composition API, `<script setup>`)
- **Vite 5** — быстрая сборка
- **Vue Router 4** — SPA роутинг
- **Pinia** — state management
- **Tailwind CSS** — стилизация
- **@vueuse/motion** — анимации
- **Canvas API** — все игры без зависимостей

## 🚀 Запуск

```bash
git clone https://github.com/YOUR_USERNAME/space_r.git
cd space_r
npm install
npm run dev       # → http://localhost:5173/space_r/
npm run build     # Сборка в dist/
```

## 📁 Структура

```
src/
├── components/     # AppNavbar, StarBackground, CharacterCard, GameCard...
├── views/          # HomeView, CharactersView, GamesHubView, FactsView...
│   └── games/      # TetrisGame, SnakeGame, CarRaceGame, PongGame...
├── stores/         # useGameStore, useMusicStore, usePlayerStore
├── data/           # characters.js, facts.js, games.js
└── router/         # index.js
```

## 👨‍💻 Авторы

- **Илья Зяровский** — оригинальный проект Space_roblox
- **Flomaster** — архитектура, менторство

---

*Разработано в рамках образовательного менторства. 2026.*
```

---

**Результат:** `.github/workflows/deploy.yml` + `README.md` + инициализированный git репозиторий
**Проект готов к деплою!**
