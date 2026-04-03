<script setup>
import { useData, useRouter } from 'vitepress'
import { computed } from 'vue'

const props = defineProps({
  languages: {
    type: Object,
    default: () => ({ en: 'English', de: 'Deutsch', fr: 'Français', it: 'Italiano' }),
  },
})

const codes = { en: 'EN', de: 'DE', fr: 'FR', it: 'IT' }
const flags = { en: '🇬🇧', de: '🇩🇪', fr: '🇫🇷', it: '🇮🇹' }

const { frontmatter, page } = useData()
const router = useRouter()

const currentLang = computed(() => {
  const rel = page.value.relativePath || ''
  const langFromPath = rel.match(/\.(de|fr|it)\.md$/)?.[1]
  return langFromPath || frontmatter.value.lang || 'en'
})

const baseUrl = computed(() => {
  const rel = page.value.relativePath.replace(/\.md$/, '')
  return '/' + rel.replace(/\.(de|fr|it|en)$/, '')
})

function langUrl(lang) {
  const suffix = lang === 'en' ? '' : `.${lang}`
  return `${baseUrl.value}${suffix}.html`
}

function switchLanguage(e, lang) {
  if (lang === currentLang.value) {
    e.preventDefault()
    return
  }
  e.preventDefault()
  router.go(langUrl(lang))
}
</script>

<template>
  <nav class="lang-seg" aria-label="Language">
    <a
      v-for="(label, code) in languages"
      :key="code"
      :href="langUrl(code)"
      class="lang-seg-pill"
      :class="{ 'is-active': code === currentLang }"
      :aria-current="code === currentLang ? 'page' : undefined"
      :title="label"
      @click="switchLanguage($event, code)"
    >
      <span class="lang-seg-flag" aria-hidden="true">{{ flags[code] }}</span>
      <span class="lang-seg-code">{{ codes[code] }}</span>
    </a>
  </nav>
</template>

<style scoped>
.lang-seg {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1.5em;
}

.lang-seg {
  display: inline-flex;
  gap: 2px;
  padding: 3px;
  margin-left: auto;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
}

.lang-seg-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  border-radius: 7px;
  font-family: var(--vp-font-family-base);
  font-size: 0.82rem;
  font-weight: 500;
  color: var(--vp-c-text-2);
  text-decoration: none !important;
  transition: color 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
  user-select: none;
  line-height: 1;
  white-space: nowrap;
}

.lang-seg-pill:hover:not(.is-active) {
  color: var(--vp-c-text-1);
  background: rgba(0, 0, 0, 0.04);
}

:global(html.dark) .lang-seg-pill:hover:not(.is-active) {
  background: rgba(255, 255, 255, 0.05);
}

.lang-seg-pill.is-active {
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg);
  font-weight: 600;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08), 0 0.5px 1px rgba(0, 0, 0, 0.06);
  cursor: default;
}

:global(html.dark) .lang-seg-pill.is-active {
  background: var(--vp-c-bg-elv);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.24);
}

.lang-seg-pill:focus-visible {
  outline: 2px solid var(--vp-c-brand-3);
  outline-offset: 1px;
}

.lang-seg-flag {
  font-size: 1.15em;
  line-height: 1;
}

.lang-seg-code {
  letter-spacing: 0.03em;
}

@media (max-width: 480px) {
  .lang-seg-pill {
    padding: 5px 8px;
    gap: 4px;
  }

  .lang-seg-code {
    font-size: 0.78rem;
  }
}
</style>
