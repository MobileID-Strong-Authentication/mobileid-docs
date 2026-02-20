<script setup>
import { useData, useRoute } from 'vitepress'
import { computed } from 'vue'

const REPO = 'MobileID-Strong-Authentication/mobileid-docs'

const { page, frontmatter } = useData()
const route = useRoute()

const feedbackUrl = computed(() => {
  const title = encodeURIComponent(`Feedback: ${page.value.title}`)
  const path = page.value.relativePath
  const body = encodeURIComponent(
    `**Page:** ${page.value.title}\n**Path:** \`${path}\`\n\n---\n\n_Your feedback:_\n\n`
  )
  return `https://github.com/${REPO}/issues/new?title=${title}&body=${body}&labels=feedback`
})
</script>

<template>
  <div v-if="frontmatter?.layout !== 'home'" class="doc-feedback">
    <a :href="feedbackUrl" target="_blank" rel="noopener noreferrer">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
        style="vertical-align: -2px; margin-right: 4px;">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      </svg>
      Give feedback on this page
    </a>
  </div>
</template>

<style scoped>
.doc-feedback {
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid var(--vp-c-divider);
  font-size: 0.85rem;
}

.doc-feedback a {
  color: var(--vp-c-text-2);
  text-decoration: none;
  transition: color 0.2s;
}

.doc-feedback a:hover {
  color: var(--vp-c-brand-1);
}
</style>
