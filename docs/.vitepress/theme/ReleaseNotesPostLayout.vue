<script setup>
import { useData } from 'vitepress'
import { computed } from 'vue'
import ReleaseNotesSidebar from './components/ReleaseNotesSidebar.vue'

const { frontmatter, page } = useData()

const META_COPY = {
  en: { readingTime: 'min read', locale: 'en-US' },
  de: { readingTime: 'Min. Lesezeit', locale: 'de-CH' },
  fr: { readingTime: 'min de lecture', locale: 'fr-CH' },
  it: { readingTime: 'min di lettura', locale: 'it-CH' },
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
          <span v-if="frontmatter.date">{{ formatDate(frontmatter.date) }}</span>
          <template v-if="frontmatter.readingTime"> · {{ frontmatter.readingTime }} {{ metaCopy.readingTime }}</template>
        </p>
        <h1>{{ frontmatter.title }}</h1>
      </header>
      <Content />
    </article>
  </div>
</template>
