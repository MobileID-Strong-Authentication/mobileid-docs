<script setup>
import { useData } from 'vitepress'
import { computed } from 'vue'
import ReleaseNotesSidebar from './components/ReleaseNotesSidebar.vue'

const { frontmatter, page } = useData()

const META_COPY = {
  en: { label: 'Explainer video', locale: 'en-US' },
  de: { label: 'Erklaervideo', locale: 'de-CH' },
  fr: { label: 'Video explicative', locale: 'fr-CH' },
  it: { label: 'Video esplicativo', locale: 'it-CH' },
}

const currentLang = computed(() => {
  const rel = page.value.relativePath || ''
  return rel.match(/\.(de|fr|it)\.md$/)?.[1] || frontmatter.value.lang || 'en'
})

const metaCopy = computed(() => META_COPY[currentLang.value] ?? META_COPY.en)

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString(metaCopy.value.locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
</script>

<template>
  <div class="rn-post-layout">
    <ReleaseNotesSidebar />
    <article class="rn-article vp-doc">
      <header class="rn-post-header">
        <p class="rn-post-meta">
          <span>{{ metaCopy.label }}</span>
          <template v-if="frontmatter.date"> · {{ formatDate(frontmatter.date) }}</template>
        </p>
        <h1>{{ frontmatter.title }}</h1>
      </header>
      <Content />
    </article>
  </div>
</template>
