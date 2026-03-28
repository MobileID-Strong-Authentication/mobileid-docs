<script setup>
import { useData, useRouter } from 'vitepress'
import { computed, ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  languages: {
    type: Object,
    default: () => ({ en: 'English', de: 'Deutsch', fr: 'Français', it: 'Italiano' })
  }
})

const flags = { en: '🇬🇧', de: '🇩🇪', fr: '🇫🇷', it: '🇮🇹' }

const { frontmatter, page } = useData()
const router = useRouter()
const open = ref(false)
const dropdownRef = ref(null)

const currentLang = computed(() => {
  const rel = page.value.relativePath || ''
  const langFromPath = rel.match(/\.(de|fr|it)\.md$/)?.[1]
  return langFromPath || frontmatter.value.lang || 'en'
})

const baseUrl = computed(() => {
  const rel = page.value.relativePath.replace(/\.md$/, '')
  return '/' + rel.replace(/\.(de|fr|it|en)$/, '')
})

function toggle() {
  open.value = !open.value
}

function switchLanguage(lang) {
  if (lang === currentLang.value) {
    open.value = false
    return
  }
  open.value = false
  const suffix = lang === 'en' ? '' : `.${lang}`
  router.go(`${baseUrl.value}${suffix}.html`)
}

function onClickOutside(e) {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target)) {
    open.value = false
  }
}

function onKeydown(e) {
  if (e.key === 'Escape') open.value = false
}

onMounted(() => {
  document.addEventListener('click', onClickOutside)
  document.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  document.removeEventListener('click', onClickOutside)
  document.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <div class="lang-switcher" ref="dropdownRef">
    <button
      class="lang-trigger"
      :class="{ 'lang-trigger--open': open }"
      @click="toggle"
      :aria-expanded="open"
      aria-haspopup="listbox"
    >
      <span class="lang-flag">{{ flags[currentLang] }}</span>
      <span class="lang-name">{{ languages[currentLang] }}</span>
      <svg class="lang-chevron" :class="{ 'lang-chevron--open': open }" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>
    </button>
    <Transition name="lang-dropdown">
      <ul v-if="open" class="lang-menu" role="listbox">
        <li
          v-for="(label, code) in languages"
          :key="code"
          class="lang-option"
          :class="{ 'lang-option--active': code === currentLang }"
          role="option"
          :aria-selected="code === currentLang"
          @click="switchLanguage(code)"
        >
          <span class="lang-flag">{{ flags[code] }}</span>
          <span class="lang-name">{{ label }}</span>
          <svg v-if="code === currentLang" class="lang-check" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        </li>
      </ul>
    </Transition>
  </div>
</template>
