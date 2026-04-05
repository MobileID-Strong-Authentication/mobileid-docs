<script setup>
defineProps({
  href: { type: String, required: true },
  poster: { type: String, required: true },
  title: { type: String, required: true },
  label: { type: String, required: true },
  alt: { type: String, default: '' },
})
</script>

<template>
  <a class="blog-video-card" :href="href">
    <span class="blog-video-card-media">
      <img class="no-zoom" :src="poster" :alt="alt || title" />
      <span class="blog-video-card-play" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M8 6.5v11l9-5.5-9-5.5Z" />
        </svg>
      </span>
    </span>
    <span class="blog-video-card-body">
      <span class="blog-video-card-kicker">{{ label }}</span>
      <span class="blog-video-card-title">{{ title }}</span>
      <span v-if="$slots.default" class="blog-video-card-text">
        <slot />
      </span>
    </span>
  </a>
</template>
