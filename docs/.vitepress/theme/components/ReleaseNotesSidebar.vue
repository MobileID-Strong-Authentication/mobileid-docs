<script setup>
import { useData } from 'vitepress'
import { computed } from 'vue'
import { data as posts } from '../release-notes.sidebar.data.mts'

const { frontmatter, page } = useData()

const COPY = {
  en: { group: 'Release Notes', overview: 'Overview' },
  de: { group: 'Release Notes', overview: 'Übersicht' },
  fr: { group: 'Release Notes', overview: 'Aperçu' },
  it: { group: 'Release Notes', overview: 'Panoramica' },
}

const currentLang = computed(() => {
  const rel = page.value.relativePath || ''
  return rel.match(/\.(de|fr|it)\.md$/)?.[1] || frontmatter.value.lang || 'en'
})

const currentUrl = computed(() => `/${(page.value.relativePath || '').replace(/\.md$/, '.html')}`)

const labels = computed(() => COPY[currentLang.value] ?? COPY.en)

const sidebarPosts = computed(() => {
  const variantsByBaseUrl = new Map()
  for (const post of posts) {
    const variants = variantsByBaseUrl.get(post.baseUrl) ?? new Map()
    variants.set(post.lang, post)
    variantsByBaseUrl.set(post.baseUrl, variants)
  }
  return Array.from(variantsByBaseUrl.values())
    .map((variants) =>
      variants.get(currentLang.value)
      ?? variants.get('en')
      ?? Array.from(variants.values())[0]
    )
    .sort((a, b) => +new Date(b.date) - +new Date(a.date))
})
</script>

<template>
  <aside class="rn-sidebar" aria-label="Release notes navigation">
    <div class="rn-sidebar-group">
      <p class="rn-sidebar-title">{{ labels.group }}</p>
      <nav class="rn-sidebar-nav">
        <a
          href="/release-notes/"
          class="rn-sidebar-link"
          :class="{ 'is-active': currentUrl === '/release-notes/' }"
        >{{ labels.overview }}</a>
        <a
          v-for="post in sidebarPosts"
          :key="post.url"
          :href="post.url"
          class="rn-sidebar-link"
          :class="{ 'is-active': post.url === currentUrl }"
        >{{ post.title }}</a>
      </nav>
    </div>
    <nav class="rn-sidebar-legal">
      <a href="/legal/imprint" class="rn-sidebar-link">Imprint</a>
      <a href="/legal/privacy" class="rn-sidebar-link">Privacy Notice</a>
    </nav>
  </aside>
</template>
