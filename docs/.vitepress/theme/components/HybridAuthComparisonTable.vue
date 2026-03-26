<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  lang: { type: String, default: 'en' },
})

const i18n = {
  en: {
    requirement: 'Requirement',
    cloudSync: 'Cloud-Sync Passkey',
    push: 'Mobile ID Push',
    hybrid: 'Hybrid Auth (Passkeys-Plus)',
    rows: [
      { label: 'Two-factor auth with distinct factors', cloud: true, push: true, hybrid: true },
      { label: 'Verifier Impersonation Resistance', cloud: true, push: true, hybrid: true },
      { label: 'Device-bound Key Storage', cloud: false, push: true, hybrid: true },
      { label: 'Replay Resistance', cloud: true, push: true, hybrid: true },
      { label: 'Authentication Intent (User Presence)', cloud: true, push: true, hybrid: true },
      { label: 'Explicit Authentication Intent', cloud: true, push: true, hybrid: true },
      { label: 'Authenticated Protected Channels', cloud: true, push: true, hybrid: true },
      { label: 'HW FIPS-validated + Device Attestation', cloud: false, push: 'conditional', hybrid: 'conditional' },
      { label: 'Phishing-resistant', cloud: true, push: 'partial', hybrid: true },
      { label: 'User Consent On-Device', cloud: false, push: true, hybrid: true },
      { label: 'Geoblocking', cloud: false, push: true, hybrid: true },
    ],
    planned: 'after enhancement',
    partial: 'No in browser / Yes in closed journeys',
    conditional: 'with suitable FIPS 140-2 certified hardware',
  },
  de: {
    requirement: 'Anforderung',
    cloudSync: 'Cloud-Sync Passkey',
    push: 'Mobile ID Push',
    hybrid: 'Hybrid Auth (Passkeys-Plus)',
    rows: [
      { label: 'Zwei-Faktor-Auth mit unterschiedlichen Faktoren', cloud: true, push: true, hybrid: true },
      { label: 'Verifier Impersonation Resistance', cloud: true, push: true, hybrid: true },
      { label: 'Device-bound Key Storage', cloud: false, push: true, hybrid: true },
      { label: 'Replay Resistance', cloud: true, push: true, hybrid: true },
      { label: 'Authentication Intent (User Presence)', cloud: true, push: true, hybrid: true },
      { label: 'Explicit Authentication Intent', cloud: true, push: true, hybrid: true },
      { label: 'Authenticated Protected Channels', cloud: true, push: true, hybrid: true },
      { label: 'HW FIPS-validated + Device Attestation', cloud: false, push: 'conditional', hybrid: 'conditional' },
      { label: 'Phishing-resistent', cloud: true, push: 'partial', hybrid: true },
      { label: 'User Consent On-Device', cloud: false, push: true, hybrid: true },
      { label: 'Geoblocking', cloud: false, push: true, hybrid: true },
    ],
    planned: 'nach Erweiterung',
    partial: 'Nein im Browser / Ja in geschlossenen Journeys',
    conditional: 'mit geeigneter FIPS-140-2-zertifizierter Hardware',
  },
  fr: {
    requirement: 'Exigence',
    cloudSync: 'Cloud-Sync Passkey',
    push: 'Mobile ID Push',
    hybrid: 'Hybrid Auth (Passkeys-Plus)',
    rows: [
      { label: 'Authentification à deux facteurs avec facteurs distincts', cloud: true, push: true, hybrid: true },
      { label: "Résistance à l'usurpation du vérificateur", cloud: true, push: true, hybrid: true },
      { label: "Stockage de clé lié à l'appareil", cloud: false, push: true, hybrid: true },
      { label: 'Résistance au rejeu', cloud: true, push: true, hybrid: true },
      { label: "Intention d'authentification (présence de l'utilisateur)", cloud: true, push: true, hybrid: true },
      { label: "Intention d'authentification explicite", cloud: true, push: true, hybrid: true },
      { label: 'Canaux protégés authentifiés', cloud: true, push: true, hybrid: true },
      { label: 'HW validé FIPS + Device Attestation', cloud: false, push: 'conditional', hybrid: 'conditional' },
      { label: 'Résistant au phishing', cloud: true, push: 'partial', hybrid: true },
      { label: "Consentement utilisateur sur l'appareil", cloud: false, push: true, hybrid: true },
      { label: 'Géoblocage', cloud: false, push: true, hybrid: true },
    ],
    planned: 'après extension',
    partial: 'Non dans le navigateur / Oui en parcours fermés',
    conditional: 'avec matériel approprié certifié FIPS 140-2',
  },
  it: {
    requirement: 'Requisito',
    cloudSync: 'Cloud-Sync Passkey',
    push: 'Mobile ID Push',
    hybrid: 'Hybrid Auth (Passkeys-Plus)',
    rows: [
      { label: 'Autenticazione a due fattori con fattori distinti', cloud: true, push: true, hybrid: true },
      { label: "Resistenza all'impersonazione del verificatore", cloud: true, push: true, hybrid: true },
      { label: 'Archiviazione chiave legata al dispositivo', cloud: false, push: true, hybrid: true },
      { label: 'Resistenza al replay', cloud: true, push: true, hybrid: true },
      { label: 'Intenzione di autenticazione (User Presence)', cloud: true, push: true, hybrid: true },
      { label: 'Intenzione di autenticazione esplicita', cloud: true, push: true, hybrid: true },
      { label: 'Canali protetti autenticati', cloud: true, push: true, hybrid: true },
      { label: 'HW validato FIPS + Device Attestation', cloud: false, push: 'conditional', hybrid: 'conditional' },
      { label: 'Resistente al phishing', cloud: true, push: 'partial', hybrid: true },
      { label: 'Consenso utente sul dispositivo', cloud: false, push: true, hybrid: true },
      { label: 'Geoblocking', cloud: false, push: true, hybrid: true },
    ],
    planned: 'dopo ampliamento',
    partial: 'No nel browser / Sì nei percorsi chiusi',
    conditional: 'con hardware idoneo certificato FIPS 140-2',
  },
}

