# Blog + Mobile ID Passkeys Article Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a lightweight blog section to docs.mobileid.ch and publish the first article about Mobile ID Passkeys with animated Vue components.

**Architecture:** Custom VitePress blog using `createContentLoader` for the index, two custom layouts (blog-index, blog-post), and 6 Vue components for interactive article elements. Blog styling is scoped via `.blog-layout` class with locally bundled brand fonts.

**Tech Stack:** VitePress 1.6.4, Vue 3, CSS animations, Intersection Observer API

**Spec:** `docs/superpowers/specs/2026-03-23-blog-passkeys-design.md`

---

## File Map

### New Files

| File | Responsibility |
|------|---------------|
| `docs/blog/index.md` | Blog index page (frontmatter only, layout handles rendering) |
| `docs/blog/posts/2026-03-23-mobile-id-passkeys.md` | Passkeys article (Markdown + Vue components) |
| `docs/.vitepress/theme/BlogLayout.vue` | Blog index layout (header + card grid) |
| `docs/.vitepress/theme/BlogPostLayout.vue` | Article layout (hero + content wrapper) |
| `docs/.vitepress/theme/blog.css` | Blog-scoped CSS (@font-face, typography, dark mode) |
| `docs/.vitepress/theme/blog.data.mts` | Content loader for blog posts |
| `docs/.vitepress/theme/components/AudioPlayer.vue` | Custom audio player |
| `docs/.vitepress/theme/components/VideoEmbed.vue` | Custom video player |
| `docs/.vitepress/theme/components/ComparisonTable.vue` | Animated comparison table |
| `docs/.vitepress/theme/components/AcrLevels.vue` | ACR authentication level cards |
| `docs/.vitepress/theme/components/PasskeyRegistrationFlow.vue` | Animated registration flow diagram |
| `docs/.vitepress/theme/components/PasskeyLoginFlow.vue` | Animated login flow diagram with fallback |
| `docs/public/blog/fonts/Lato-Bold.woff2` | Lato Bold font file |
| `docs/public/blog/fonts/Merriweather-Regular.woff2` | Merriweather Regular font file |
| `docs/public/blog/fonts/Merriweather-Bold.woff2` | Merriweather Bold font file |
| `docs/public/blog/img/passkeys-infographic.png` | NotebookLM infographic |
| `docs/public/blog/media/passkeys-explainer.mp4` | NotebookLM explainer video |
| `docs/public/blog/media/passkeys-podcast.mp3` | NotebookLM audio podcast |
| `docs/public/blog/media/passkeys-blueprint.pdf` | NotebookLM slide deck PDF |

### Modified Files

| File | Change |
|------|--------|
| `docs/.vitepress/config.mts` | Add "Blog" nav item, add `'/blog/': false` sidebar rule |
| `docs/.vitepress/theme/index.js` | Import blog.css, register BlogLayout + BlogPostLayout as global components |

---

## Task 1: Download & Organize Assets

**Files:**
- Create: `docs/public/blog/fonts/` (3 font files)
- Create: `docs/public/blog/img/` (infographic)
- Create: `docs/public/blog/media/` (video, audio, PDF)

- [ ] **Step 1: Create directory structure**

```bash
mkdir -p docs/public/blog/fonts docs/public/blog/img docs/public/blog/media
```

- [ ] **Step 2: Download NotebookLM assets**

Download from the Google CDN URLs provided in the spec/task description:

```bash
# Infographic
curl -L -o docs/public/blog/img/passkeys-infographic.png "https://lh3.googleusercontent.com/notebooklm/ANHLwAzWq8MrOQ_wCvoySVnXGWZzFElrHEoLTSnGUwfVoxMnCP6WVri2FuaC3DI6YqLekS3lekNFbB8ehHBW4ubF5PD1LNL9AHHVpCpf_LdqX09G4ADyTVifDMXg_jK0OtSrXl8r9OJDb49OeirY8-K8o7nTIoQDdVo=w2752-d-h1536-mp2"

# Explainer video
curl -L -o docs/public/blog/media/passkeys-explainer.mp4 "https://lh3.googleusercontent.com/notebooklm/ANHLwAxAb-uBta-sP4M0dBQRg4P9LftY9MtlUV73oi8kNHQGvQNcOA953o1sA3u6VGQHfTzgFm_SgbUCGmmdMKYUfnDSKYUiNsmH7Lq2Yk0-ucF6cFeYW1Xh18POxz_SH8CvvslLBBrmQb10Lc_OD4jFSowodbUZzw=m22-dv"

# Audio podcast
curl -L -o docs/public/blog/media/passkeys-podcast.mp3 "https://lh3.googleusercontent.com/notebooklm/ANHLwAzwcqDmbk0i5Ii4ErfWCv5YSBEBblC8xEShhCYRYPYheB4kG8pPIcRFDhOMqARi4jOqBkg1JnXNskNBLZ3sb3yIqaBEIL9_Q-U8O0_D2jTED3tUXibubdnOTEFkhaKpnKgxEqNN9tUDW0sFa4hA_ZfZrjpBMqg=m140-dv"

# Slide deck PDF
curl -L -o docs/public/blog/media/passkeys-blueprint.pdf "https://contribution.usercontent.google.com/download?c=Cgpub3RlYm9va2xtEkYSD2FydGlmYWN0c19tZWRpYRozCiQ2MzUwY2FlYy0xZGU4LTQxZDctODhhMS1mOWZkZjVkMDU2MGESCxIHEKai9cn4GBgB&filename=Mobile_ID_Passkey_Blueprint.pdf&opi=96797242"
```

Expected: Each file downloaded successfully. Verify with `ls -la docs/public/blog/*/`.

