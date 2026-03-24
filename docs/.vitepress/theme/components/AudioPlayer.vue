<script setup>
import { ref, onUnmounted } from 'vue'

const props = defineProps({
  src: { type: String, required: true },
  title: { type: String, default: '' },
})

const audio = ref(null)
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const progress = ref(0)

function togglePlay() {
  if (!audio.value) return
  if (isPlaying.value) {
    audio.value.pause()
  } else {
    audio.value.play()
  }
}

function onPlay() { isPlaying.value = true }
function onPause() { isPlaying.value = false }

function onTimeUpdate() {
  if (!audio.value) return
  currentTime.value = audio.value.currentTime
  progress.value = duration.value > 0 ? (currentTime.value / duration.value) * 100 : 0
}

function onLoadedMetadata() {
  if (audio.value) {
    duration.value = audio.value.duration
  }
}

function seek(event) {
  if (!audio.value) return
  const rect = event.currentTarget.getBoundingClientRect()
  const ratio = (event.clientX - rect.left) / rect.width
  audio.value.currentTime = ratio * duration.value
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

onUnmounted(() => {
  if (audio.value) {
    audio.value.pause()
  }
})
</script>

<template>
  <div class="audio-player">
    <audio
      ref="audio"
      :src="src"
      preload="metadata"
      @play="onPlay"
      @pause="onPause"
      @timeupdate="onTimeUpdate"
      @loadedmetadata="onLoadedMetadata"
    />

    <button class="audio-player-btn" @click="togglePlay" :aria-label="isPlaying ? 'Pause' : 'Play'">
      <span v-if="!isPlaying">▶</span>
      <span v-else>⏸</span>
    </button>

    <div class="audio-player-info">
      <div v-if="title" class="audio-player-title">{{ title }}</div>
      <div class="audio-player-bar" @click="seek">
        <div class="audio-player-progress" :style="{ width: progress + '%' }" />
      </div>
      <div class="audio-player-time">
        {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.audio-player {
  display: flex;
  align-items: center;
  gap: 16px;
  background: var(--blog-bg-subtle);
  border-radius: 12px;
  padding: 16px 20px;
  margin-bottom: 2em;
  border-bottom: 1px solid var(--blog-border);
}

.audio-player-btn {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--blog-green);
  color: #fff;
  border: none;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background 0.2s;
}

.audio-player-btn:hover {
  background: var(--blog-green-80);
}

.audio-player-info {
  flex: 1;
  min-width: 0;
}

.audio-player-title {
  font-size: 0.85em;
  font-weight: 600;
  margin-bottom: 8px;
  font-family: 'Lato', sans-serif;
  color: var(--blog-text);
}

.audio-player-bar {
  height: 6px;
  background: var(--blog-border);
  border-radius: 3px;
  cursor: pointer;
  overflow: hidden;
}

.audio-player-progress {
  height: 100%;
  background: var(--blog-green);
  border-radius: 3px;
  transition: width 0.1s linear;
}

.audio-player-time {
  font-size: 0.75em;
  color: var(--blog-text-muted);
  margin-top: 4px;
  font-family: 'Lato', sans-serif;
}
</style>
