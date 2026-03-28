<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const containerRef = ref(null)
const visible = ref(false)
let observer = null

onMounted(() => {
  observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        visible.value = true
        observer.disconnect()
      }
    },
    { threshold: 0.3 }
  )
  if (containerRef.value) {
    observer.observe(containerRef.value)
  }
})

onUnmounted(() => {
  if (observer) observer.disconnect()
})
</script>

<template>
  <div ref="containerRef" class="migration-timeline">
    <div class="migration-track">
      <div class="migration-item" :class="{ 'migration-item--visible': visible }" style="transition-delay: 0ms">
        <div class="migration-dot migration-dot--done"></div>
        <div class="migration-content">
          <div class="migration-date">May 2024</div>
          <div class="migration-title">External MFA Preview</div>
          <div class="migration-desc">Microsoft launches External Authentication Methods in public preview.</div>
        </div>
      </div>

      <div class="migration-line" :class="{ 'migration-line--visible': visible }" style="transition-delay: 200ms"></div>

      <div class="migration-item" :class="{ 'migration-item--visible': visible }" style="transition-delay: 400ms">
        <div class="migration-dot migration-dot--done"></div>
        <div class="migration-content">
          <div class="migration-date">March 2026</div>
          <div class="migration-title">External MFA is GA</div>
          <div class="migration-desc">Generally available for production. Mobile ID fully supports External MFA.</div>
        </div>
      </div>

      <div class="migration-line" :class="{ 'migration-line--visible': visible }" style="transition-delay: 600ms"></div>

      <div class="migration-item migration-item--warning" :class="{ 'migration-item--visible': visible }" style="transition-delay: 800ms">
        <div class="migration-dot migration-dot--warning"></div>
        <div class="migration-content">
          <div class="migration-date">September 30, 2026</div>
          <div class="migration-title">Custom Controls Deprecated</div>
          <div class="migration-desc">Legacy Custom Controls are retired. Migrate to External MFA before this date.</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.migration-timeline {
  margin: 1.5em 0;
  font-family: 'Lato', sans-serif;
}

.migration-track {
  display: flex;
  flex-direction: column;
  gap: 0;
  padding: 8px 0;
}

.migration-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 8px 0;
  opacity: 0;
  transform: translateX(-10px);
  transition: opacity 0.5s, transform 0.5s;
}

.migration-item--visible {
  opacity: 1;
  transform: translateX(0);
}

.migration-dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  flex-shrink: 0;
  margin-top: 3px;
}

.migration-dot--done {
  background: var(--blog-green);
}

.migration-dot--warning {
  background: #e65100;
}

.migration-line {
  width: 2px;
  height: 16px;
  background: var(--blog-green-60);
  margin-left: 6px;
  opacity: 0;
  transition: opacity 0.4s;
}

.migration-line--visible {
  opacity: 1;
}

.migration-date {
  font-size: 0.68em;
  font-weight: 700;
  color: var(--blog-green);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.migration-item--warning .migration-date {
  color: #e65100;
}

.migration-title {
  font-weight: 700;
  font-size: 0.82em;
  color: var(--blog-text);
  margin: 1px 0;
}

.migration-desc {
  font-size: 0.72em;
  color: var(--blog-text-muted);
  line-height: 1.4;
}
</style>