If any download fails (auth-gated URL), flag it — the user will need to download manually and place the file.

- [ ] **Step 3: Download brand fonts**

Download Lato Bold and Merriweather from Google Fonts as woff2:

```bash
# Lato Bold
curl -L -o docs/public/blog/fonts/Lato-Bold.woff2 "https://fonts.gstatic.com/s/lato/v24/S6u9w4BMUTPHh6UVSwaPGR_p.woff2"

# Merriweather Regular
curl -L -o docs/public/blog/fonts/Merriweather-Regular.woff2 "https://fonts.gstatic.com/s/merriweather/v30/u-440qOEAgM0NhrzOQphFjyaQi8.woff2"

# Merriweather Bold
curl -L -o docs/public/blog/fonts/Merriweather-Bold.woff2 "https://fonts.gstatic.com/s/merriweather/v30/u-4n0qyriQwlOrhSvowK_l52xwNpXA.woff2"
```

Expected: 3 woff2 files in `docs/public/blog/fonts/`. Verify with `ls -la`.

Note: If the Google Fonts direct URLs don't work, use `fontsource` npm packages or download from fonts.google.com manually.

- [ ] **Step 4: Generate thumbnail from infographic**

Create a smaller thumbnail version for the blog index card:

```bash
# If ImageMagick is available:
convert docs/public/blog/img/passkeys-infographic.png -resize 720x400^ -gravity center -extent 720x400 docs/public/blog/img/passkeys-thumb.png

# If not available, copy the infographic as thumbnail (will work, just larger):
cp docs/public/blog/img/passkeys-infographic.png docs/public/blog/img/passkeys-thumb.png
```

- [ ] **Step 5: Commit**

```bash
git add docs/public/blog/
git commit -m "Add blog assets: fonts, infographic, video, audio, PDF"
```

---

## Task 2: Blog CSS & Font Loading

**Files:**
- Create: `docs/.vitepress/theme/blog.css`

- [ ] **Step 1: Create blog.css with font-face declarations and scoped styles**

Create `docs/.vitepress/theme/blog.css`:

```css
/* Blog-specific styles — scoped to .blog-layout */

/* Font Loading */
@font-face {
  font-family: 'Lato';
  src: url('/blog/fonts/Lato-Bold.woff2') format('woff2');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Merriweather';
  src: url('/blog/fonts/Merriweather-Regular.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Merriweather';
  src: url('/blog/fonts/Merriweather-Bold.woff2') format('woff2');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}

/* Typography & Colors */
.blog-layout {
  font-family: 'Merriweather', Georgia, serif;
  line-height: 1.618;

  --blog-green: #009490;
  --blog-green-80: #007B77;
  --blog-green-60: #00615D;
  --blog-green-40: #004844;
  --blog-pink: #A70064;
  --blog-pink-80: #8E004B;
  --blog-text: #333;
  --blog-text-muted: #666;
  --blog-bg-subtle: #f8f9fa;
  --blog-border: #e5e7eb;
  --blog-card-bg: #fff;
}

.blog-layout h1,
.blog-layout h2,
.blog-layout h3,
.blog-layout h4 {
  font-family: 'Lato', sans-serif;
  font-weight: 700;
  line-height: 1.333;
}

/* Dark Mode */
.dark .blog-layout {
  --blog-text: #e5e7eb;
  --blog-text-muted: #9ca3af;
  --blog-bg-subtle: #1a1a1a;
  --blog-border: #374151;
  --blog-card-bg: #1f2937;
}

/* Hero gradient (used by both layouts) */
.blog-hero {
  background: linear-gradient(135deg, var(--blog-green-40) 0%, var(--blog-green) 100%);
  color: #fff;
  padding: 48px 40px;
}

.dark .blog-hero {
  background: linear-gradient(135deg, #002422 0%, var(--blog-green-40) 100%);
}

@media (max-width: 768px) {
  .blog-hero {
    padding: 32px 20px;
  }
}

/* Blog content area */
.blog-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 32px 24px;
  color: var(--blog-text);
}

.blog-content p {
  margin-bottom: 1.2em;
  font-weight: 400;
}

.blog-content h2 {
  color: var(--blog-green-40);
  margin-top: 2em;
  margin-bottom: 0.8em;
  font-size: 1.5em;
}

.dark .blog-content h2 {
  color: var(--blog-green);
}

.blog-content h3 {
  color: var(--blog-green-40);
  margin-top: 1.5em;
  margin-bottom: 0.6em;
  font-size: 1.2em;
}

.dark .blog-content h3 {
  color: var(--blog-green-80);
}

/* Lead text */
.blog-lead {
  font-size: 1.1em;
  font-weight: 700;
  border-left: 3px solid var(--blog-green);
  padding-left: 16px;
  margin-bottom: 2em;
  color: var(--blog-text);
}

/* Blog index card */
.blog-card {
  border: 1px solid var(--blog-border);
  border-radius: 12px;
  overflow: hidden;
  transition: box-shadow 0.2s, transform 0.2s;
  background: var(--blog-card-bg);
  max-width: 720px;
}

.blog-card:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.dark .blog-card:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.blog-card-thumbnail {
  height: 200px;
  background: linear-gradient(135deg, var(--blog-green) 0%, var(--blog-green-40) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.blog-card-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.blog-card-body {
  padding: 24px;
}

.blog-card-meta {
  display: flex;
  gap: 12px;
  font-size: 0.8em;
  color: var(--blog-text-muted);
  margin-bottom: 12px;
  font-family: 'Lato', sans-serif;
}

.blog-card-title {
  font-size: 1.25em;
  font-weight: 700;
  color: var(--blog-green-40);
  margin-bottom: 8px;
  font-family: 'Lato', sans-serif;
  line-height: 1.333;
}

.dark .blog-card-title {
  color: var(--blog-green);
}

.blog-card-description {
  font-size: 0.9em;
  color: var(--blog-text-muted);
  margin-bottom: 16px;
  line-height: 1.6;
}

.blog-card-link {
  font-size: 0.9em;
  color: var(--blog-green);
  font-weight: 600;
  text-decoration: none;
  font-family: 'Lato', sans-serif;
}

.blog-card-link:hover {
  text-decoration: underline;
}

/* Slide deck download banner */
.blog-download-banner {
  background: linear-gradient(135deg, var(--blog-green-40), var(--blog-green));
  border-radius: 12px;
  padding: 32px;
  color: #fff;
  text-align: center;
  margin-top: 2em;
}

.dark .blog-download-banner {
  background: linear-gradient(135deg, #002422, var(--blog-green-40));
}

.blog-download-banner h3 {
  color: #fff;
  margin: 0 0 8px;
}

.blog-download-banner p {
  opacity: 0.85;
  margin-bottom: 16px;
}

.blog-download-banner a {
  display: inline-block;
  background: #fff;
  color: var(--blog-green-40);
  padding: 10px 24px;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  font-family: 'Lato', sans-serif;
  transition: transform 0.2s;
}

.blog-download-banner a:hover {
  transform: translateY(-1px);
}

/* Utility: full-width breakout from content column */
.blog-wide {
  margin-left: -24px;
  margin-right: -24px;
}

@media (max-width: 768px) {
  .blog-content {
    padding: 24px 16px;
  }
  .blog-wide {
    margin-left: -16px;
    margin-right: -16px;
  }
}

/* Infographic image */
.blog-infographic {
  border-radius: 12px;
  overflow: hidden;
  margin: 1.5em 0;
  background: var(--blog-bg-subtle);
}

.blog-infographic img {
  width: 100%;
  height: auto;
  display: block;
}
```

