<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const containerRef = ref(null)
const phase = ref(0) // 0=hidden, 1=step1, 2=step2, 3=result
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
    if (phase.value >= 3) {
      clearInterval(timer)
      return
    }
    phase.value++
  }, 1000)
}

</script>

<template>
  <div ref="containerRef" class="hybrid-flow">
    <!-- Visual Flow -->
    <div class="hybrid-steps">
      <div class="hybrid-step" :class="{ 'hybrid-step--active': phase >= 1 }">
        <div class="hybrid-step-badge hybrid-step-badge--green">Step 1</div>
        <div class="hybrid-step-title">Cloud-Sync Passkey</div>
        <div class="hybrid-step-desc">Phishing-resistant, Origin-bound</div>
        <div class="hybrid-step-level">AAL2</div>
      </div>

      <div class="hybrid-plus" :class="{ 'hybrid-plus--active': phase >= 2 }">+</div>

      <div class="hybrid-step" :class="{ 'hybrid-step--active': phase >= 2 }">
        <div class="hybrid-step-badge hybrid-step-badge--pink">Step 2</div>
        <div class="hybrid-step-title">Mobile ID Push Step-Up</div>
        <div class="hybrid-step-desc">Device-bound, Non-exportable Key, User Consent</div>
        <div class="hybrid-step-level">TEE/SIM</div>
      </div>

      <div class="hybrid-equals" :class="{ 'hybrid-equals--active': phase >= 3 }">=</div>

      <div class="hybrid-result" :class="{ 'hybrid-result--active': phase >= 3 }">
        <div class="hybrid-result-title">Hybrid Auth</div>
        <div class="hybrid-result-desc">AAL3 possible with suitable FIPS 140-2 hardware</div>
        <div class="hybrid-result-badge">AAL3 possible</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hybrid-flow {
  margin: 1.5em 0;
  font-family: 'Lato', sans-serif;
}

.hybrid-steps {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px 0;
  flex-wrap: nowrap;
}

.hybrid-step {
  background: var(--blog-bg-subtle);
  border-radius: 10px;
  padding: 10px 12px;
  text-align: center;
  min-width: 0;
  flex: 1 1 0;
  max-width: 180px;
  opacity: 0;
  transform: scale(0.9);
  transition: opacity 0.5s, transform 0.5s;
}

.hybrid-step--active {
  opacity: 1;
  transform: scale(1);
}

.dark .hybrid-step {
  background: rgba(255, 255, 255, 0.05);
}

.hybrid-step-badge {
  font-size: 0.65em;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  padding: 2px 8px;
  border-radius: 10px;
  display: inline-block;
  margin-bottom: 4px;
  color: #fff;
}

.hybrid-step-badge--green { background: var(--blog-green); }
.hybrid-step-badge--pink { background: var(--blog-pink); }

.hybrid-step-title {
  font-weight: 700;
  font-size: 0.8em;
  color: var(--blog-text);
  margin-bottom: 2px;
}

.hybrid-step-desc {
  font-size: 0.68em;
  color: var(--blog-text-muted);
  line-height: 1.3;
}

.hybrid-step-level {
  font-size: 0.65em;
  font-weight: 700;
  color: var(--blog-green-80);
  margin-top: 4px;
}

.hybrid-plus,
.hybrid-equals {
  font-size: 1.2em;
  font-weight: 700;
  color: var(--blog-green);
  opacity: 0;
  transition: opacity 0.5s;
  flex-shrink: 0;
}

.hybrid-plus--active,
.hybrid-equals--active {
  opacity: 1;
}

.hybrid-result {
  background: var(--blog-green-40);
  color: #fff;
  border-radius: 10px;
  padding: 10px 12px;
  text-align: center;
  min-width: 0;
  flex: 1 1 0;
  max-width: 180px;
  opacity: 0;
  transform: scale(0.9);
  transition: opacity 0.5s, transform 0.5s;
}

.hybrid-result--active {
  opacity: 1;
  transform: scale(1);
}

.hybrid-result-title {
  font-weight: 700;
  font-size: 0.85em;
  margin-bottom: 2px;
}

.hybrid-result-desc {
  font-size: 0.68em;
  opacity: 0.85;
  margin-bottom: 4px;
}

.hybrid-result-badge {
  font-size: 0.8em;
  font-weight: 700;
}

@media (max-width: 600px) {
  .hybrid-steps {
    flex-direction: column;
    flex-wrap: wrap;
  }
  .hybrid-step {
    min-width: auto;
    max-width: none;
    width: 100%;
    flex: none;
  }
  .hybrid-result {
    min-width: auto;
    max-width: none;
    width: 100%;
    flex: none;
  }
}
</style>
