<template>
  <nav class="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-800/50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">

        <RouterLink to="/" class="flex items-center gap-2 group">
          <span class="text-2xl group-hover:animate-bounce">🚀</span>
          <span class="font-display font-bold text-lg text-white group-hover:text-cyan-400 transition-colors">
            Space<span class="text-cyan-400">Roblox</span>
          </span>
        </RouterLink>

        <div class="hidden md:flex items-center gap-1">
          <NavLink to="/">Главная</NavLink>
          <NavLink to="/characters">Персонажи</NavLink>
          <NavLink to="/games">Игры</NavLink>
          <NavLink to="/facts">Факты</NavLink>
          <NavLink to="/workshop">Воркшоп</NavLink>
          <NavLink to="/quiz">Викторина</NavLink>
        </div>

        <button
          @click="menuOpen = !menuOpen"
          class="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Меню"
        >
          <component :is="menuOpen ? X : Menu" class="w-5 h-5" />
        </button>

      </div>

      <Transition name="slide-down">
        <div v-if="menuOpen" class="md:hidden pb-4 flex flex-col gap-1">
          <MobileNavLink to="/" @click="menuOpen = false">Главная</MobileNavLink>
          <MobileNavLink to="/characters" @click="menuOpen = false">Персонажи</MobileNavLink>
          <MobileNavLink to="/games" @click="menuOpen = false">Игры</MobileNavLink>
          <MobileNavLink to="/facts" @click="menuOpen = false">Факты</MobileNavLink>
          <MobileNavLink to="/workshop" @click="menuOpen = false">Воркшоп</MobileNavLink>
          <MobileNavLink to="/quiz" @click="menuOpen = false">Викторина</MobileNavLink>
        </div>
      </Transition>
    </div>
  </nav>

  <div class="h-16" />
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { Menu, X } from 'lucide-vue-next'

const menuOpen = ref(false)

const NavLink = {
  props: ['to'],
  template: `
    <RouterLink
      :to="to"
      class="px-3 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-all duration-200"
      activeClass="!text-cyan-400 !bg-cyan-400/10"
    ><slot /></RouterLink>
  `
}

const MobileNavLink = {
  props: ['to'],
  emits: ['click'],
  template: `
    <RouterLink
      :to="to"
      @click="$emit('click')"
      class="px-4 py-3 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
      activeClass="!text-cyan-400 !bg-cyan-400/10"
    ><slot /></RouterLink>
  `
}
</script>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active { transition: all 0.2s ease; }
.slide-down-enter-from,
.slide-down-leave-to { opacity: 0; transform: translateY(-10px); }
</style>
