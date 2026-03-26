<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  lang: { type: String, default: 'en' },
})

const i18n = {
  en: {
    requirement: 'NIST AAL3 Requirements',
    cloudSync: 'Cloud-Sync Passkey',
    push: 'Mobile ID Push',
    hybrid: 'Passkeys-Plus',
    rows: [
      { label: 'Two-factor auth with distinct factors', cloud: true, push: true, hybrid: true },
      { label: 'Public-key cryptography', cloud: true, push: true, hybrid: true },
      { label: 'Non-exportable private key', cloud: false, push: true, hybrid: true },
      { label: 'Hardware-protected isolated environment', cloud: false, push: true, hybrid: true },
      { label: 'Replay resistance', cloud: true, push: true, hybrid: true },
      { label: 'Authentication intent', cloud: true, push: true, hybrid: true },
      { label: 'Authenticated protected channels', cloud: true, push: true, hybrid: true },
      { label: 'Phishing resistance / verifier name binding', cloud: true, push: 'partial', hybrid: true },
      { label: 'FIPS 140 validation (Level 1+)', cloud: false, push: 'conditional', hybrid: 'conditional' },
      { label: 'Device attestation', cloud: false, push: 'conditional', hybrid: 'conditional', extra: true },
      { label: 'User consent on-device', cloud: false, push: true, hybrid: true, extra: true },
      { label: 'Geoblocking', cloud: false, push: true, hybrid: true, extra: true },
    ],
    planned: 'after enhancement',
    partial: 'No in browser / Yes in closed journeys',
    conditional: 'with suitable FIPS 140 Level 1+ validated hardware',
    additionalChip: 'Additional',
    additionalNote: 'Rows tagged "Additional" are supplementary controls and not part of the NIST AAL3 criteria.',
  },
  de: {
    requirement: 'NIST-AAL3-Anforderungen',
    cloudSync: 'Cloud-Sync Passkey',
    push: 'Mobile ID Push',
    hybrid: 'Passkeys-Plus',
    rows: [
      { label: 'Zwei-Faktor-Authentisierung mit unterschiedlichen Faktoren', cloud: true, push: true, hybrid: true },
      { label: 'Public-Key-Kryptografie', cloud: true, push: true, hybrid: true },
      { label: 'Nicht exportierbarer privater Schlüssel', cloud: false, push: true, hybrid: true },
      { label: 'Hardware-geschützte isolierte Ausführungsumgebung', cloud: false, push: true, hybrid: true },
      { label: 'Replay-Resistenz', cloud: true, push: true, hybrid: true },
      { label: 'Authentisierungsintention', cloud: true, push: true, hybrid: true },
      { label: 'Authentifizierte geschützte Kanäle', cloud: true, push: true, hybrid: true },
      { label: 'Phishing-Resistenz / Verifier Name Binding', cloud: true, push: 'partial', hybrid: true },
      { label: 'FIPS-140-Validierung (Level 1+)', cloud: false, push: 'conditional', hybrid: 'conditional' },
      { label: 'Geräteattestierung', cloud: false, push: 'conditional', hybrid: 'conditional', extra: true },
      { label: 'User Consent auf dem Gerät', cloud: false, push: true, hybrid: true, extra: true },
      { label: 'Geoblocking', cloud: false, push: true, hybrid: true, extra: true },
    ],
    planned: 'nach Erweiterung',
    partial: 'Nein im Browser / Ja in geschlossenen Journeys',
    conditional: 'mit geeigneter FIPS-140-Level-1+-validierter Hardware',
    additionalChip: 'Zusätzlich',
    additionalNote: 'Mit "Zusätzlich" markierte Zeilen sind ergänzende Kontrollen und keine NIST-AAL3-Kriterien.',
  },
  fr: {
    requirement: 'Exigences NIST AAL3',
    cloudSync: 'Cloud-Sync Passkey',
    push: 'Mobile ID Push',
    hybrid: 'Passkeys-Plus',
    rows: [
      { label: 'Authentification à deux facteurs avec facteurs distincts', cloud: true, push: true, hybrid: true },
      { label: 'Cryptographie à clé publique', cloud: true, push: true, hybrid: true },
      { label: 'Clé privée non exportable', cloud: false, push: true, hybrid: true },
      { label: 'Environnement isolé protégé par le matériel', cloud: false, push: true, hybrid: true },
      { label: 'Résistance au rejeu', cloud: true, push: true, hybrid: true },
      { label: "Intention d'authentification", cloud: true, push: true, hybrid: true },
      { label: 'Canaux protégés authentifiés', cloud: true, push: true, hybrid: true },
      { label: 'Résistance au phishing / liaison au nom du vérificateur', cloud: true, push: 'partial', hybrid: true },
      { label: 'Validation FIPS 140 (niveau 1+)', cloud: false, push: 'conditional', hybrid: 'conditional' },
      { label: "Attestation de l'appareil", cloud: false, push: 'conditional', hybrid: 'conditional', extra: true },
      { label: "Consentement utilisateur sur l'appareil", cloud: false, push: true, hybrid: true, extra: true },
      { label: 'Géoblocage', cloud: false, push: true, hybrid: true, extra: true },
    ],
    planned: 'après extension',
    partial: 'Non dans le navigateur / Oui en parcours fermés',
    conditional: 'avec matériel approprié validé FIPS 140 niveau 1+',
    additionalChip: 'Supplémentaire',
    additionalNote: 'Les lignes marquées « Supplémentaire » sont des contrôles additionnels et ne font pas partie des critères NIST AAL3.',
  },
  it: {
    requirement: 'Requisiti NIST AAL3',
    cloudSync: 'Cloud-Sync Passkey',
    push: 'Mobile ID Push',
    hybrid: 'Passkeys-Plus',
    rows: [
      { label: 'Autenticazione a due fattori con fattori distinti', cloud: true, push: true, hybrid: true },
      { label: 'Crittografia a chiave pubblica', cloud: true, push: true, hybrid: true },
      { label: 'Chiave privata non esportabile', cloud: false, push: true, hybrid: true },
      { label: 'Ambiente isolato protetto da hardware', cloud: false, push: true, hybrid: true },
      { label: 'Resistenza al replay', cloud: true, push: true, hybrid: true },
      { label: 'Intenzione di autenticazione', cloud: true, push: true, hybrid: true },
      { label: 'Canali protetti autenticati', cloud: true, push: true, hybrid: true },
      { label: 'Resistenza al phishing / binding del nome del verifier', cloud: true, push: 'partial', hybrid: true },
      { label: 'Validazione FIPS 140 (livello 1+)', cloud: false, push: 'conditional', hybrid: 'conditional' },
      { label: 'Attestazione del dispositivo', cloud: false, push: 'conditional', hybrid: 'conditional', extra: true },
      { label: 'Consenso utente sul dispositivo', cloud: false, push: true, hybrid: true, extra: true },
      { label: 'Geoblocking', cloud: false, push: true, hybrid: true, extra: true },
    ],
    planned: 'dopo ampliamento',
    partial: 'No nel browser / Sì nei percorsi chiusi',
    conditional: 'con hardware idoneo validato FIPS 140 livello 1+',
    additionalChip: 'Aggiuntivo',
    additionalNote: 'Le righe contrassegnate come « Aggiuntivo » sono controlli supplementari e non fanno parte dei criteri NIST AAL3.',
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
      <div class="hybrid-cell hybrid-label">
        <div class="hybrid-label-line">
          <span>{{ row.label }}</span>
          <span v-if="row.extra" class="hybrid-label-chip">{{ t.additionalChip }}</span>
        </div>
      </div>
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
    <p class="hybrid-note">{{ t.additionalNote }}</p>
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

.hybrid-label-line {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.hybrid-label-chip {
  display: inline-flex;
  align-items: center;
  padding: 2px 6px;
  border-radius: 999px;
  font-size: 0.68em;
  font-weight: 700;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  background: rgba(15, 118, 110, 0.12);
  color: var(--blog-green);
}

.dark .hybrid-label-chip {
  background: rgba(16, 185, 129, 0.14);
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

.hybrid-note {
  margin: 0.7em 0 0;
  font-size: 0.78em;
  color: var(--blog-text-muted);
  line-height: 1.4;
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