- [ ] **Step 2: Verify file was created**

```bash
wc -l docs/.vitepress/theme/blog.css
```

Expected: ~220 lines.

- [ ] **Step 3: Commit**

```bash
git add docs/.vitepress/theme/blog.css
git commit -m "Add blog-scoped CSS with brand fonts and dark mode"
```

---

## Task 3: Blog Data Loader

**Files:**
- Create: `docs/.vitepress/theme/blog.data.mts`

- [ ] **Step 1: Create the content loader**

Create `docs/.vitepress/theme/blog.data.mts`:

```ts
import { createContentLoader } from 'vitepress'

export interface BlogPost {
  url: string
  title: string
  date: string
  description: string
  thumbnail: string
  readingTime: number
  author: string
}

export default createContentLoader('blog/posts/*.md', {
  transform(raw): BlogPost[] {
    return raw
      .sort((a, b) => +new Date(b.frontmatter.date) - +new Date(a.frontmatter.date))
      .map(({ url, frontmatter }) => ({
        url,
        title: frontmatter.title ?? '',
        date: frontmatter.date ?? '',
        description: frontmatter.description ?? '',
        thumbnail: frontmatter.thumbnail ?? '',
        readingTime: frontmatter.readingTime ?? 0,
        author: frontmatter.author ?? '',
      }))
  },
})
```

- [ ] **Step 2: Commit**

```bash
git add docs/.vitepress/theme/blog.data.mts
git commit -m "Add blog content loader with date sorting"
```

---

## Task 4: Blog Index Layout

**Files:**
- Create: `docs/.vitepress/theme/BlogLayout.vue`
- Create: `docs/blog/index.md`

- [ ] **Step 1: Create BlogLayout.vue**

Create `docs/.vitepress/theme/BlogLayout.vue`:

```vue
<script setup>
import { data as posts } from './blog.data.mts'

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('de-CH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
</script>

<template>
  <div class="blog-layout">
    <div class="blog-hero">
      <h1 style="color: #fff; margin: 0; font-size: 2em;">Blog</h1>
      <p style="opacity: 0.85; margin-top: 8px; font-size: 1em;">
        Neuigkeiten und Insights rund um Mobile ID
      </p>
    </div>

    <div style="padding: 32px 24px; max-width: 800px; margin: 0 auto;">
      <a
        v-for="post in posts"
        :key="post.url"
        :href="post.url"
        class="blog-card"
        style="display: block; text-decoration: none; margin-bottom: 24px;"
      >
        <div class="blog-card-thumbnail">
          <img
            v-if="post.thumbnail"
            :src="post.thumbnail"
            :alt="post.title"
          />
        </div>
        <div class="blog-card-body">
          <div class="blog-card-meta">
            <span>{{ formatDate(post.date) }}</span>
            <span v-if="post.readingTime">·</span>
            <span v-if="post.readingTime">{{ post.readingTime }} Min. Lesezeit</span>
          </div>
          <div class="blog-card-title">{{ post.title }}</div>
          <div class="blog-card-description">{{ post.description }}</div>
          <span class="blog-card-link">Weiterlesen →</span>
        </div>
      </a>
    </div>
  </div>
</template>
```

- [ ] **Step 2: Create blog/index.md**

Create `docs/blog/index.md`:

```markdown
---
layout: blog-index
title: Blog
---
```

- [ ] **Step 3: Commit**

```bash
git add docs/.vitepress/theme/BlogLayout.vue docs/blog/index.md
git commit -m "Add blog index layout with card listing"
```

---

## Task 5: Blog Post Layout

**Files:**
- Create: `docs/.vitepress/theme/BlogPostLayout.vue`

- [ ] **Step 1: Create BlogPostLayout.vue**

Create `docs/.vitepress/theme/BlogPostLayout.vue`:

