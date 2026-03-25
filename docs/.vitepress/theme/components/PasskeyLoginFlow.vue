<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  steps: {
    type: Array,
    default: () => [
      { label: 'acme.com', icon: '🌐', type: 'rp' },
      { label: 'OIDC Redirect', icon: '🔀', type: 'redirect' },
      { label: 'mobileid.ch', icon: '🛡️', type: 'idp' },
      { label: 'Biometrie', icon: '👆', type: 'auth' },
      { label: 'Login ✓', icon: '✅', type: 'success' },
    ],
  },
  fallbackSteps: {
    type: Array,
    default: () => [
      { label: 'Passkey fehlgeschlagen', icon: '⚠️' },
      { label: 'Andere Methode wählen', icon: '🔄' },
      { label: 'SIM / App / SMS', icon: '📱' },
    ],
  },
})

const activeStep = ref(-1)
const showFallback = ref(false)
const containerRef = ref(null)
let observer = null
let animationTimer = null
let fallbackTimer = null

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
  if (fallbackTimer) clearTimeout(fallbackTimer)
})

function startAnimation() {
  activeStep.value = 0
  animationTimer = setInterval(() => {
    if (activeStep.value >= props.steps.length - 1) {
      clearInterval(animationTimer)
      fallbackTimer = setTimeout(() => { showFallback.value = true }, 800)
      return
    }
    activeStep.value++
  }, 600)
}
</script>

<template>
  <div ref="containerRef" class="login-flow">
    <!-- Main Path -->
    <div class="login-flow-main">
      <div
        v-for="(step, i) in steps"
        :key="i"
        class="login-flow-step"
        :class="{
          'login-flow-step--active': i === activeStep,
          'login-flow-step--done': i < activeStep,
          'login-flow-step--hidden': i > activeStep,
          'login-flow-step--last': i === steps.length - 1 && i <= activeStep,
        }"
      >
        <div class="login-flow-box" :class="'login-flow-box--' + step.type">
          <span class="login-flow-icon">{{ step.icon }}</span>
          <span class="login-flow-label">{{ step.label }}</span>
        </div>
        <div v-if="i < steps.length - 1" class="login-flow-arrow" :class="{ 'login-flow-arrow--visible': i < activeStep }">→</div>
      </div>
    </div>

    <!-- Fallback Path -->
    <div class="login-flow-fallback" :class="{ 'login-flow-fallback--visible': showFallback }">
      <div class="login-flow-fallback-header">Fallback-Pfad</div>
      <div class="login-flow-fallback-steps">
        <span v-for="(step, i) in fallbackSteps" :key="i" class="login-flow-fallback-item">
          {{ step.icon }} {{ step.label }}
          <span v-if="i < fallbackSteps.length - 1" class="login-flow-fallback-sep">→</span>
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-flow {
  margin: 1.5em 0;
  font-family: 'Lato', sans-serif;
}

.login-flow-main {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  padding: 24px 0;
}

.login-flow-step {
  display: flex;
  align-items: center;
  opacity: 0;
  transform: translateX(-10px);
  transition: opacity 0.4s, transform 0.4s;
}

.login-flow-step--active,
.login-flow-step--done,
.login-flow-step--last {
  opacity: 1;
  transform: translateX(0);
}

.login-flow-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px 10px;
  border-radius: 8px;
  white-space: nowrap;
  border: 2px solid transparent;
  transition: border-color 0.3s, background 0.3s;
}

.login-flow-box--rp {
  background: var(--blog-bg-subtle);
}

.login-flow-box--redirect {
  background: rgba(0, 148, 144, 0.1);
}

.login-flow-box--idp {
  background: rgba(0, 148, 144, 0.15);
}

.login-flow-box--auth {
  background: rgba(0, 148, 144, 0.1);
}

.login-flow-box--success {
  background: var(--blog-green-40);
  color: #fff;
}

.dark .login-flow-box--rp { background: rgba(255, 255, 255, 0.05); }
.dark .login-flow-box--redirect { background: rgba(0, 148, 144, 0.15); }
.dark .login-flow-box--idp { background: rgba(0, 148, 144, 0.2); }
.dark .login-flow-box--auth { background: rgba(0, 148, 144, 0.15); }

.login-flow-step--active .login-flow-box {
  border-color: var(--blog-green);
  animation: login-pulse 1.5s ease-in-out infinite;
}

.login-flow-step--last .login-flow-box {
  animation: none;
}

.login-flow-icon {
  font-size: 1em;
}

.login-flow-label {
  font-size: 0.7em;
  font-weight: 600;
  color: var(--blog-text);
}

.login-flow-step--last .login-flow-label {
  color: #fff;
}

.login-flow-arrow {
  padding: 0 4px;
  font-size: 1em;
  color: var(--blog-green);
  opacity: 0;
  transition: opacity 0.3s;
}

.login-flow-arrow--visible {
  opacity: 1;
}

/* Fallback */
.login-flow-fallback {
  margin-top: 12px;
  padding: 14px 16px;
  background: rgba(167, 0, 100, 0.04);
  border-radius: 10px;
  border-left: 3px solid var(--blog-pink);
  opacity: 0;
  transform: translateY(8px);
  transition: opacity 0.5s, transform 0.5s;
}

.login-flow-fallback--visible {
  opacity: 1;
  transform: translateY(0);
}

.dark .login-flow-fallback {
  background: rgba(167, 0, 100, 0.1);
}

.login-flow-fallback-header {
  font-size: 0.8em;
  font-weight: 700;
  color: var(--blog-pink);
  margin-bottom: 6px;
}

.login-flow-fallback-steps {
  font-size: 0.85em;
  color: var(--blog-text-muted);
}

.login-flow-fallback-item {
  white-space: nowrap;
}

.login-flow-fallback-sep {
  padding: 0 6px;
  color: var(--blog-pink-80);
}

@keyframes login-pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(0, 148, 144, 0.3); }
  50% { box-shadow: 0 0 0 8px rgba(0, 148, 144, 0); }
}
</style>
