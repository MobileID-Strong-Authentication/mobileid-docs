<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const scenarios = [
  {
    name: 'Browser-Login (Web)',
    passkey: { status: 'ideal', label: 'Ideal' },
    sim: { status: 'ok', label: 'Strong' },
    app: { status: 'ok', label: 'Strong' },
  },
  {
    name: 'VPN / Remote Desktop',
    passkey: { status: 'no', label: 'Not possible' },
    sim: { status: 'ideal', label: 'Ideal' },
    app: { status: 'ideal', label: 'Ideal' },
  },
  {
    name: 'App-to-App (Banking)',
    passkey: { status: 'no', label: 'Not possible' },
    sim: { status: 'ok', label: 'Possible' },
    app: { status: 'ideal', label: 'Ideal' },
  },
  {
    name: 'Kiosk / Terminal',
    passkey: { status: 'limited', label: 'Limited' },
    sim: { status: 'ideal', label: 'Ideal' },
    app: { status: 'ok', label: 'Possible' },
  },
  {
    name: 'Offline',
    passkey: { status: 'no', label: 'Not possible' },
    sim: { status: 'ideal', label: 'GSM only' },
    app: { status: 'no', label: 'Needs Internet' },
  },
]

const statusIcons = {
  ideal: '✅',
  ok: '🟡',
  warning: '⚠️',
  limited: '🟠',
  no: '❌',
}

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
    { threshold: 0.2 }
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
    if (visibleRows.value >= scenarios.length) {
      clearInterval(animationTimer)
      return
    }
    visibleRows.value++
  }, 200)
}
</script>

<template>
  <div ref="containerRef" class="szenarien-matrix">
    <div class="szenarien-header">
      <div class="szenarien-cell szenarien-scenario">Scenario</div>
      <div class="szenarien-cell szenarien-method">Passkeys</div>
      <div class="szenarien-cell szenarien-method">Mobile ID SIM</div>
      <div class="szenarien-cell szenarien-method">Mobile ID App</div>
    </div>
    <div
      v-for="(row, i) in scenarios"
      :key="i"
      class="szenarien-row"
      :class="{ 'szenarien-row--visible': i < visibleRows }"
    >
      <div class="szenarien-cell szenarien-scenario">{{ row.name }}</div>
      <div class="szenarien-cell szenarien-method" :class="'szenarien-status--' + row.passkey.status">
        <span class="szenarien-icon">{{ statusIcons[row.passkey.status] }}</span>
        <span class="szenarien-label">{{ row.passkey.label }}</span>
      </div>
      <div class="szenarien-cell szenarien-method" :class="'szenarien-status--' + row.sim.status">
        <span class="szenarien-icon">{{ statusIcons[row.sim.status] }}</span>
        <span class="szenarien-label">{{ row.sim.label }}</span>
      </div>
      <div class="szenarien-cell szenarien-method" :class="'szenarien-status--' + row.app.status">
        <span class="szenarien-icon">{{ statusIcons[row.app.status] }}</span>
        <span class="szenarien-label">{{ row.app.label }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.szenarien-matrix {
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--blog-border);
  margin: 1.5em 0;
  font-family: 'Lato', sans-serif;
}

.szenarien-header {
  display: grid;
  grid-template-columns: 1.4fr 1fr 1fr 1fr;
  background: var(--blog-bg-subtle);
  font-weight: 700;
  font-size: 0.85em;
}

.szenarien-row {
  display: grid;
  grid-template-columns: 1.4fr 1fr 1fr 1fr;
  border-top: 1px solid var(--blog-border);
  opacity: 0;
  transform: translateY(8px);
  transition: opacity 0.3s, transform 0.3s;
}

.szenarien-row--visible {
  opacity: 1;
  transform: translateY(0);
}

.szenarien-cell {
  padding: 12px 14px;
  font-size: 0.85em;
}

.szenarien-scenario {
  font-weight: 600;
  color: var(--blog-text);
}

.szenarien-method {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.szenarien-icon {
  font-size: 1.1em;
}

.szenarien-label {
  font-size: 0.8em;
  color: var(--blog-text-muted);
}

.szenarien-status--ideal .szenarien-label { color: var(--blog-green); font-weight: 600; }
.szenarien-status--ok .szenarien-label { color: var(--blog-green-80); }
.szenarien-status--warning .szenarien-label { color: #b45309; }
.dark .szenarien-status--warning .szenarien-label { color: #fbbf24; }

@media (max-width: 600px) {
  .szenarien-matrix {
    overflow-x: auto;
  }
  .szenarien-header,
  .szenarien-row {
    min-width: 500px;
  }
}
</style>
