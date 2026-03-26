<script setup>
import { useData, useRouter } from 'vitepress'
import { computed } from 'vue'

const props = defineProps({
  languages: {
    type: Object,
    default: () => ({ en: 'English', de: 'Deutsch', fr: 'Français', it: 'Italiano' })
  }
})

const { frontmatter, page } = useData()
const router = useRouter()

const currentLang = computed(() => frontmatter.value.lang || 'en')

const baseUrl = computed(() => {
  const rel = page.value.relativePath.replace(/\.md$/, '')
  return '/' + rel.replace(/\.(de|fr|it|en)$/, '')
})

function switchLanguage(event) {
  const lang = event.target.value
  if (lang === currentLang.value) return
  const suffix = lang === 'en' ? '' : `.${lang}`
  router.go(`${baseUrl.value}${suffix}.html`)
}
</script>

<template>
  <div class="lang-switcher">
    <label class="lang-switcher-label">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
      <select :value="currentLang" @change="switchLanguage">
        <option v-for="(label, code) in languages" :key="code" :value="code">
          {{ label }}
        </option>
      </select>
    </label>
  </div>
</template>
