<template>
  <div
    class="glass-card p-6 cursor-pointer group transition-all duration-300 hover:scale-105"
    :style="`--accent: ${character.accentColor}`"
    @click="$emit('select', character)"
  >
    <div class="flex justify-center mb-4">
      <div
        class="w-24 h-24 rounded-full flex items-center justify-center overflow-hidden border-2 transition-all duration-300"
        :style="`border-color: ${character.accentColor}40; background: ${character.accentColor}10`"
      >
        <img
          v-if="character.image"
          :src="character.image"
          :alt="character.name"
          class="w-full h-full object-cover"
        />
        <span v-else class="text-5xl">{{ character.emoji }}</span>
      </div>
    </div>

    <div class="text-center mb-3">
      <h3 class="font-display font-bold text-white text-lg">{{ character.name }}</h3>
      <span
        class="text-xs font-semibold px-2 py-0.5 rounded-full"
        :style="`background: ${character.accentColor}20; color: ${character.accentColor}`"
      >{{ character.role }}</span>
    </div>

    <p class="text-slate-400 text-sm text-center mb-4">{{ character.description }}</p>

    <div class="grid grid-cols-3 gap-2 mb-4 text-center">
      <div>
        <div class="flex justify-center mb-1">
          <span v-for="i in 5" :key="i" class="text-xs" :style="i <= character.stats.experience ? `color: ${character.accentColor}` : 'color: #374151'">★</span>
        </div>
        <p class="text-slate-500 text-xs">Опыт</p>
      </div>
      <div>
        <p class="font-bold text-white">{{ character.stats.missions }}</p>
        <p class="text-slate-500 text-xs">Миссий</p>
      </div>
      <div>
        <p class="font-semibold text-xs" :style="`color: ${character.accentColor}`">{{ character.stats.rank }}</p>
        <p class="text-slate-500 text-xs">Ранг</p>
      </div>
    </div>

    <RouterLink
      :to="character.ability.route"
      class="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-105"
      :style="`background: ${character.accentColor}20; color: ${character.accentColor}; border: 1px solid ${character.accentColor}40`"
      @click.stop
    >
      <span>{{ character.ability.icon }}</span>
      {{ character.ability.name }}
    </RouterLink>
  </div>
</template>

<script setup>
defineProps({ character: { type: Object, required: true } })
defineEmits(['select'])
</script>
