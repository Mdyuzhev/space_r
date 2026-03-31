import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMusicStore = defineStore('music', () => {
  const isPlaying = ref(false)
  const currentTrack = ref(0)
  const tracks = ref([
    { name: 'Space Theme', src: '/space_r/assets/audio/track1.mp3' },
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
