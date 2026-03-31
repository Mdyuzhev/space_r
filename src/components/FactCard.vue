<template>
  <div class="glass-card p-8 max-w-xl mx-auto relative overflow-hidden">
    <div
      class="absolute inset-0 pointer-events-none"
      style="background: linear-gradient(135deg, rgba(34,211,238,0.05), rgba(168,85,247,0.05))"
    />
    <div class="relative z-10">
      <div class="text-6xl text-center mb-4">{{ fact.icon }}</div>
      <div class="text-center mb-2">
        <span class="text-cyan-400 font-display font-bold text-sm">Факт {{ fact.id }} / {{ total }}</span>
      </div>
      <p class="text-slate-200 text-center text-lg leading-relaxed">{{ fact.text }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  fact: { type: Object, required: true },
  total: { type: Number, required: true },
})
</script>
