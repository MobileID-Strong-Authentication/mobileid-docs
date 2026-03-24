<script setup>
import { ref, nextTick } from 'vue'

defineProps({
  src: { type: String, required: true },
  poster: { type: String, default: '' },
})

const started = ref(false)
const video = ref(null)

async function play() {
  started.value = true
  await nextTick()
  if (video.value) video.value.play()
}
</script>

<template>
  <div class="video-embed" @click="play" :class="{ 'video-embed--playing': started }">
    <video
      v-if="started"
      ref="video"
      :src="src"
      :poster="poster"
      controls
      preload="metadata"
      style="width: 100%; height: 100%; border-radius: 12px;"
    />
    <template v-else>
      <img v-if="poster" :src="poster" alt="" style="width: 100%; height: 100%; object-fit: cover; border-radius: 12px;" />
      <div class="video-embed-overlay">
        <div class="video-embed-play">▶</div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.video-embed {
  position: relative;
  background: #111;
  border-radius: 12px;
  overflow: hidden;
  margin: 1.5em 0;
  aspect-ratio: 16 / 9;
  cursor: pointer;
}

.video-embed--playing {
  cursor: default;
}

.video-embed-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.3);
  transition: background 0.2s;
}

.video-embed:hover .video-embed-overlay {
  background: rgba(0, 0, 0, 0.15);
}

.video-embed-play {
  width: 64px;
  height: 64px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(8px);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #fff;
  transition: transform 0.2s, background 0.2s;
}

.video-embed:hover .video-embed-play {
  transform: scale(1.1);
  background: rgba(255, 255, 255, 0.3);
}
</style>
