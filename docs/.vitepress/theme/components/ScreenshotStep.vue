<template>
  <div class="screenshot-step">
    <div class="screenshot-step-img">
      <img :src="img" :alt="alt" @click="openLightbox" />
    </div>
    <div class="screenshot-step-text">
      <slot />
    </div>
    <Teleport to="body">
      <Transition name="lightbox">
        <div v-if="showLightbox" class="screenshot-lightbox" @click="showLightbox = false">
          <img :src="img" :alt="alt" />
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  img: { type: String, required: true },
  alt: { type: String, default: '' },
})

const showLightbox = ref(false)

function openLightbox() {
  showLightbox.value = true
}
</script>

<style scoped>
.screenshot-step {
  display: flex;
  align-items: flex-start;
  gap: 1.4em;
  margin: 1.2em 0;
  padding: 1em 1.2em;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(0, 148, 144, 0.04), rgba(0, 148, 144, 0.01));
  border: 1px solid rgba(0, 148, 144, 0.12);
  transition: border-color 0.2s, box-shadow 0.2s;
}

.screenshot-step:hover {
  border-color: rgba(0, 148, 144, 0.25);
  box-shadow: 0 2px 12px rgba(0, 148, 144, 0.06);
}

.dark .screenshot-step {
  background: linear-gradient(135deg, rgba(0, 148, 144, 0.06), rgba(0, 148, 144, 0.02));
  border-color: rgba(0, 148, 144, 0.18);
}

.dark .screenshot-step:hover {
  border-color: rgba(0, 148, 144, 0.35);
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.25);
}

.screenshot-step-img {
  flex-shrink: 0;
  width: 110px;
}

.screenshot-step-img img {
  width: 100%;
  height: auto;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  cursor: zoom-in;
  transition: transform 0.2s, box-shadow 0.2s;
}

.screenshot-step-img img:hover {
  transform: scale(1.03);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.dark .screenshot-step-img img {
  border-color: #4b5563;
}

.dark .screenshot-step-img img:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
}

.screenshot-step-text {
  flex: 1;
  min-width: 0;
  font-size: 0.95em;
  line-height: 1.65;
  color: var(--vp-c-text-1);
}

.screenshot-step-text :deep(p) {
  margin: 0 0 0.5em;
}

.screenshot-step-text :deep(p:last-child) {
  margin-bottom: 0;
}

.screenshot-step-text :deep(strong) {
  color: var(--vp-c-text-1);
}

.screenshot-step-text :deep(code) {
  font-size: 0.88em;
  padding: 0.15em 0.35em;
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.05);
}

.dark .screenshot-step-text :deep(code) {
  background: rgba(255, 255, 255, 0.08);
}

/* Lightbox overlay */
.screenshot-lightbox {
  position: fixed;
  inset: 0;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.8);
  cursor: zoom-out;
  backdrop-filter: blur(4px);
}

.screenshot-lightbox img {
  max-width: 90vw;
  max-height: 90vh;
  border-radius: 12px;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.5);
}

.lightbox-enter-active,
.lightbox-leave-active {
  transition: opacity 0.25s ease;
}

.lightbox-enter-from,
.lightbox-leave-to {
  opacity: 0;
}

/* Responsive: stack on narrow screens */
@media (max-width: 520px) {
  .screenshot-step {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .screenshot-step-img {
    width: 90px;
  }
}
</style>
