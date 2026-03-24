<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  rows: {
    type: Array,
    default: () => [
      { feature: 'Phishing-Schutz', classic: false, passkey: true },
      { feature: 'Kein Passwort nötig', classic: false, passkey: true },
      { feature: 'Login-Zeit', classic: '~15 Sek', passkey: '<3 Sek' },
      { feature: 'Zentrale Verwaltung', classic: false, passkey: true },
      { feature: 'NIST AAL3 möglich', classic: false, passkey: true },
      { feature: 'Kein Hardware-Token', classic: false, passkey: true },
    ],
  },
})

const visibleRows = ref(0)
const containerRef = ref(null)
let observer = null
let animationTimer = null

onMounted(() => {
  observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        animateRows()
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
  if (animationTimer) clearInterval(animationTimer)
})

function animateRows() {
  animationTimer = setInterval(() => {
    if (visibleRows.value >= props.rows.length) {
      clearInterval(animationTimer)
      return
    }
    visibleRows.value++
  }, 150)
}

function formatValue(val) {
  if (val === true) return '✅'
  if (val === false) return '❌'
  return val
}
</script>

<template>
  <div ref="containerRef" class="comparison-table">
    <div class="comparison-header">
      <div class="comparison-cell comparison-feature">Feature</div>
      <div class="comparison-cell comparison-classic">Passwort + SMS</div>
      <div class="comparison-cell comparison-passkey">Mobile ID Passkeys</div>
    </div>
    <div
      v-for="(row, i) in rows"
      :key="i"
      class="comparison-row"
      :class="{ 'comparison-row--visible': i < visibleRows }"
    >
      <div class="comparison-cell comparison-feature">{{ row.feature }}</div>
      <div class="comparison-cell comparison-classic">{{ formatValue(row.classic) }}</div>
      <div class="comparison-cell comparison-passkey">{{ formatValue(row.passkey) }}</div>
    </div>
  </div>
</template>

<style scoped>
.comparison-table {
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--blog-border);
  margin: 1.5em 0;
  font-family: 'Lato', sans-serif;
}

.comparison-header {
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr;
  background: var(--blog-bg-subtle);
  font-weight: 700;
  font-size: 0.85em;
}

.comparison-row {
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr;
  border-top: 1px solid var(--blog-border);
  opacity: 0;
  transform: translateY(8px);
  transition: opacity 0.3s, transform 0.3s;
}

.comparison-row--visible {
  opacity: 1;
  transform: translateY(0);
}

.comparison-cell {
  padding: 12px 16px;
  font-size: 0.9em;
}

.comparison-feature {
  font-weight: 600;
  color: var(--blog-text);
}

.comparison-classic {
  text-align: center;
  color: var(--blog-text-muted);
}

.comparison-passkey {
  text-align: center;
  color: var(--blog-green);
  font-weight: 600;
}

@media (max-width: 600px) {
  .comparison-table {
    overflow-x: auto;
  }
  .comparison-header,
  .comparison-row {
    min-width: 400px;
  }
}
</style>
