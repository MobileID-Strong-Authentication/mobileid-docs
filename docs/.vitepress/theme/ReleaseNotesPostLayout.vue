<script setup>
import { useData } from 'vitepress'
import { computed } from 'vue'
import LegalFooter from './components/LegalFooter.vue'
import ReleaseNotesSidebar from './components/ReleaseNotesSidebar.vue'

const { frontmatter, page } = useData()

const META_COPY = {
  en: {
    section: 'Release Notes',
    readingTime: 'min read',
    locale: 'en-US',
  },
  de: {
    section: 'Release Notes',
    readingTime: 'Min. Lesezeit',
    locale: 'de-CH',
  },
  fr: {
    section: 'Release Notes',
    readingTime: 'min de lecture',
    locale: 'fr-CH',
  },
  it: {
    section: 'Release Notes',
    readingTime: 'min di lettura',
    locale: 'it-CH',
  },
}

const currentLang = computed(() => {
  const rel = page.value.relativePath || ''
  const langFromPath = rel.match(/\.(de|fr|it)\.md$/)?.[1]
  return langFromPath || frontmatter.value.lang || 'en'
})

const metaCopy = computed(() => META_COPY[currentLang.value] ?? META_COPY.en)

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString(metaCopy.value.locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
</script>

<template>
  <div class="blog-layout">
    <!-- Hero Header -->
    <div class="blog-hero">
      <div style="max-width: 800px; margin: 0 auto;">
        <div style="font-size: 0.75em; letter-spacing: 1px; text-transform: uppercase; opacity: 0.7; margin-bottom: 12px; font-family: var(--vp-font-family-base);">
          {{ metaCopy.section }}
        </div>
        <h1 style="color: #fff; margin: 0 0 16px; font-size: 2em; line-height: 1.2;">
          {{ frontmatter.title }}
        </h1>
        <div style="display: flex; gap: 20px; font-size: 0.85em; opacity: 0.85; font-family: var(--vp-font-family-base); flex-wrap: wrap;">
          <span v-if="frontmatter.date">📅 {{ formatDate(frontmatter.date) }}</span>
          <span v-if="frontmatter.readingTime">⏱ {{ frontmatter.readingTime }} {{ metaCopy.readingTime }}</span>
        </div>
      </div>
    </div>

    <div class="blog-post-shell">
      <ReleaseNotesSidebar />

      <!-- Content rendered from Markdown -->
      <div class="blog-content blog-content--post">
        <Content />
      </div>
    </div>

    <LegalFooter />
  </div>
</template>
