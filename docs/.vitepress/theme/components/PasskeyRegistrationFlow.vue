<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  steps: {
    type: Array,
    default: () => [
      { label: 'Login (OTP)', icon: '🔑' },
      { label: 'Dashboard', icon: '📋' },
      { label: 'Passkeys', icon: '🛡️' },
      { label: 'Add Passkey', icon: '➕' },
      { label: 'Touch ID', icon: '👆' },
      { label: 'Registered ✓', icon: '✅' },
    ],
  },
})

const activeStep = ref(-1)
const containerRef = ref(null)
let observer = null
let animationTimer = null

onMounted(() => {
  observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        startAnimation()
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

function startAnimation() {
  activeStep.value = 0
  animationTimer = setInterval(() => {
    if (activeStep.value >= props.steps.length - 1) {
      clearInterval(animationTimer)
      return
    }
    activeStep.value++
  }, 600)
}
</script>

<template>
  <div ref="containerRef" class="reg-flow">
    <div
      v-for="(step, i) in steps"
      :key="i"
      class="reg-flow-step"
      :class="{
        'reg-flow-step--active': i === activeStep,
        'reg-flow-step--done': i < activeStep,
        'reg-flow-step--hidden': i > activeStep,
        'reg-flow-step--last': i === steps.length - 1 && i <= activeStep,
      }"
    >
      <div class="reg-flow-box">
        <span class="reg-flow-icon">{{ step.icon }}</span>
        <span class="reg-flow-label">{{ step.label }}</span>
      </div>
      <div v-if="i < steps.length - 1" class="reg-flow-arrow" :class="{ 'reg-flow-arrow--visible': i < activeStep }">→</div>
    </div>
  </div>
</template>

<style scoped>
.reg-flow {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  padding: 24px 0;
  margin: 1.5em 0;
  font-family: 'Lato', sans-serif;
}

.reg-flow-step {
  display: flex;
  align-items: center;
  opacity: 0;
  transform: translateX(-10px);
  transition: opacity 0.4s, transform 0.4s;
}

.reg-flow-step--active,
.reg-flow-step--done,
.reg-flow-step--last {
  opacity: 1;
  transform: translateX(0);
}

.reg-flow-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px 10px;
  border-radius: 8px;
  background: rgba(0, 148, 144, 0.08);
  border: 2px solid transparent;
  white-space: nowrap;
  transition: border-color 0.3s, background 0.3s;
}

.reg-flow-step--active .reg-flow-box {
  border-color: var(--blog-green);
  background: rgba(0, 148, 144, 0.15);
  animation: pulse 1.5s ease-in-out infinite;
}

.reg-flow-step--last .reg-flow-box {
  background: var(--blog-green-40);
  color: #fff;
  border-color: var(--blog-green-40);
  animation: none;
}

.dark .reg-flow-box {
  background: rgba(255, 255, 255, 0.05);
}

.dark .reg-flow-step--active .reg-flow-box {
  background: rgba(0, 148, 144, 0.2);
}

.dark .reg-flow-step--last .reg-flow-box {
  background: var(--blog-green-40);
}

.reg-flow-icon {
  font-size: 1em;
}

.reg-flow-label {
  font-size: 0.7em;
  font-weight: 600;
  color: var(--blog-text);
}

.reg-flow-step--last .reg-flow-label {
  color: #fff;
}

.reg-flow-arrow {
  padding: 0 4px;
  font-size: 1em;
  color: var(--blog-green);
  opacity: 0;
  transition: opacity 0.3s;
}

.reg-flow-arrow--visible {
  opacity: 1;
}

@keyframes pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(0, 148, 144, 0.3); }
  50% { box-shadow: 0 0 0 8px rgba(0, 148, 144, 0); }
}
</style>
