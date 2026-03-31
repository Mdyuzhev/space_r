<template>
  <div
    v-if="isTouchDevice"
    class="select-none mt-4"
    :class="layout === 'lr' ? 'flex justify-center gap-8' : layout === 'ud' ? 'flex justify-center gap-8' : 'grid grid-cols-3 gap-2 w-40 mx-auto'"
  >
    <template v-if="layout === 'arrows'">
      <div />
      <DpadBtn label="↑" @press="$emit('press', 'up')" @release="$emit('release', 'up')" />
      <div />
      <DpadBtn label="←" @press="$emit('press', 'left')" @release="$emit('release', 'left')" />
      <DpadBtn label="↻" @press="$emit('press', 'rotate')" @release="$emit('release', 'rotate')" accent />
      <DpadBtn label="→" @press="$emit('press', 'right')" @release="$emit('release', 'right')" />
      <div />
      <DpadBtn label="↓" @press="$emit('press', 'down')" @release="$emit('release', 'down')" />
      <div />
    </template>

    <template v-if="layout === 'lr'">
      <DpadBtn label="←" big @press="$emit('press', 'left')" @release="$emit('release', 'left')" />
      <DpadBtn label="→" big @press="$emit('press', 'right')" @release="$emit('release', 'right')" />
    </template>

    <template v-if="layout === 'ud'">
      <DpadBtn label="↑" big @press="$emit('press', 'up')" @release="$emit('release', 'up')" />
      <DpadBtn label="↓" big @press="$emit('press', 'down')" @release="$emit('release', 'down')" />
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted, defineComponent, h } from 'vue'

defineProps({ layout: { type: String, default: 'arrows' } })
defineEmits(['press', 'release'])

const isTouchDevice = ref(false)
onMounted(() => {
  isTouchDevice.value = window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window
})

const DpadBtn = defineComponent({
  props: { label: String, big: Boolean, accent: Boolean },
  emits: ['press', 'release'],
  setup(props, { emit }) {
    const pressing = ref(false)

    function start(e) {
      e.preventDefault()
      pressing.value = true
      emit('press')
    }
    function end(e) {
      e.preventDefault()
      pressing.value = false
      emit('release')
    }

    return () => h('button', {
      class: [
        'flex items-center justify-center rounded-xl font-bold text-xl transition-all duration-75 touch-none select-none',
        props.big ? 'w-20 h-16' : 'w-12 h-12',
        pressing.value
          ? (props.accent ? 'bg-purple-500 text-white scale-95' : 'bg-slate-600 text-white scale-95')
          : (props.accent ? 'bg-purple-500/20 text-purple-400 border border-purple-500/50' : 'bg-slate-800/80 text-slate-300 border border-slate-600'),
      ],
      onTouchstart: start,
      onTouchend: end,
      onTouchcancel: end,
      onMousedown: start,
      onMouseup: end,
      onMouseleave: end,
    }, props.label)
  }
})
</script>
