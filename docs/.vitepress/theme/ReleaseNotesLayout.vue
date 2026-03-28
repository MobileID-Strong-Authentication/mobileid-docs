<script setup>
import { data as posts } from './release-notes.data.mts'
import LegalFooter from './components/LegalFooter.vue'

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
    <div class="blog-hero">
      <h1 style="color: #fff; margin: 0; font-size: 2em;">Release Notes</h1>
      <p style="opacity: 0.85; margin-top: 8px; font-size: 1em;">
        New features and updates for Mobile ID
      </p>
    </div>

    <div style="padding: 32px 24px; max-width: 800px; margin: 0 auto;">
      <a
        v-for="post in posts"
        :key="post.url"
        :href="post.url"
        class="blog-card"
        style="display: block; text-decoration: none; margin-bottom: 24px;"
      >
        <div class="blog-card-thumbnail">
          <img
            v-if="post.thumbnail"
            :src="post.thumbnail"
            :alt="post.title"
          />
        </div>
        <div class="blog-card-body">
          <div class="blog-card-meta">
            <span>{{ formatDate(post.date) }}</span>
            <span v-if="post.readingTime">·</span>
            <span v-if="post.readingTime">{{ post.readingTime }} min read</span>
          </div>
          <div class="blog-card-title">{{ post.title }}</div>
          <div class="blog-card-description">{{ post.description }}</div>
          <span class="blog-card-link">Read more →</span>
        </div>
      </a>
    </div>

    <LegalFooter />
  </div>
</template>
