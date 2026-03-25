<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const phases = [
  {
    number: 1,
    title: 'iOS / Android MVP',
    description: 'Device-bound Passkeys + Push Auth',
    icon: '📱',
    color: 'green',
  },
  {
    number: 2,
    title: 'macOS, iPadOS, Windows',
    description: 'Lokale Passkey Provider',
    icon: '💻',
    color: 'green',
  },
  {
    number: 3,
    title: 'Swiss Cloud-Synced Passkeys',
    description: 'E2E-verschlüsselt in der Schweiz',
    icon: '🇨🇭',
    color: 'pink',
  },
  {
    number: 4,
    title: 'Attestation',
    description: 'AAGUID, FIDO MDS, Enterprise Allowlisting',
    icon: '🔏',
    color: 'pink',
  },
]

const colorMap = {
  green: 'var(--blog-green)',
  pink: 'var(--blog-pink)',
}

const visiblePhases = ref(0)
const containerRef = ref(null)
let observer = null
let timer = null

onMounted(() => {
  observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        animatePhases()
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
  if (timer) clearInterval(timer)
})

function animatePhases() {
  timer = setInterval(() => {
    if (visiblePhases.value >= phases.length) {
      clearInterval(timer)
      return
    }
    visiblePhases.value++
  }, 400)
}
</script>

<template>
  <div ref="containerRef" class="vault-roadmap">
    <div
      v-for="(phase, i) in phases"
      :key="i"
      class="vault-phase"
      :class="{ 'vault-phase--visible': i < visiblePhases }"
    >
      <div class="vault-phase-marker">
        <div
          class="vault-phase-dot"
          :style="{ background: colorMap[phase.color] }"
        >
          {{ phase.number }}
        </div>
        <div v-if="i < phases.length - 1" class="vault-phase-line" :style="{ background: colorMap[phase.color] }"></div>
      </div>
      <div class="vault-phase-content">
        <div class="vault-phase-icon">{{ phase.icon }}</div>
        <div>
          <div class="vault-phase-title">{{ phase.title }}</div>
          <div class="vault-phase-desc">{{ phase.description }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.vault-roadmap {
  margin: 1.5em 0;
  padding-left: 8px;
  font-family: 'Lato', sans-serif;
}

.vault-phase {
  display: flex;
  gap: 16px;
  opacity: 0;
  transform: translateX(-12px);
  transition: opacity 0.5s, transform 0.5s;
}

.vault-phase--visible {
  opacity: 1;
  transform: translateX(0);
}

.vault-phase-marker {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
}

.vault-phase-dot {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 700;
  font-size: 0.85em;
  flex-shrink: 0;
}

.vault-phase-line {
  width: 2px;
  flex-grow: 1;
  min-height: 24px;
  opacity: 0.3;
}

.vault-phase-content {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding-bottom: 24px;
}

.vault-phase-icon {
  font-size: 1.5em;
  flex-shrink: 0;
}

.vault-phase-title {
  font-weight: 700;
  font-size: 0.95em;
  color: var(--blog-text);
  margin-bottom: 2px;
}

.vault-phase-desc {
  font-size: 0.85em;
  color: var(--blog-text-muted);
  line-height: 1.5;
}
</style>