```vue
<script setup>
import { useData } from 'vitepress'

const { frontmatter } = useData()

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('de-CH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
</script>

<template>
  <div class="blog-layout">
    <!-- Hero Header -->
    <div class="blog-hero">
      <div style="max-width: 800px; margin: 0 auto;">
        <div style="font-size: 0.75em; letter-spacing: 1px; text-transform: uppercase; opacity: 0.7; margin-bottom: 12px; font-family: 'Lato', sans-serif;">
          Blog
        </div>
        <h1 style="color: #fff; margin: 0 0 16px; font-size: 2em; line-height: 1.2;">
          {{ frontmatter.title }}
        </h1>
        <div style="display: flex; gap: 20px; font-size: 0.85em; opacity: 0.85; font-family: 'Lato', sans-serif; flex-wrap: wrap;">
          <span v-if="frontmatter.date">📅 {{ formatDate(frontmatter.date) }}</span>
          <span v-if="frontmatter.author">👤 {{ frontmatter.author }}</span>
          <span v-if="frontmatter.readingTime">⏱ {{ frontmatter.readingTime }} Min. Lesezeit</span>
        </div>
      </div>
    </div>

    <!-- Content rendered from Markdown -->
    <div class="blog-content">
      <Content />
    </div>
  </div>
</template>
```

- [ ] **Step 2: Commit**

```bash
git add docs/.vitepress/theme/BlogPostLayout.vue
git commit -m "Add blog post layout with hero header"
```

---

## Task 6: Register Layouts & Update Config

**Files:**
- Modify: `docs/.vitepress/theme/index.js`
- Modify: `docs/.vitepress/config.mts`

- [ ] **Step 1: Update theme index.js**

VitePress only supports three built-in layout values (`doc`, `page`, `home`). For custom layouts, we must dispatch them manually in the theme's `Layout()` function by checking `frontmatter.layout`.

Replace the entire `docs/.vitepress/theme/index.js` with:

```js
import DefaultTheme from 'vitepress/theme'
import mediumZoom from 'medium-zoom'
import { h, onMounted, watch, nextTick } from 'vue'
import { useRoute, useData } from 'vitepress'
import { theme as openApiTheme, useOpenapi } from 'vitepress-openapi/client'
import 'vitepress-openapi/dist/style.css'
import specYaml from '../../public/openapi-mobileid.yaml?raw'
import DocFeedback from './DocFeedback.vue'
import BlogLayout from './BlogLayout.vue'
import BlogPostLayout from './BlogPostLayout.vue'
import './custom.css'
import './blog.css'

export default {
  extends: DefaultTheme,
  Layout() {
    return h({
      setup() {
        const { frontmatter } = useData()
        return () => {
          const layout = frontmatter.value.layout
          if (layout === 'blog-index') return h(BlogLayout)
          if (layout === 'blog-post') return h(BlogPostLayout)
          return h(DefaultTheme.Layout, null, {
            'doc-after': () => h(DocFeedback),
          })
        }
      }
    })
  },
  async enhanceApp({ app }) {
    useOpenapi({
      spec: specYaml,
      config: {
        operation: {
          hiddenSlots: ['playground'],
        },
      },
    })
    openApiTheme.enhanceApp({ app })
  },
  setup() {
    const route = useRoute()

    const initZoom = () => {
      mediumZoom('.vp-doc img:not(.no-zoom)', {
        background: 'rgba(255, 255, 255, 0.95)'
      })
    }

    onMounted(() => {
      initZoom()
    })

    watch(
      () => route.path,
      () => nextTick(() => initZoom())
    )
  }
}
```

- [ ] **Step 2: Update config.mts — add Blog nav item**

In `docs/.vitepress/config.mts`, add `{ text: 'Blog', link: '/blog/' }` to the `nav` array (after the RADIUS Guide entry):

```ts
nav: [
  { text: 'Home', link: '/' },
  { text: 'REST API Guide', link: '/rest-api-guide/introduction' },
  { text: 'OIDC Integration Guide', link: '/oidc-integration-guide/introduction' },
  { text: 'RADIUS Gateway Guide', link: '/radius-interface-gateway-guide/introduction' },
  { text: 'Blog', link: '/blog/' }
],
```

- [ ] **Step 3: Update config.mts — disable sidebar for blog**

Add `'/blog/': false` as the first entry in the `sidebar` object:

```ts
sidebar: {
  '/blog/': false,
  '/rest-api-guide/': [
    // ... existing
```

This must come before other sidebar entries to ensure VitePress matches it for all `/blog/` paths.

- [ ] **Step 4: Verify dev server starts**

```bash
cd docs/.. && npm run docs:dev
```

Expected: Dev server starts without errors. Navigate to `http://localhost:5173/blog/` and see the blog index with the gradient header (no posts yet).

- [ ] **Step 5: Commit**

```bash
git add docs/.vitepress/theme/index.js docs/.vitepress/config.mts
git commit -m "Register blog layouts and add Blog to navigation"
```

---

## Task 7: AudioPlayer Component

**Files:**
- Create: `docs/.vitepress/theme/components/AudioPlayer.vue`

- [ ] **Step 1: Create AudioPlayer.vue**

Create `docs/.vitepress/theme/components/AudioPlayer.vue`:

