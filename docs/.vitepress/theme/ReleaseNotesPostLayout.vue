<script setup>
import { useData } from 'vitepress'
import LegalFooter from './components/LegalFooter.vue'

const { frontmatter } = useData()

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', {
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
        <div style="font-size: 0.75em; letter-spacing: 1px; text-transform: uppercase; opacity: 0.7; margin-bottom: 12px; font-family: 'Lato', sans-serif;">
          Release Notes
        </div>
        <h1 style="color: #fff; margin: 0 0 16px; font-size: 2em; line-height: 1.2;">
          {{ frontmatter.title }}
        </h1>
        <div style="display: flex; gap: 20px; font-size: 0.85em; opacity: 0.85; font-family: 'Lato', sans-serif; flex-wrap: wrap;">
          <span v-if="frontmatter.date">📅 {{ formatDate(frontmatter.date) }}</span>
          <span v-if="frontmatter.readingTime">⏱ {{ frontmatter.readingTime }} min read</span>
        </div>
      </div>
    </div>

    <!-- Content rendered from Markdown -->
    <div class="blog-content">
      <Content />
    </div>

    <LegalFooter />
  </div>
</template>
