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

const criteria = [
  { label: 'Zwei Faktoren', cloud: '✅', push: '✅', hybrid: '✅✅' },
  { label: 'Public-Key Kryptografie (FIDO2)', cloud: '✅', push: '—', hybrid: '✅' },
  { label: 'Phishing-resistent (Browser)', cloud: '✅', push: '—', hybrid: '✅' },
  { label: 'Hardware-basiert (FIPS 140)', cloud: '❌', push: '✅', hybrid: '✅' },
  { label: 'Non-exportable Key', cloud: '❌', push: '✅', hybrid: '✅' },
  { label: 'User Intent / Consent', cloud: '✅', push: '✅', hybrid: '✅✅' },
]
</script>

<template>
  <div ref="containerRef" class="hybrid-flow">
    <!-- Visual Flow -->
    <div class="hybrid-steps">
      <div class="hybrid-step" :class="{ 'hybrid-step--active': phase >= 1 }">
        <div class="hybrid-step-badge hybrid-step-badge--green">Step 1</div>
        <div class="hybrid-step-title">Cloud-Sync Passkey</div>
        <div class="hybrid-step-desc">Phishing-resistent, Origin-bound</div>
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
        <div class="hybrid-result-desc">Alle NIST AAL3 Kriterien erfüllt</div>
        <div class="hybrid-result-badge">AAL3 ✅</div>
      </div>
    </div>

    <!-- Criteria Table -->
    <div class="hybrid-table" :class="{ 'hybrid-table--visible': phase >= 3 }">
      <div class="hybrid-table-header">
        <div class="hybrid-table-cell hybrid-table-label">Kriterium</div>
        <div class="hybrid-table-cell">Cloud-Sync Passkey</div>
        <div class="hybrid-table-cell">Mobile ID Push</div>
        <div class="hybrid-table-cell hybrid-table-highlight">Hybrid</div>
      </div>
      <div v-for="row in criteria" :key="row.label" class="hybrid-table-row">
        <div class="hybrid-table-cell hybrid-table-label">{{ row.label }}</div>
        <div class="hybrid-table-cell">{{ row.cloud }}</div>
        <div class="hybrid-table-cell">{{ row.push }}</div>
        <div class="hybrid-table-cell hybrid-table-highlight">{{ row.hybrid }}</div>
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
  gap: 12px;
  padding: 24px 0;
  flex-wrap: wrap;
}

.hybrid-step {
  background: var(--blog-bg-subtle);
  border-radius: 12px;
  padding: 16px 20px;
  text-align: center;
  min-width: 160px;
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
  font-size: 0.7em;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  padding: 2px 10px;
  border-radius: 12px;
  display: inline-block;
  margin-bottom: 8px;
  color: #fff;
}

.hybrid-step-badge--green { background: var(--blog-green); }
.hybrid-step-badge--pink { background: var(--blog-pink); }

.hybrid-step-title {
  font-weight: 700;
  font-size: 0.9em;
  color: var(--blog-text);
  margin-bottom: 4px;
}

.hybrid-step-desc {
  font-size: 0.75em;
  color: var(--blog-text-muted);
  line-height: 1.4;
}

.hybrid-step-level {
  font-size: 0.7em;
  font-weight: 700;
  color: var(--blog-green-80);
  margin-top: 6px;
}

.hybrid-plus,
.hybrid-equals {
  font-size: 1.6em;
  font-weight: 700;
  color: var(--blog-green);
  opacity: 0;
  transition: opacity 0.5s;
}

.hybrid-plus--active,
.hybrid-equals--active {
  opacity: 1;
}

.hybrid-result {
  background: var(--blog-green-40);
  color: #fff;
  border-radius: 12px;
  padding: 16px 24px;
  text-align: center;
  min-width: 160px;
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
  font-size: 1em;
  margin-bottom: 4px;
}

.hybrid-result-desc {
  font-size: 0.75em;
  opacity: 0.85;
  margin-bottom: 6px;
}

.hybrid-result-badge {
  font-size: 0.85em;
  font-weight: 700;
}

/* Criteria Table */
.hybrid-table {
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--blog-border);
  margin-top: 16px;
  opacity: 0;
  transform: translateY(12px);
  transition: opacity 0.6s, transform 0.6s;
}

.hybrid-table--visible {
  opacity: 1;
  transform: translateY(0);
}

.hybrid-table-header {
  display: grid;
  grid-template-columns: 1.6fr 1fr 1fr 1fr;
  background: var(--blog-bg-subtle);
  font-weight: 700;
  font-size: 0.8em;
}

.hybrid-table-row {
  display: grid;
  grid-template-columns: 1.6fr 1fr 1fr 1fr;
  border-top: 1px solid var(--blog-border);
}

.hybrid-table-cell {
  padding: 10px 12px;
  font-size: 0.85em;
  text-align: center;
}

.hybrid-table-label {
  text-align: left;
  font-weight: 600;
  color: var(--blog-text);
}

.hybrid-table-highlight {
  background: rgba(0, 148, 144, 0.05);
  font-weight: 600;
  color: var(--blog-green);
}

.dark .hybrid-table-highlight {
  background: rgba(0, 148, 144, 0.1);
}

@media (max-width: 600px) {
  .hybrid-steps {
    flex-direction: column;
  }
  .hybrid-step {
    min-width: auto;
    width: 100%;
  }
  .hybrid-result {
    min-width: auto;
    width: 100%;
  }
  .hybrid-table {
    overflow-x: auto;
  }
  .hybrid-table-header,
  .hybrid-table-row {
    min-width: 480px;
  }
}
</style>