```vue
<script setup>
import { ref, onUnmounted } from 'vue'

const props = defineProps({
  src: { type: String, required: true },
  title: { type: String, default: '' },
})

const audio = ref(null)
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const progress = ref(0)

function togglePlay() {
  if (!audio.value) return
  if (isPlaying.value) {
    audio.value.pause()
  } else {
    audio.value.play()
  }
}

function onPlay() { isPlaying.value = true }
function onPause() { isPlaying.value = false }

function onTimeUpdate() {
  if (!audio.value) return
  currentTime.value = audio.value.currentTime
  progress.value = duration.value > 0 ? (currentTime.value / duration.value) * 100 : 0
}

function onLoadedMetadata() {
  if (audio.value) {
    duration.value = audio.value.duration
  }
}

function seek(event) {
  if (!audio.value) return
  const rect = event.currentTarget.getBoundingClientRect()
  const ratio = (event.clientX - rect.left) / rect.width
  audio.value.currentTime = ratio * duration.value
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

onUnmounted(() => {
  if (audio.value) {
    audio.value.pause()
  }
})
</script>

<template>
  <div class="audio-player">
    <audio
      ref="audio"
      :src="src"
      preload="metadata"
      @play="onPlay"
      @pause="onPause"
      @timeupdate="onTimeUpdate"
      @loadedmetadata="onLoadedMetadata"
    />

    <button class="audio-player-btn" @click="togglePlay" :aria-label="isPlaying ? 'Pause' : 'Play'">
      <span v-if="!isPlaying">▶</span>
      <span v-else>⏸</span>
    </button>

    <div class="audio-player-info">
      <div v-if="title" class="audio-player-title">{{ title }}</div>
      <div class="audio-player-bar" @click="seek">
        <div class="audio-player-progress" :style="{ width: progress + '%' }" />
      </div>
      <div class="audio-player-time">
        {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.audio-player {
  display: flex;
  align-items: center;
  gap: 16px;
  background: var(--blog-bg-subtle);
  border-radius: 12px;
  padding: 16px 20px;
  margin-bottom: 2em;
  border-bottom: 1px solid var(--blog-border);
}

.audio-player-btn {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--blog-green);
  color: #fff;
  border: none;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background 0.2s;
}

.audio-player-btn:hover {
  background: var(--blog-green-80);
}

.audio-player-info {
  flex: 1;
  min-width: 0;
}

.audio-player-title {
  font-size: 0.85em;
  font-weight: 600;
  margin-bottom: 8px;
  font-family: 'Lato', sans-serif;
  color: var(--blog-text);
}

.audio-player-bar {
  height: 6px;
  background: var(--blog-border);
  border-radius: 3px;
  cursor: pointer;
  overflow: hidden;
}

.audio-player-progress {
  height: 100%;
  background: var(--blog-green);
  border-radius: 3px;
  transition: width 0.1s linear;
}

.audio-player-time {
  font-size: 0.75em;
  color: var(--blog-text-muted);
  margin-top: 4px;
  font-family: 'Lato', sans-serif;
}
</style>
```

- [ ] **Step 2: Commit**

```bash
git add docs/.vitepress/theme/components/AudioPlayer.vue
git commit -m "Add AudioPlayer component with brand styling"
```

---

## Task 8: VideoEmbed Component

**Files:**
- Create: `docs/.vitepress/theme/components/VideoEmbed.vue`

- [ ] **Step 1: Create VideoEmbed.vue**

Create `docs/.vitepress/theme/components/VideoEmbed.vue`:

```vue
<script setup>
import { ref, nextTick } from 'vue'

defineProps({
  src: { type: String, required: true },
  poster: { type: String, default: '' },
})

const started = ref(false)
const video = ref(null)

async function play() {
  started.value = true
  await nextTick()
  if (video.value) video.value.play()
}
</script>

<template>
  <div class="video-embed" @click="play" :class="{ 'video-embed--playing': started }">
    <video
      v-if="started"
      ref="video"
      :src="src"
      :poster="poster"
      controls
      preload="metadata"
      style="width: 100%; height: 100%; border-radius: 12px;"
    />
    <template v-else>
      <img v-if="poster" :src="poster" alt="" style="width: 100%; height: 100%; object-fit: cover; border-radius: 12px;" />
      <div class="video-embed-overlay">
        <div class="video-embed-play">▶</div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.video-embed {
  position: relative;
  background: #111;
  border-radius: 12px;
  overflow: hidden;
  margin: 1.5em 0;
  aspect-ratio: 16 / 9;
  cursor: pointer;
}

.video-embed--playing {
  cursor: default;
}

.video-embed-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.3);
  transition: background 0.2s;
}

.video-embed:hover .video-embed-overlay {
  background: rgba(0, 0, 0, 0.15);
}

.video-embed-play {
  width: 64px;
  height: 64px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(8px);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #fff;
  transition: transform 0.2s, background 0.2s;
}

.video-embed:hover .video-embed-play {
  transform: scale(1.1);
  background: rgba(255, 255, 255, 0.3);
}
</style>
```

- [ ] **Step 2: Commit**

```bash
git add docs/.vitepress/theme/components/VideoEmbed.vue
git commit -m "Add VideoEmbed component with play overlay"
```

---

## Task 9: ComparisonTable Component

**Files:**
- Create: `docs/.vitepress/theme/components/ComparisonTable.vue`

- [ ] **Step 1: Create ComparisonTable.vue**

Create `docs/.vitepress/theme/components/ComparisonTable.vue`:

