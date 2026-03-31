# Space Roblox — Vue 3 SPA

> Космическое приключение в стиле Roblox. Переработка [Space_roblox](https://github.com/MMDyuzhev/Space_roblox) в полноценное SPA.

## Возможности

| Раздел | Описание |
|--------|----------|
| Персонажи | 5 уникальных космонавтов с характеристиками и способностями |
| Игры | 6 мини-игр: Тетрис, Змейка, Гонка, Понг, Кликер, Космическое Уклонение |
| Факты | 20 фактов о Вселенной с анимированной навигацией |
| Воркшоп | Canvas рисовалка с инструментами, undo, сохранением |
| Викторина | Математическая викторина от Командира Блока |
| Музыка | Фоновая космическая музыка |

## Технологии

- **Vue 3** (Composition API, `<script setup>`)
- **Vite 5** — быстрая сборка
- **Vue Router 4** — SPA роутинг
- **Pinia** — state management
- **Tailwind CSS** — стилизация
- **@vueuse/motion** — анимации
- **Canvas API** — все игры без зависимостей

## Запуск

```bash
git clone https://github.com/YOUR_USERNAME/space_r.git
cd space_r
npm install
npm run dev       # http://localhost:5173/space_r/
npm run build     # Сборка в dist/
```

## Структура

```
src/
├── components/     # AppNavbar, StarBackground, CharacterCard, GameCard...
├── views/          # HomeView, CharactersView, GamesHubView, FactsView...
│   └── games/      # TetrisGame, SnakeGame, CarRaceGame, PongGame...
├── stores/         # useGameStore, useMusicStore, usePlayerStore
├── data/           # characters.js, facts.js, games.js
└── router/         # index.js
```
