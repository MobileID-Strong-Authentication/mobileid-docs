<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const containerRef = ref(null)
const phase = ref(0)
let observer = null
let timer = null

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
  if (timer) clearInterval(timer)
})

function startAnimation() {
  phase.value = 1
  timer = setInterval(() => {
    if (phase.value >= 5) {
      clearInterval(timer)
      return
    }
    phase.value++
  }, 800)
}
</script>

<template>
  <div ref="containerRef" class="entra-flow">
    <div class="entra-flow-steps">
      <div class="entra-flow-step" :class="{ 'entra-flow-step--active': phase >= 1 }">
        <div class="entra-flow-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        </div>
        <div class="entra-flow-label">User signs in</div>
        <div class="entra-flow-sublabel">Microsoft 365, Azure, VPN</div>
      </div>

      <div class="entra-flow-arrow" :class="{ 'entra-flow-arrow--active': phase >= 2 }">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
      </div>

      <div class="entra-flow-step entra-flow-step--entra" :class="{ 'entra-flow-step--active': phase >= 2 }">
        <div class="entra-flow-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        </div>
        <div class="entra-flow-label">Entra ID</div>
        <div class="entra-flow-sublabel">Conditional Access evaluates policy</div>
      </div>

      <div class="entra-flow-arrow" :class="{ 'entra-flow-arrow--active': phase >= 3 }">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
      </div>

      <div class="entra-flow-step entra-flow-step--mid" :class="{ 'entra-flow-step--active': phase >= 3 }">
        <div class="entra-flow-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
        </div>
        <div class="entra-flow-label">Mobile ID</div>
        <div class="entra-flow-sublabel">Provider-side method is selected</div>
      </div>

      <div class="entra-flow-arrow" :class="{ 'entra-flow-arrow--active': phase >= 4 }">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
      </div>

      <div class="entra-flow-step entra-flow-step--success" :class="{ 'entra-flow-step--active': phase >= 5 }">
        <div class="entra-flow-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        </div>
        <div class="entra-flow-label">Access Granted</div>
        <div class="entra-flow-sublabel">MFA satisfied, token issued</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.entra-flow {
  margin: 1.5em 0;
  font-family: 'Lato', sans-serif;
}

.entra-flow-steps {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 16px 0;
  flex-wrap: nowrap;
}

.entra-flow-step {
  background: var(--blog-bg-subtle);
  border-radius: 10px;
  padding: 12px 8px;
  text-align: center;
  min-width: 0;
  flex: 1 1 0;
  max-width: 140px;
  opacity: 0;
  transform: translateY(10px);
  transition: opacity 0.5s, transform 0.5s;
}

.entra-flow-step--active {
  opacity: 1;
  transform: translateY(0);
}

.dark .entra-flow-step {
  background: rgba(255, 255, 255, 0.05);
}

.entra-flow-step--entra.entra-flow-step--active {
  border: 2px solid #0078d4;
}

.entra-flow-step--mid.entra-flow-step--active {
  border: 2px solid var(--blog-green);
}

.entra-flow-step--success.entra-flow-step--active {
  background: var(--blog-green-40);
  color: #fff;
}

.entra-flow-icon {
  width: 28px;
  height: 28px;
  margin: 0 auto 6px;
  color: var(--blog-green);
}

.entra-flow-step--entra .entra-flow-icon {
  color: #0078d4;
}

.entra-flow-step--success .entra-flow-icon {
  color: #fff;
}

.entra-flow-label {
  font-weight: 700;
  font-size: 0.75em;
  color: var(--blog-text);
  margin-bottom: 2px;
}

.entra-flow-step--success .entra-flow-label {
  color: #fff;
}

.entra-flow-sublabel {
  font-size: 0.62em;
  color: var(--blog-text-muted);
  line-height: 1.3;
}

.entra-flow-step--success .entra-flow-sublabel {
  color: rgba(255, 255, 255, 0.85);
}

.entra-flow-arrow {
  width: 20px;
  height: 20px;
  color: var(--blog-green);
  opacity: 0;
  transition: opacity 0.4s;
  flex-shrink: 0;
}

.entra-flow-arrow--active {
  opacity: 1;
}

@media (max-width: 600px) {
  .entra-flow-steps {
    flex-direction: column;
    gap: 6px;
  }
  .entra-flow-step {
    max-width: none;
    width: 100%;
    flex: none;
  }
  .entra-flow-arrow {
    transform: rotate(90deg);
  }
}
</style>