```vue
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  rows: {
    type: Array,
    default: () => [
      { feature: 'Phishing-Schutz', classic: false, passkey: true },
      { feature: 'Kein Passwort nötig', classic: false, passkey: true },
      { feature: 'Login-Zeit', classic: '~15 Sek', passkey: '<3 Sek' },
      { feature: 'Zentrale Verwaltung', classic: false, passkey: true },
      { feature: 'NIST AAL3 möglich', classic: false, passkey: true },
      { feature: 'Kein Hardware-Token', classic: false, passkey: true },
    ],
  },
})

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
    { threshold: 0.3 }
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
    if (visibleRows.value >= props.rows.length) {
      clearInterval(animationTimer)
      return
    }
    visibleRows.value++
  }, 150)
}

function formatValue(val) {
  if (val === true) return '✅'
  if (val === false) return '❌'
  return val
}
</script>

<template>
  <div ref="containerRef" class="comparison-table">
    <div class="comparison-header">
      <div class="comparison-cell comparison-feature">Feature</div>
      <div class="comparison-cell comparison-classic">Passwort + SMS</div>
      <div class="comparison-cell comparison-passkey">Mobile ID Passkeys</div>
    </div>
    <div
      v-for="(row, i) in rows"
      :key="i"
      class="comparison-row"
      :class="{ 'comparison-row--visible': i < visibleRows }"
    >
      <div class="comparison-cell comparison-feature">{{ row.feature }}</div>
      <div class="comparison-cell comparison-classic">{{ formatValue(row.classic) }}</div>
      <div class="comparison-cell comparison-passkey">{{ formatValue(row.passkey) }}</div>
    </div>
  </div>
</template>

<style scoped>
.comparison-table {
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--blog-border);
  margin: 1.5em 0;
  font-family: 'Lato', sans-serif;
}

.comparison-header {
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr;
  background: var(--blog-bg-subtle);
  font-weight: 700;
  font-size: 0.85em;
}

.comparison-row {
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr;
  border-top: 1px solid var(--blog-border);
  opacity: 0;
  transform: translateY(8px);
  transition: opacity 0.3s, transform 0.3s;
}

.comparison-row--visible {
  opacity: 1;
  transform: translateY(0);
}

.comparison-cell {
  padding: 12px 16px;
  font-size: 0.9em;
}

.comparison-feature {
  font-weight: 600;
  color: var(--blog-text);
}

.comparison-classic {
  text-align: center;
  color: var(--blog-text-muted);
}

.comparison-passkey {
  text-align: center;
  color: var(--blog-green);
  font-weight: 600;
}

@media (max-width: 600px) {
  .comparison-table {
    overflow-x: auto;
  }
  .comparison-header,
  .comparison-row {
    min-width: 400px;
  }
}
</style>
```

- [ ] **Step 2: Commit**

```bash
git add docs/.vitepress/theme/components/ComparisonTable.vue
git commit -m "Add ComparisonTable component with staggered animation"
```

---

## Task 10: AcrLevels Component

**Files:**
- Create: `docs/.vitepress/theme/components/AcrLevels.vue`

- [ ] **Step 1: Create AcrLevels.vue**

Create `docs/.vitepress/theme/components/AcrLevels.vue`:

```vue
<script setup>
defineProps({
  levels: {
    type: Array,
    default: () => [
      {
        acr: 'mid_al2_any',
        label: 'UX-fokussiert',
        description: 'Passkey bevorzugt, Fallback auf SIM/App/SMS',
        color: 'green',
      },
      {
        acr: 'mid_al4_any',
        label: 'Security-fokussiert',
        description: 'Passkey bevorzugt, Fallback auf SIM/App',
        color: 'darkgreen',
      },
      {
        acr: 'mid_al4_passkey',
        label: 'Höchste Sicherheit / AAL3',
        description: 'Passkey-only, kein Fallback',
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

.acr-card:hover .acr-description {
  max-height: 80px;
  opacity: 1;
  margin-top: 8px;
}

@media (max-width: 600px) {
  .acr-levels {
    grid-template-columns: 1fr;
  }
}
</style>
```

- [ ] **Step 2: Commit**

```bash
git add docs/.vitepress/theme/components/AcrLevels.vue
git commit -m "Add AcrLevels component with color-coded cards"
```

---

## Task 11: PasskeyRegistrationFlow Component

**Files:**
- Create: `docs/.vitepress/theme/components/PasskeyRegistrationFlow.vue`

- [ ] **Step 1: Create PasskeyRegistrationFlow.vue**

Create `docs/.vitepress/theme/components/PasskeyRegistrationFlow.vue`:

