import { defineStore } from 'pinia'
import { ref } from 'vue'

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
