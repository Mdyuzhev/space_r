<template>
  <footer class="relative z-10 mt-20 border-t border-slate-800/50 bg-slate-950/80 backdrop-blur-md">
    <div class="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
      <div class="flex items-center gap-2">
        <span class="text-xl">🚀</span>
        <span class="font-display font-bold text-white">SpaceRoblox</span>
      </div>
      <p class="text-slate-500 text-sm text-center">
        Vue 3 SPA
      </p>
      <div class="flex gap-4 text-slate-500 text-sm">
        <RouterLink to="/games" class="hover:text-cyan-400 transition-colors">Игры</RouterLink>
        <RouterLink to="/facts" class="hover:text-cyan-400 transition-colors">Факты</RouterLink>
        <RouterLink to="/workshop" class="hover:text-cyan-400 transition-colors">Воркшоп</RouterLink>
      </div>
    </div>
  </footer>
</template>
