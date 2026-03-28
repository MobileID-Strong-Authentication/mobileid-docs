<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const containerRef = ref(null)
const visible = ref(false)
let observer = null

const useCases = [
  {
    icon: 'cloud',
    title: 'Microsoft 365 & Cloud Apps',
    desc: 'Secure access to Outlook, Teams, SharePoint and other cloud applications. Entra consumes the external MFA result while Mobile ID runs the strong method.',
    methods: ['SIM', 'App', 'Passkey'],
    color: 'blue'
  },
  {
    icon: 'shield',
    title: 'VPN & Remote Access',
    desc: 'Protect VPN gateways, Citrix, VDI and remote desktop sessions. SIM and App both work well for out-of-band MFA in client-driven and remote-session journeys.',
    methods: ['SIM', 'App'],
    color: 'green'
  },
  {
    icon: 'lock',
    title: 'Privileged Access',
    desc: 'Require an external MFA step for admin accounts and sensitive systems. Entra decides when MFA is needed; Mobile ID handles the provider-side method.',
    methods: ['SIM', 'App', 'Passkey'],
    color: 'pink'
  },
  {
    icon: 'users',
    title: 'Hybrid & Field Workforce',
    desc: 'Cover mixed workforces with one provider: SIM for users without smartphones, App for smartphone users, and passkeys for browser-centric journeys where enabled.',
    methods: ['SIM', 'App', 'Passkey'],
    color: 'teal'
  }
]

onMounted(() => {
  observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        visible.value = true
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
})
</script>

<template>
  <div ref="containerRef" class="uc-grid">
    <div
      v-for="(uc, i) in useCases"
      :key="i"
      class="uc-card"
      :class="[`uc-card--${uc.color}`, { 'uc-card--visible': visible }]"
      :style="{ transitionDelay: `${i * 150}ms` }"
    >
      <div class="uc-card-icon">
        <svg v-if="uc.icon === 'cloud'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>
        <svg v-if="uc.icon === 'shield'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        <svg v-if="uc.icon === 'lock'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        <svg v-if="uc.icon === 'users'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
      </div>
      <div class="uc-card-title">{{ uc.title }}</div>
      <div class="uc-card-desc">{{ uc.desc }}</div>
      <div class="uc-card-methods">
        <span v-for="m in uc.methods" :key="m" class="uc-method-tag">{{ m }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.uc-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin: 1.5em 0;
  font-family: 'Lato', sans-serif;
}

.uc-card {
  background: var(--blog-bg-subtle);
  border-radius: 10px;
  padding: 16px;
  opacity: 0;
  transform: translateY(12px);
  transition: opacity 0.5s, transform 0.5s;
}

.dark .uc-card {
  background: rgba(255, 255, 255, 0.05);
}

.uc-card--visible {
  opacity: 1;
  transform: translateY(0);
}

.uc-card--blue { border-top: 3px solid #0078d4; }
.uc-card--green { border-top: 3px solid var(--blog-green); }
.uc-card--pink { border-top: 3px solid var(--blog-pink); }
.uc-card--teal { border-top: 3px solid #00897b; }

.uc-card-icon {
  width: 28px;
  height: 28px;
  margin-bottom: 8px;
}

.uc-card--blue .uc-card-icon { color: #0078d4; }
.uc-card--green .uc-card-icon { color: var(--blog-green); }
.uc-card--pink .uc-card-icon { color: var(--blog-pink); }
.uc-card--teal .uc-card-icon { color: #00897b; }

.uc-card-title {
  font-weight: 700;
  font-size: 0.85em;
  color: var(--blog-text);
  margin-bottom: 6px;
}

.uc-card-desc {
  font-size: 0.75em;
  color: var(--blog-text-muted);
  line-height: 1.5;
  margin-bottom: 10px;
}

.uc-card-methods {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.uc-method-tag {
  display: inline-block;
  font-size: 0.6em;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 2px 8px;
  border-radius: 8px;
  background: var(--blog-green);
  color: #fff;
}

@media (max-width: 600px) {
  .uc-grid {
    grid-template-columns: 1fr;
  }
}
</style>
