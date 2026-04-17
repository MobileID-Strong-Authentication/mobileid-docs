<script setup>
import { ref, watch, nextTick, onMounted } from 'vue'
import { useRoute } from 'vitepress'

const props = defineProps({
  src: { type: String, required: true },
  poster: { type: String, default: '' },
  type: { type: String, default: 'video/mp4' },
  linkText: { type: String, default: 'Open MP4' },
})

const videoRef = ref(null)
const route = useRoute()

// Force the video element to re-initialise after SPA navigation.
// Browsers can skip loading when Vue patches an existing <video> during
// client-side route transitions, leaving it in a broken state.
function reload() {
  nextTick(() => {
    const el = videoRef.value
    if (!el) return
    el.load()
  })
}

onMounted(reload)
watch(() => route.path, reload)
</script>

<template>
  <div class="blog-video">
    <video
      ref="videoRef"
      controls
      preload="metadata"
      playsinline
      :poster="poster || undefined"
    >
      <source :src="src" :type="type" />
      Your browser does not support the video element.
      <a :href="src">Open the MP4 directly.</a>
    </video>
    <div v-if="$slots.default || src" class="blog-video-caption">
      <span v-if="$slots.default" class="blog-video-caption-main">
        <svg class="video-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
        <span><slot /></span>
      </span>
      <a class="blog-video-link" :href="src" target="_blank" rel="noopener noreferrer">{{ linkText }}</a>
    </div>
  </div>
</template>
