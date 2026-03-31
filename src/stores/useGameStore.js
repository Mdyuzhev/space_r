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
