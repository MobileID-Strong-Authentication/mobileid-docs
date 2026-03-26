<script setup>
const types = [
  {
    title: 'Cloud-Synced',
    subtitle: 'Apple / Google',
    icon: '☁️',
    level: 'AAL2',
    color: 'green',
    traits: ['Convenient & available everywhere', 'Exportable', 'Best user experience'],
  },
  {
    title: 'Device-Bound',
    subtitle: 'YubiKey FIPS',
    icon: '🔐',
    level: 'AAL3',
    color: 'pink',
    traits: ['Highest security', 'Non-exportable', 'Hardware token required'],
  },
  {
    title: 'Platform',
    subtitle: 'Windows Hello / Touch ID',
    icon: '💻',
    level: 'AAL2–3',
    color: 'darkgreen',
    traits: ['Built-in & practical', 'Device-bound', 'No accessories needed'],
  },
  {
    title: 'MID Passkey Vault',
    subtitle: 'Roadmap',
    icon: '🇨🇭',
    level: 'AAL3',
    color: 'pink',
    traits: ['Device-bound as app', 'Scalable without tokens', 'Swiss Sovereignty'],
    roadmap: true,
  },
]

const colorMap = {
  green: { border: 'var(--blog-green)', bg: 'rgba(0, 148, 144, 0.06)', badge: 'var(--blog-green)' },
  darkgreen: { border: 'var(--blog-green-80)', bg: 'rgba(0, 123, 119, 0.06)', badge: 'var(--blog-green-80)' },
  pink: { border: 'var(--blog-pink)', bg: 'rgba(167, 0, 100, 0.06)', badge: 'var(--blog-pink)' },
}
</script>

<template>
  <div class="passkey-types">
    <div
      v-for="type in types"
      :key="type.title"
      class="passkey-type-card"
      :class="{ 'passkey-type-card--roadmap': type.roadmap }"
      :style="{
        borderTopColor: colorMap[type.color].border,
        background: colorMap[type.color].bg,
      }"
    >
      <div class="passkey-type-header">
        <span class="passkey-type-icon">{{ type.icon }}</span>
        <div>
          <div class="passkey-type-title">{{ type.title }}</div>
          <div class="passkey-type-subtitle">{{ type.subtitle }}</div>
        </div>
      </div>
      <span
        class="passkey-type-badge"
        :style="{ background: colorMap[type.color].badge }"
      >
        {{ type.level }}
      </span>
      <ul class="passkey-type-traits">
        <li v-for="trait in type.traits" :key="trait">{{ trait }}</li>
      </ul>
      <div v-if="type.roadmap" class="passkey-type-roadmap-tag">Roadmap</div>
    </div>
  </div>
</template>

<style scoped>
.passkey-types {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin: 1.5em 0;
}

.passkey-type-card {
  border-radius: 12px;
  padding: 20px;
  border-top: 4px solid;
  position: relative;
  transition: transform 0.2s, box-shadow 0.2s;
}

.passkey-type-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.dark .passkey-type-card {
  background: rgba(255, 255, 255, 0.05) !important;
}

.dark .passkey-type-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
}

.passkey-type-card--roadmap {
  border-style: dashed;
  border-top-style: solid;
}

.passkey-type-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.passkey-type-icon {
  font-size: 1.8em;
}

.passkey-type-title {
  font-family: 'Lato', sans-serif;
  font-weight: 700;
  font-size: 1em;
  color: var(--blog-text);
}

.passkey-type-subtitle {
  font-size: 0.8em;
  color: var(--blog-text-muted);
}

.passkey-type-badge {
  display: inline-block;
  font-family: 'Lato', sans-serif;
  font-size: 0.75em;
  font-weight: 700;
  color: #fff;
  padding: 3px 10px;
  border-radius: 20px;
  margin-bottom: 12px;
}

.passkey-type-traits {
  list-style: none;
  padding: 0;
  margin: 0;
}

.passkey-type-traits li {
  font-size: 0.85em;
  color: var(--blog-text-muted);
  padding: 3px 0;
  line-height: 1.5;
}

.passkey-type-traits li::before {
  content: '→ ';
  color: var(--blog-green);
  font-weight: 700;
}

.passkey-type-roadmap-tag {
  position: absolute;
  top: 12px;
  right: 12px;
  font-family: 'Lato', sans-serif;
  font-size: 0.7em;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--blog-pink);
  background: rgba(167, 0, 100, 0.08);
  padding: 2px 8px;
  border-radius: 4px;
}

@media (max-width: 600px) {
  .passkey-types {
    grid-template-columns: 1fr;
  }
}
</style>
