# T02 — Assets & Data

**Проект:** `E:\Politech\space_r`
**Волна:** 1 (параллельно с T01)
**Зависимости:** нет

---

## Цель

Создать структуру public/assets/ и заполнить data-файлы со всеми данными проекта.

---

## Шаг 1 — Структура assets

```
public/
  assets/
    images/
      robot_assistant.png   ← скопировать из форка
      mexa.png              ← скопировать из форка
      cap_racketa.png       ← скопировать из форка
      favicon.svg           ← создать (ракета SVG)
    audio/
      track1.mp3            ← скопировать из форка (Suno)
      track2.mp3            ← скопировать из форка (Suno, если есть)
```

Создать директории:
```bash
mkdir -p public/assets/images
mkdir -p public/assets/audio
```

Скопировать файлы из форка (предполагается что они уже в public/assets/ после ручного копирования).

Если аудио-файлов нет или имена другие — адаптировать useMusicStore.js соответственно.

Создать `public/assets/images/favicon.svg`:
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <text y=".9em" font-size="90">🚀</text>
</svg>
```

---

## Шаг 2 — src/data/characters.js

```js
export const characters = [
  {
    id: 'commander-block',
    name: 'Командир Блок',
    role: 'Капитан',
    emoji: '👨‍🚀',
    image: null,
    description: 'Легендарный исследователь космоса. Первый роблоксиец на Марсе!',
    stats: { experience: 5, missions: 156, rank: 'Командор' },
    ability: { name: 'Математическая Викторина', route: '/quiz', icon: '🎓' },
    color: 'cyan',
    accentColor: '#22d3ee',
  },
  {
    id: 'lt-star',
    name: 'Лейтенант Звезда',
    role: 'Штурман',
    emoji: '👩‍🚀',
    image: null,
    description: 'Мастер навигации по галактикам. Знает все звёздные системы!',
    stats: { experience: 4, missions: 124, rank: 'Лейтенант' },
    ability: { name: 'Космические Факты', route: '/facts', icon: '🌌' },
    color: 'purple',
    accentColor: '#a855f7',
  },
  {
    id: 'robo-helper',
    name: 'Робо-Помощник',
    role: 'Инженер ИИ',
    emoji: null,
    image: '/space_r/assets/images/robot_assistant.png',
    description: 'Искусственный интеллект корабля. Всегда готов к приключениям!',
    stats: { experience: 4, missions: 200, rank: 'ИИ 3.0' },
    ability: { name: 'Игры', route: '/games', icon: '🎮' },
    color: 'emerald',
    accentColor: '#10b981',
  },
  {
    id: 'engineer-gaika',
    name: 'Инженер Гайка',
    role: 'Механик',
    emoji: null,
    image: '/space_r/assets/images/mexa.png',
    description: 'Главный механик флота. Чинит всё от шурупов до гипердвигателя!',
    stats: { experience: 5, missions: 189, rank: 'Главный Инженер' },
    ability: { name: 'Воркшоп', route: '/workshop', icon: '🔧' },
    color: 'amber',
    accentColor: '#fbbf24',
  },
  {
    id: 'captain-flat',
    name: 'Капитан Флэт',
    role: 'Пилот',
    emoji: null,
    image: '/space_r/assets/images/cap_racketa.png',
    description: 'Легендарный пилот галактики. Может уклониться от любого метеорита!',
    stats: { experience: 5, missions: 210, rank: 'Ас Пилотажа' },
    ability: { name: 'Космическое Уклонение', route: '/games/cosmic-dodge', icon: '🚀' },
    color: 'rose',
    accentColor: '#f43f5e',
  },
]
```

---

## Шаг 3 — src/data/facts.js

```js
export const facts = [
  { id: 1, text: 'Солнце настолько велико, что внутри него поместилось бы около 1,3 миллиона Земель.', icon: '☀️' },
  { id: 2, text: 'Звук не может распространяться в открытом космосе — там абсолютная тишина.', icon: '🔇' },
  { id: 3, text: 'Один день на Венере длиннее одного года на Венере.', icon: '🪐' },
  { id: 4, text: 'Нейтронная звезда вращается со скоростью до 600 оборотов в секунду.', icon: '⭐' },
  { id: 5, text: 'Большое Красное Пятно Юпитера — это шторм, который бушует более 350 лет.', icon: '🌪️' },
  { id: 6, text: 'На Марсе находится самый высокий вулкан в Солнечной системе — Олимп, высотой 21 км.', icon: '🌋' },
  { id: 7, text: 'Расстояние от Земли до Луны составляет около 384 400 км.', icon: '🌙' },
  { id: 8, text: 'В Млечном Пути насчитывается от 100 до 400 миллиардов звёзд.', icon: '🌌' },
  { id: 9, text: 'Температура на поверхности Солнца составляет около 5 500°C.', icon: '🔥' },
  { id: 10, text: 'Космический телескоп Хаббл совершает один оборот вокруг Земли примерно за 95 минут.', icon: '🔭' },
  { id: 11, text: 'Первым живым существом в космосе стала собака Лайка в 1957 году.', icon: '🐕' },
  { id: 12, text: 'На Сатурне дуют ветры скоростью более 1 800 км/ч.', icon: '💨' },
  { id: 13, text: 'Чёрная дыра имеет настолько сильную гравитацию, что даже свет не может её покинуть.', icon: '🌑' },
  { id: 14, text: 'Международная космическая станция движется со скоростью около 28 000 км/ч.', icon: '🛸' },
  { id: 15, text: 'Свет от Солнца достигает Земли примерно за 8 минут 20 секунд.', icon: '💫' },
  { id: 16, text: 'Уран вращается на боку — его ось наклонена почти на 98 градусов.', icon: '🌀' },
  { id: 17, text: 'На Плутоне год длится 248 земных лет.', icon: '🟤' },
  { id: 18, text: 'Во Вселенной больше звёзд, чем песчинок на всех пляжах Земли.', icon: '✨' },
  { id: 19, text: 'Меркурий — самая быстрая планета: один оборот вокруг Солнца занимает 88 дней.', icon: '⚡' },
  { id: 20, text: 'Космонавты растут в космосе на 2-3 см из-за растяжения позвоночника в невесомости.', icon: '📏' },
]
```

---

## Шаг 4 — src/data/games.js

```js
export const games = [
  {
    id: 'tetris',
    name: 'Тетрис',
    description: 'Складывай фигуры в ряды и не допусти переполнения!',
    icon: '🧱',
    color: 'cyan',
    accentColor: '#22d3ee',
    route: '/games/tetris',
    controls: 'Стрелки для движения, Вверх для поворота, Пробел для сброса',
  },
  {
    id: 'snake',
    name: 'Змейка',
    description: 'Собирай еду и расти, не врезайся в стены!',
    icon: '🐍',
    color: 'emerald',
    accentColor: '#10b981',
    route: '/games/snake',
    controls: 'WASD или стрелки — управление, змейка проходит сквозь стены',
  },
  {
    id: 'car-race',
    name: 'Гонка Машин',
    description: 'Уклоняйся от встречных машин на трассе!',
    icon: '🏎️',
    color: 'rose',
    accentColor: '#f43f5e',
    route: '/games/car-race',
    controls: 'Стрелки влево/вправо или A/D для движения',
  },
  {
    id: 'pong',
    name: 'Понг',
    description: 'Классический теннис — отбивай мяч от стенки!',
    icon: '🏓',
    color: 'purple',
    accentColor: '#a855f7',
    route: '/games/pong',
    controls: 'W/S или стрелки вверх/вниз для ракетки',
  },
  {
    id: 'clicker',
    name: 'Кликер',
    description: 'Кликай, зарабатывай монеты, покупай улучшения!',
    icon: '👆',
    color: 'amber',
    accentColor: '#fbbf24',
    route: '/games/clicker',
    controls: 'Клик по ракете для заработка, кнопки для улучшений',
  },
  {
    id: 'cosmic-dodge',
    name: 'Космическое Уклонение',
    description: 'Уворачивайся от метеоритов на максимальной скорости!',
    icon: '🚀',
    color: 'indigo',
    accentColor: '#6366f1',
    route: '/games/cosmic-dodge',
    controls: 'Мышь или тач — двигай корабль',
  },
]
```

---

**Результат:** Директории public/assets/, файлы src/data/*.js
**Следующий шаг:** T03 + T04
