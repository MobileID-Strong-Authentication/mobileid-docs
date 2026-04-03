<script setup>
import { data as posts } from './release-notes.data.mts'

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
  <div class="rn-index">
    <header class="rn-index-header">
      <h1>Release Notes</h1>
      <p>New features and updates for Mobile ID</p>
    </header>

    <div class="rn-feed">
      <a
        v-for="post in posts"
        :key="post.url"
        :href="post.url"
        class="rn-card"
      >
        <div v-if="post.thumbnail" class="rn-card-thumb">
          <img :src="post.thumbnail" :alt="post.title" />
        </div>
        <div class="rn-card-body">
          <div class="rn-card-meta">
            {{ formatDate(post.date) }}
            <template v-if="post.readingTime"> · {{ post.readingTime }} min read</template>
          </div>
          <h2>{{ post.title }}</h2>
          <p>{{ post.description }}</p>
          <span class="rn-card-cta">Read more →</span>
        </div>
      </a>
    </div>

    <footer class="rn-footer">
      <a href="/legal/imprint">Imprint</a>
      <span aria-hidden="true">·</span>
      <a href="/legal/privacy">Privacy Notice</a>
    </footer>
  </div>
</template>
