import { ref, onMounted, onUnmounted } from 'vue'

export function useGameCanvas({ aspectRatio = 1, minSize = 280, maxSize = 900 } = {}) {
  const canvasWidth  = ref(400)
  const canvasHeight = ref(400)

  function recalc() {
    const vw = window.innerWidth
    const isDesktop = vw >= 768

    let w = isDesktop ? Math.floor(vw * 0.6) : Math.floor(vw * 0.92)
    w = Math.max(minSize, Math.min(maxSize, w))

    canvasWidth.value  = w
    canvasHeight.value = Math.floor(w * aspectRatio)
  }

  onMounted(() => {
    recalc()
    window.addEventListener('resize', recalc)
  })
  onUnmounted(() => window.removeEventListener('resize', recalc))

  return { canvasWidth, canvasHeight }
}