```vue
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  steps: {
    type: Array,
    default: () => [
      { label: 'Login (OTP)', icon: '🔑' },
      { label: 'Dashboard', icon: '📋' },
      { label: 'Passkeys', icon: '🛡️' },
      { label: 'Add Passkey', icon: '➕' },
      { label: 'Touch ID', icon: '👆' },
      { label: 'Registriert ✓', icon: '✅' },
    ],
  },
})

const activeStep = ref(-1)
const containerRef = ref(null)
let observer = null
let animationTimer = null

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
})

function startAnimation() {
  activeStep.value = 0
  animationTimer = setInterval(() => {
    if (activeStep.value >= props.steps.length - 1) {
      clearInterval(animationTimer)
      return
    }
    activeStep.value++
  }, 600)
}
</script>

<template>
  <div ref="containerRef" class="reg-flow">
    <div
      v-for="(step, i) in steps"
      :key="i"
      class="reg-flow-step"
      :class="{
        'reg-flow-step--active': i === activeStep,
        'reg-flow-step--done': i < activeStep,
        'reg-flow-step--hidden': i > activeStep,
        'reg-flow-step--last': i === steps.length - 1 && i <= activeStep,
      }"
    >
      <div class="reg-flow-box">
        <span class="reg-flow-icon">{{ step.icon }}</span>
        <span class="reg-flow-label">{{ step.label }}</span>
      </div>
      <div v-if="i < steps.length - 1" class="reg-flow-arrow" :class="{ 'reg-flow-arrow--visible': i < activeStep }">→</div>
    </div>
  </div>
</template>

<style scoped>
.reg-flow {
  display: flex;
  align-items: center;
  gap: 0;
  padding: 24px 0;
  margin: 1.5em 0;
  overflow-x: auto;
  font-family: 'Lato', sans-serif;
}

.reg-flow-step {
  display: flex;
  align-items: center;
  opacity: 0;
  transform: translateX(-10px);
  transition: opacity 0.4s, transform 0.4s;
}

.reg-flow-step--active,
.reg-flow-step--done,
.reg-flow-step--last {
  opacity: 1;
  transform: translateX(0);
}

.reg-flow-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 12px 16px;
  border-radius: 10px;
  background: rgba(0, 148, 144, 0.08);
  border: 2px solid transparent;
  white-space: nowrap;
  transition: border-color 0.3s, background 0.3s;
}

.reg-flow-step--active .reg-flow-box {
  border-color: var(--blog-green);
  background: rgba(0, 148, 144, 0.15);
  animation: pulse 1.5s ease-in-out infinite;
}

.reg-flow-step--last .reg-flow-box {
  background: var(--blog-green-40);
  color: #fff;
  border-color: var(--blog-green-40);
  animation: none;
}

.dark .reg-flow-box {
  background: rgba(255, 255, 255, 0.05);
}

.dark .reg-flow-step--active .reg-flow-box {
  background: rgba(0, 148, 144, 0.2);
}

.dark .reg-flow-step--last .reg-flow-box {
  background: var(--blog-green-40);
}

.reg-flow-icon {
  font-size: 1.2em;
}

.reg-flow-label {
  font-size: 0.75em;
  font-weight: 600;
  color: var(--blog-text);
}

.reg-flow-step--last .reg-flow-label {
  color: #fff;
}

.reg-flow-arrow {
  padding: 0 8px;
  font-size: 1.2em;
  color: var(--blog-green);
  opacity: 0;
  transition: opacity 0.3s;
}

.reg-flow-arrow--visible {
  opacity: 1;
}

@keyframes pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(0, 148, 144, 0.3); }
  50% { box-shadow: 0 0 0 8px rgba(0, 148, 144, 0); }
}
</style>
```

- [ ] **Step 2: Commit**

```bash
git add docs/.vitepress/theme/components/PasskeyRegistrationFlow.vue
git commit -m "Add PasskeyRegistrationFlow component with step animation"
```

---

## Task 12: PasskeyLoginFlow Component

**Files:**
- Create: `docs/.vitepress/theme/components/PasskeyLoginFlow.vue`

- [ ] **Step 1: Create PasskeyLoginFlow.vue**

Create `docs/.vitepress/theme/components/PasskeyLoginFlow.vue`:

```vue
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
})

function startAnimation() {
  activeStep.value = 0
  animationTimer = setInterval(() => {
    if (activeStep.value >= props.steps.length - 1) {
      clearInterval(animationTimer)
      setTimeout(() => { showFallback.value = true }, 800)
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
  padding: 24px 0;
  overflow-x: auto;
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
  gap: 6px;
  padding: 12px 16px;
  border-radius: 10px;
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
  font-size: 1.2em;
}

.login-flow-label {
  font-size: 0.75em;
  font-weight: 600;
  color: var(--blog-text);
}

.login-flow-step--last .login-flow-label {
  color: #fff;
}

.login-flow-arrow {
  padding: 0 8px;
  font-size: 1.2em;
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
```

- [ ] **Step 2: Commit**

```bash
git add docs/.vitepress/theme/components/PasskeyLoginFlow.vue
git commit -m "Add PasskeyLoginFlow component with fallback path"
```

---

## Task 13: Blog Article Markdown

**Files:**
- Create: `docs/blog/posts/2026-03-23-mobile-id-passkeys.md`

- [ ] **Step 1: Create the article markdown file**

Create `docs/blog/posts/2026-03-23-mobile-id-passkeys.md`:

