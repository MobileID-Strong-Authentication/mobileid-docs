<script setup>
defineProps({
  levels: {
    type: Array,
    default: () => [
      {
        acr: 'mid_al2_any',
        label: 'UX-focused / AL2',
        description: 'Passkey preferred, fallback to SIM/App/SMS',
        color: 'green',
      },
      {
        acr: 'mid_al4_any',
        label: 'Security-focused / AL4',
        description: 'Passkey preferred, fallback to SIM/App',
        color: 'darkgreen',
      },
      {
        acr: 'mid_al4_passkey',
        label: 'Highest security / AL4',
        description: 'Passkey-only, no fallback; can satisfy NIST AAL3 in suitable deployments',
        color: 'pink',
      },
    ],
  },
})

const colorMap = {
  green: { border: 'var(--blog-green)', bg: 'rgba(0, 148, 144, 0.06)' },
  darkgreen: { border: 'var(--blog-green-80)', bg: 'rgba(0, 123, 119, 0.06)' },
  pink: { border: 'var(--blog-pink)', bg: 'rgba(167, 0, 100, 0.06)' },
}
</script>

<template>
  <div class="acr-levels">
    <div
      v-for="level in levels"
      :key="level.acr"
      class="acr-card"
      tabindex="0"
      :style="{
        borderTopColor: colorMap[level.color]?.border || 'var(--blog-green)',
        background: colorMap[level.color]?.bg || 'rgba(0,148,144,0.06)',
      }"
    >
      <code class="acr-code">{{ level.acr }}</code>
      <div class="acr-label">{{ level.label }}</div>
      <div class="acr-description">{{ level.description }}</div>
    </div>
  </div>
</template>

<style scoped>
.acr-levels {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin: 1.5em 0;
}

.acr-card {
  border-radius: 10px;
  padding: 20px;
  border-top: 4px solid;
  transition: transform 0.2s, box-shadow 0.2s;
}

.acr-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.dark .acr-card {
  background: rgba(255, 255, 255, 0.05) !important;
}

.dark .acr-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
}

.acr-code {
  font-size: 0.8em;
  font-weight: 700;
  display: block;
  margin-bottom: 6px;
  color: var(--blog-text);
}

.acr-label {
  font-size: 0.85em;
  font-weight: 600;
  font-family: 'Lato', sans-serif;
  margin-bottom: 8px;
  color: var(--blog-text);
}

.acr-description {
  font-size: 0.8em;
  color: var(--blog-text-muted);
  line-height: 1.5;
  max-height: 0;
  overflow: hidden;
  opacity: 0;
  transition: max-height 0.3s, opacity 0.3s, margin 0.3s;
  margin-top: 0;
}

.acr-card:hover .acr-description,
.acr-card:focus-within .acr-description {
  max-height: 80px;
  opacity: 1;
  margin-top: 8px;
}

@media (hover: none) {
  .acr-description {
    max-height: 80px;
    opacity: 1;
    margin-top: 8px;
  }
}

@media (max-width: 600px) {
  .acr-levels {
    grid-template-columns: 1fr;
  }
}
</style>
