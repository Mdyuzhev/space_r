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