const t = computed(() => i18n[props.lang] || i18n.en)

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
    if (visibleRows.value >= t.value.rows.length) {
      clearInterval(animationTimer)
      return
    }
    visibleRows.value++
  }, 120)
}

function cellClass(val) {
  if (val === true) return 'cell-yes'
  if (val === false) return 'cell-no'
  if (val === 'planned') return 'cell-planned'
  if (val === 'partial') return 'cell-partial'
  if (val === 'conditional') return 'cell-conditional'
  return ''
}

function cellDisplay(val) {
  if (val === true) return '✓'
  if (val === false) return '✗'
  if (val === 'planned') return '✓ *'
  if (val === 'partial') return '~'
  if (val === 'conditional') return '✓ **'
  return val
}

function cellTooltip(val) {
  if (val === 'planned') return t.value.planned
  if (val === 'partial') return t.value.partial
  if (val === 'conditional') return t.value.conditional
  return null
}
</script>

<template>
  <div ref="containerRef" class="hybrid-table">
    <div class="hybrid-header">
      <div class="hybrid-cell hybrid-label">{{ t.requirement }}</div>
      <div class="hybrid-cell hybrid-method">
        <span class="hybrid-method-icon">🔑</span>
        <span>{{ t.cloudSync }}</span>
      </div>
      <div class="hybrid-cell hybrid-method">
        <span class="hybrid-method-icon">📱</span>
        <span>{{ t.push }}</span>
      </div>
      <div class="hybrid-cell hybrid-method hybrid-method--highlight">
        <span class="hybrid-method-icon">🛡️</span>
        <span>{{ t.hybrid }}</span>
      </div>
    </div>
    <div
      v-for="(row, i) in t.rows"
      :key="i"
      class="hybrid-row"
      :class="{ 'hybrid-row--visible': i < visibleRows }"
    >
      <div class="hybrid-cell hybrid-label">{{ row.label }}</div>
      <div class="hybrid-cell hybrid-value" :class="cellClass(row.cloud)">
        <span class="hybrid-badge" :title="cellTooltip(row.cloud)">{{ cellDisplay(row.cloud) }}</span>
      </div>
      <div class="hybrid-cell hybrid-value" :class="cellClass(row.push)">
        <span class="hybrid-badge" :title="cellTooltip(row.push)">{{ cellDisplay(row.push) }}</span>
        <span v-if="cellTooltip(row.push)" class="hybrid-footnote">{{ cellTooltip(row.push) }}</span>
      </div>
      <div class="hybrid-cell hybrid-value hybrid-col--highlight" :class="cellClass(row.hybrid)">
        <span class="hybrid-badge" :title="cellTooltip(row.hybrid)">{{ cellDisplay(row.hybrid) }}</span>
        <span v-if="cellTooltip(row.hybrid)" class="hybrid-footnote">{{ cellTooltip(row.hybrid) }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hybrid-table {
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--blog-border);
  margin: 1.5em 0;
  font-family: 'Lato', sans-serif;
}

.hybrid-header {
  display: grid;
  grid-template-columns: 1.6fr 1fr 1fr 1fr;
  background: var(--blog-bg-subtle);
  font-weight: 700;
  font-size: 0.82em;
}

.hybrid-row {
  display: grid;
  grid-template-columns: 1.6fr 1fr 1fr 1fr;
  border-top: 1px solid var(--blog-border);
  opacity: 0;
  transform: translateY(8px);
  transition: opacity 0.3s, transform 0.3s;
}

.hybrid-row--visible {
  opacity: 1;
  transform: translateY(0);
}

.hybrid-row:hover {
  background: var(--blog-bg-subtle);
}

.hybrid-cell {
  padding: 11px 14px;
  font-size: 0.85em;
}

.hybrid-label {
  font-weight: 600;
  color: var(--blog-text);
}

.hybrid-method {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.hybrid-method-icon {
  font-size: 1.2em;
}

.hybrid-method--highlight {
  background: rgba(16, 185, 129, 0.08);
}

.dark .hybrid-method--highlight {
  background: rgba(16, 185, 129, 0.12);
}

.hybrid-col--highlight {
  background: rgba(16, 185, 129, 0.04);
}

.dark .hybrid-col--highlight {
  background: rgba(16, 185, 129, 0.06);
}

.hybrid-value {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
}

.hybrid-badge {
  font-size: 1em;
  font-weight: 700;
}

.cell-yes .hybrid-badge {
  color: var(--blog-green);
}

.cell-no .hybrid-badge {
  color: var(--blog-text-muted);
  opacity: 0.5;
}

.cell-planned .hybrid-badge {
  color: var(--blog-green-80, #6ee7b7);
}

.cell-partial .hybrid-badge {
  color: #b45309;
  font-size: 0.9em;
}

.dark .cell-partial .hybrid-badge {
  color: #fbbf24;
}

.hybrid-footnote {
  font-size: 0.7em;
  color: var(--blog-text-muted);
  line-height: 1.2;
  max-width: 140px;
}

@media (max-width: 768px) {
  .hybrid-table {
    overflow-x: auto;
  }
  .hybrid-header,
  .hybrid-row {
    min-width: 600px;
  }
}
</style>