```markdown
---
title: "Mobile ID Passkeys: Die Zukunft der passwortlosen Authentisierung in der Schweiz"
date: 2026-03-23
author: Mobile ID Team
description: "Passwortlose Sicherheit ist keine Vision mehr, sondern Realität. Mit der Integration von FIDO2-Passkeys in das Mobile ID Ecosystem hebt Swisscom die digitale Identität auf ein neues Level."
thumbnail: /blog/img/passkeys-thumb.png
lang: de
readingTime: 6
layout: blog-post
---

<script setup>
import AudioPlayer from '../../.vitepress/theme/components/AudioPlayer.vue'
import VideoEmbed from '../../.vitepress/theme/components/VideoEmbed.vue'
import ComparisonTable from '../../.vitepress/theme/components/ComparisonTable.vue'
import AcrLevels from '../../.vitepress/theme/components/AcrLevels.vue'
import PasskeyRegistrationFlow from '../../.vitepress/theme/components/PasskeyRegistrationFlow.vue'
import PasskeyLoginFlow from '../../.vitepress/theme/components/PasskeyLoginFlow.vue'
</script>

<AudioPlayer src="/blog/media/passkeys-podcast.mp3" title="Lieber hören statt lesen? Podcast: Phishing-resistente Firmenlogins mit Mobile ID" />

<div class="blog-lead">
Passwortlose Sicherheit ist keine Vision mehr, sondern Realität. Mit der Integration von FIDO2-Passkeys in das Mobile ID Ecosystem hebt Swisscom die digitale Identität in der Schweiz auf ein neues Level an Sicherheit und Benutzerfreundlichkeit.
</div>

## Was sind Passkeys und warum brauchen wir sie?

Passkeys basieren auf dem weltweiten FIDO2-Standard und nutzen asymmetrische Kryptografie. Anstatt sich unsichere Passwörter zu merken, authentisieren sich Benutzer einfach über die Biometrie ihres Geräts — zum Beispiel per Face ID, Touch ID oder Windows Hello.

Der entscheidende Vorteil: Passkeys sind **phishing-resistent**. Da sie fest an die Domäne gebunden sind, können sie nicht auf gefälschten Webseiten abgefangen werden. Während herkömmliche MFA-Methoden (wie Passwörter kombiniert mit SMS) oft nur eine Phishing-Resistenz von 20–50 % aufweisen, bieten FIDO2-basierte Verfahren einen Schutz von über 99 %.

<div class="blog-infographic">
  <img src="/blog/img/passkeys-infographic.png" alt="Mobile ID Passkeys Infografik — zentrale Verwaltung, OIDC-Integration, Authentisierungslevel" />
</div>

## Warum Mobile ID Passkeys?

Mobile ID ist der erste Schweizer Identity Provider, der Passkeys nativ in sein bewährtes OpenID Connect (OIDC) Ecosystem integriert. Für Unternehmen (Relying Parties) bedeutet dies:

- **Keine eigene Infrastruktur:** Kein eigenes Passkey-Backend oder WebAuthn-Expertise nötig.
- **Einfache Integration:** Einbindung über den Standard-OIDC-Service.
- **Zentrales Management:** Benutzer verwalten ihre Passkeys zentral im MyMobileID Portal auf mobileid.ch. Einmal registriert, kann derselbe Passkey bei allen teilnehmenden Services genutzt werden.
- **Schweizer Lösung:** Alle Daten bleiben in der Schweiz, ohne Abhängigkeit von US Big Tech.

<ComparisonTable />

## NIST AAL3: Höchste Sicherheit für regulierte Branchen

Für Branchen wie Banking, Healthcare oder E-Government ermöglicht Mobile ID den NIST Authenticator Assurance Level 3 (AAL3). Durch den Modus „Passkey-only" (`mid_al4_passkey`) entfallen unsichere Fallbacks — echte Phishing-Resistenz mit hardwarebasierten, nicht-exportierbaren Schlüsseln.

<AcrLevels />

## Der Registrierungs-Flow (auf mobileid.ch)

Die Registrierung erfolgt zentral über das MyMobileID Dashboard:

1. Login auf mobileid.ch (Verifizierung via SMS-OTP)
2. Im Dashboard die Kachel „Mobile ID Passkeys" → „MANAGE PASSKEYS"
3. „Add a passkey" → Nativer Browser-Dialog (Touch ID / Face ID)
4. Biometrische Bestätigung → Passkey registriert auf mobileid.ch Origin
5. Der neue Passkey steht sofort für alle Relying Parties zur Verfügung

<PasskeyRegistrationFlow />

<VideoEmbed src="/blog/media/passkeys-explainer.mp4" />

## Der Login-Flow (bei der Relying Party)

1. Benutzer klickt auf der RP-Webseite „Sign in with MobileID"
2. OIDC Redirect zu mobileid.ch (Authorization Code Flow)
3. Passkey-Authentisierung per Biometrie auf mobileid.ch
4. Redirect zurück zur RP mit Authorization Code → Login Success

**Flexibler Fallback:** Falls Passkey fehlschlägt → Dropdown „Select another method" → Mobile ID SIM, App oder SMS. Gesteuert über ACR-Werte (`mid_al2_any` bis `mid_al4_passkey`).

<PasskeyLoginFlow />

## Swisscom: Ihr Partner für sichere Identitäten

Mobile ID Passkeys vereinen SIM-basierte Sicherheit, App-Komfort und modernste Passkey-Technologie in einem einzigen Service. Profitieren Sie von geringeren Supportkosten, reduzierten Authentisierungsfehlern und höchster Sicherheit.

<div class="blog-download-banner">
  <h3>Mobile ID Passkey Blueprint</h3>
  <p>Detailliertes Slide Deck zum Download</p>
  <a href="/blog/media/passkeys-blueprint.pdf" download>📄 PDF herunterladen</a>
</div>
```

- [ ] **Step 2: Commit**

```bash
git add docs/blog/posts/2026-03-23-mobile-id-passkeys.md
git commit -m "Add Mobile ID Passkeys blog article with all components"
```

---

## Task 14: Integration Test & Polish

- [ ] **Step 1: Start dev server and verify**

```bash
npm run docs:dev
```

Open in browser and check:

1. `http://localhost:5173/blog/` — Blog index shows card with thumbnail, date, title, teaser
2. Click the card → navigates to the article
3. Article shows: hero header, audio player, lead text, infographic, comparison table, ACR cards, registration flow, video, login flow, download banner
4. Scroll animations trigger on viewport entry
5. Dark mode toggle works (click appearance switch in navbar)
6. Mobile responsive (resize browser to 375px width)
7. "Blog" link in navbar is active when on blog pages

- [ ] **Step 2: Fix any issues found during verification**

Address visual, responsive, or functional issues.

- [ ] **Step 3: Build check**

```bash
npm run docs:build
```

Expected: Build succeeds with no errors. Check for warnings about missing assets.

- [ ] **Step 4: Preview built site**

```bash
npm run docs:preview
```

Navigate to blog index and article. Verify everything works in the production build.

- [ ] **Step 5: Commit any fixes**

```bash
git add -A
git commit -m "Fix blog integration issues found during testing"
```

(Skip if no fixes were needed.)

---

## Task 15: Update .gitignore

**Files:**
- Modify: `docs/../.gitignore` (root .gitignore)

- [ ] **Step 1: Add .superpowers to .gitignore if not already present**

Check if `.superpowers/` is in `.gitignore`:

```bash
grep -q '.superpowers' .gitignore && echo "Already present" || echo ".superpowers/" >> .gitignore
```

This is for the brainstorming mockups directory. It should not be committed.

- [ ] **Step 2: Commit**

```bash
git add .gitignore
git commit -m "Add .superpowers to gitignore"
```
