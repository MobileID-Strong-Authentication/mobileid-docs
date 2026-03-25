# Design: Blog-Sektion + Mobile ID Passkeys Artikel

**Datum:** 2026-03-23
**Status:** Approved
**Scope:** VitePress Blog-Infrastruktur + erster Blog-Artikel über Mobile ID Passkeys

---

## Kontext

docs.mobileid.ch ist eine VitePress-basierte Dokumentationsseite mit drei technischen Guides (REST API, OIDC, RADIUS). Es gibt keine Blog-Sektion. Ein Blog soll als ergänzender Bereich eingeführt werden, um neue Features und Themen mit Bezug zu den Docs zu kommunizieren. Der erste Artikel behandelt Mobile ID Passkeys, basierend auf Content-Bausteinen aus NotebookLM.

## Entscheidungen

| Thema | Entscheidung | Begründung |
|-------|-------------|------------|
| Blog-Ansatz | Custom-Lösung (kein Plugin) | Volle Kontrolle, kein Lock-in, passt zum bestehenden Custom-Theme |
| Umfang | Leichtgewichtig | Ein Artikel, minimale Infrastruktur, skaliert bei Bedarf |
| Navigation | Navbar-Link "Blog" rechts | Blog kommuniziert neue Features — direkte Sichtbarkeit wichtig |
| Assets | Alle lokal (kein externes CDN) | Professionelle Docs-Seite, keine Abhängigkeit von Google-CDN |
| Interaktivität | Animierte Vue-Komponenten | Marketing-Stück — Flows sollen visuell erlebbar sein |
| Fonts | Lato + Merriweather, scoped auf Blog | Editorial-Charakter für Blog, Docs bleiben bei System-Fonts |
| Sprache | Deutsch zuerst, i18n-ready | Artikeltext liegt auf DE vor, Struktur erlaubt spätere Übersetzungen |
| i18n-Strategie | Props statt hardcoded, `lang`-Frontmatter, erweiterbare URL-Struktur | Späterer Ausbau auf EN/FR/IT als separater Schritt |

## Architektur

### Dateistruktur

```
docs/
├── blog/
│   ├── index.md                              # Blog-Index (custom Layout)
│   └── posts/
│       └── 2026-03-23-mobile-id-passkeys.md  # Artikel (Markdown + Vue)
│
├── .vitepress/theme/
│   ├── BlogLayout.vue          # Layout für Blog-Index
│   ├── BlogPostLayout.vue      # Layout für Einzelartikel
│   ├── blog.css                # Blog-spezifisches CSS (Brand-Fonts, Spacing)
│   ├── blog.data.mts           # createContentLoader für Blog-Index
│   └── components/
│       ├── PasskeyRegistrationFlow.vue   # Animierter Registration-Flow
│       ├── PasskeyLoginFlow.vue          # Animierter Login-Flow (OIDC)
│       ├── ComparisonTable.vue           # Interaktive Vergleichstabelle
│       ├── AcrLevels.vue                 # ACR-Werte Visualisierung
│       ├── AudioPlayer.vue               # Podcast-Player mit Brand-Styling
│       └── VideoEmbed.vue                # Video-Player mit Brand-Styling
│
└── public/blog/
    ├── fonts/          # Lato Bold, Merriweather Regular/Bold (lokal)
    ├── img/            # Infografik, Thumbnails
    └── media/          # Video (.mp4), Audio (.mp3), PDF (Slide Deck)
```

### Layout-Registrierung

Blog-Layouts werden über die bestehende Theme-Extension in `index.js` registriert. Im `enhanceApp`-Hook:

```ts
enhanceApp({ app }) {
  app.component('blog-index', BlogLayout)
  app.component('blog-post', BlogPostLayout)
  // ... existing registrations
}
```

VitePress löst `layout: blog-post` im Frontmatter automatisch auf die gleichnamige global registrierte Komponente auf. Beide Blog-Layouts wrappen sich in eine `.blog-layout` CSS-Klasse für scoped Styling.

### Blog-Index

- **Route:** `/blog/`
- **Frontmatter:**
  ```yaml
  ---
  layout: blog-index
  title: Blog
  ---
  ```
- **Layout:** `BlogLayout.vue` (registriert als `blog-index`)
- **Datenquelle:** `blog.data.mts` mit `createContentLoader('blog/posts/*.md')`
  - Sortierung nach Datum (neueste zuerst)
  - Excerpt-Extraktion aus Frontmatter `description`
  - Genutzte Felder aus `ContentData`: `url`, `frontmatter.title`, `frontmatter.date`, `frontmatter.description`, `frontmatter.thumbnail`, `frontmatter.readingTime`, `frontmatter.author`
- **Darstellung:** Karten-Layout mit Thumbnail, Datum, Lesezeit, Titel, Teaser, "Weiterlesen"-Link
- **Header:** Gradient-Banner (Brand-Grün) mit Titel "Blog" und Untertitel

```ts
// blog.data.mts
import { createContentLoader } from 'vitepress'

export default createContentLoader('blog/posts/*.md', {
  transform(raw) {
    return raw
      .sort((a, b) => +new Date(b.frontmatter.date) - +new Date(a.frontmatter.date))
      .map(({ url, frontmatter }) => ({
        url,
        title: frontmatter.title,
        date: frontmatter.date,
        description: frontmatter.description,
        thumbnail: frontmatter.thumbnail,
        readingTime: frontmatter.readingTime,
        author: frontmatter.author,
      }))
  },
})
```

### Artikel-Frontmatter

```yaml
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
```

### Artikel-Layout (BlogPostLayout.vue)

Reihenfolge der 16 Elemente:

1. **Hero-Header** — Gradient (#004844 → #009490), Titel, Datum, Autor, Lesezeit
2. **AudioPlayer.vue** — "Lieber hören statt lesen?", lokale MP3-Datei
3. **Lead-Text** — Fetter Teaser mit grüner Bordüre links
4. **"Was sind Passkeys?"** — Artikeltext
5. **Infografik** — NotebookLM-Bild (lokal, `<img>`)
6. **"Warum Mobile ID Passkeys?"** — Artikeltext
7. **ComparisonTable.vue** — Klassisch vs. Passkeys (6 Zeilen, animierte Einblendung)
8. **"NIST AAL3"** — Artikeltext
9. **AcrLevels.vue** — 3 Karten (mid_al2_any, mid_al4_any, mid_al4_passkey) mit Farbcodierung
10. **"Registrierungs-Flow"** — Artikeltext
11. **PasskeyRegistrationFlow.vue** — Step-by-Step Animation (6 Schritte, aktiver Schritt pulsiert)
12. **VideoEmbed.vue** — Erklärvideo (lokale MP4-Datei)
13. **"Login-Flow"** — Artikeltext
14. **PasskeyLoginFlow.vue** — OIDC-Flow Animation mit Fallback-Pfad
15. **"Swisscom: Ihr Partner"** — CTA-Text
16. **Slide Deck Download** — Gradient-Banner mit PDF-Download-Button

### Vue-Komponenten

#### PasskeyRegistrationFlow.vue
- 6 Schritte als verbundene Boxen: Login (OTP) → Dashboard → Passkeys Kachel → Add Passkey → Touch ID → Registriert ✓
- CSS transitions: Schritte bauen sich nacheinander auf (staggered animation)
- Aktiver Schritt pulsiert (CSS `@keyframes pulse`)
- Intersection Observer: Animation startet wenn Komponente in Viewport scrollt. Observer wird in `onUnmounted` disconnected (SPA-Navigation Cleanup).
- Props: `steps` Array (i18n-ready)

#### PasskeyLoginFlow.vue
- Hauptpfad: RP (acme.com) → OIDC Redirect → mobileid.ch → Biometrie → Login ✓
- Fallback-Pfad: Passkey fehlgeschlagen → "Select another method" → SIM / App / SMS
- Gleiche Animations-Mechanik wie Registration-Flow
- Fallback-Pfad erscheint nach Hauptpfad mit leichter Verzögerung
- Props: `steps`, `fallbackSteps` (i18n-ready)

#### ComparisonTable.vue
- 6 Zeilen: Phishing-Schutz, Kein Passwort, Login-Zeit, Zentrale Verwaltung, NIST AAL3, Kein Hardware-Token
- Zeilen animieren sich nacheinander ein (staggered fade-in)
- ❌/✅ Icons, grüne Akzentfarbe für Passkey-Spalte
- Intersection Observer trigger (disconnected in `onUnmounted`)
- Props: `rows` Array (i18n-ready)

#### AcrLevels.vue
- 3 Karten nebeneinander (responsive: Stack auf Mobile)
- Farbcodierung: mid_al2_any (Grün), mid_al4_any (Dunkelgrün), mid_al4_passkey (Pink/Accent)
- Hover-Effekt: Karte hebt sich, zeigt erweiterte Beschreibung
- Props: `levels` Array (i18n-ready)

#### AudioPlayer.vue
- Custom-Player mit Brand-Styling (kein nativer `<audio>` Look)
- Play/Pause Button (Grün), Progress-Bar, Zeitanzeige
- Lokale MP3-Quelle
- Props: `src`, `title`

#### VideoEmbed.vue
- Wrapper um `<video>` mit Brand-Styling
- Dark Background, Play-Button-Overlay, Rounded Corners
- Lokale MP4-Quelle
- Props: `src`, `poster`

### Styling (blog.css)

#### Font Loading

```css
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
```

#### Typography & Colors (scoped)

```css
.blog-layout {
  font-family: 'Merriweather', Georgia, serif;
  line-height: 1.618;

  --blog-green: #009490;
  --blog-green-80: #007B77;
  --blog-green-60: #00615D;
  --blog-green-40: #004844;
  --blog-pink: #A70064;
}

.blog-layout h1, .blog-layout h2, .blog-layout h3 {
  font-family: 'Lato', sans-serif;
  font-weight: 700;
  line-height: 1.333;
}
```

Golden Ratio: Titel/Paragraph Size Ratio 1.618.

#### Dark Mode

Blog-spezifische Dark-Mode-Overrides via `.dark .blog-layout`:

- **Hero-Gradient:** Dunklere Variante (#002422 → #004844), Text bleibt weiss
- **Karten-Hintergründe** (ACR, Comparison): `rgba(255,255,255,0.05)` statt helle Tints
- **Audio/Video Player:** Dunklerer Chrome, gleiche Akzentfarben
- **Lead-Text Bordüre:** Grün bleibt, Text wird heller (#e5e7eb)
- **Slide Deck Banner:** Gradient angepasst an Dark-Mode-Palette
- **Code/Monospace** (ACR-Werte): Heller Text auf dunklem Hintergrund

Font-Dateien lokal in `public/blog/fonts/`:
- Lato-Bold.woff2
- Merriweather-Regular.woff2
- Merriweather-Bold.woff2

### Navigation

Neuer Navbar-Eintrag in `.vitepress/config.mts`:
```ts
nav: [
  // ... existing items
  { text: 'Blog', link: '/blog/' }
]
```

Sidebar-Ausschluss in `config.mts`:
```ts
sidebar: {
  '/blog/': false,
  // ... existing sidebar configs
}
```

Artikel haben eigenes TOC via BlogPostLayout.

### Assets (herunterladen und lokal speichern)

| Asset | Quelle | Lokaler Pfad |
|-------|--------|-------------|
| Infografik | NotebookLM (Google CDN) | `public/blog/img/passkeys-infographic.png` |
| Erklärvideo | NotebookLM (Google CDN) | `public/blog/media/passkeys-explainer.mp4` |
| Audio Podcast | NotebookLM (Google CDN) | `public/blog/media/passkeys-podcast.mp3` |
| Slide Deck PDF | NotebookLM (Google CDN) | `public/blog/media/passkeys-blueprint.pdf` |
| Thumbnail | Generiert aus Infografik | `public/blog/img/passkeys-thumb.png` |

### i18n-Vorbereitung

- Alle Vue-Komponenten nehmen Texte als Props (nicht hardcoded)
- Artikel-Frontmatter hat `lang: de` Feld — dies ist **Metadaten für Content-Loader-Filterung**, nicht für `<html lang>`. Die Seiten-Sprache bleibt `en` (global config). Bei späterem i18n-Ausbau wird `lang` über VitePress' native i18n-Locales gesteuert.
- URL-Struktur `/blog/posts/...` lässt sich zu `/blog/de/posts/...` erweitern
- Blog-Index `createContentLoader` kann nach `lang` filtern
- Späterer Ausbau: VitePress i18n-Config + übersetzte Artikel + lokalisierter Blog-Index

### Responsive Design

- Hero: Padding reduziert auf Mobile, Font-Size skaliert
- Flow-Diagramme: Horizontal scroll auf schmalen Screens (statt Wrap)
- ACR-Karten: Stack vertikal auf Mobile (CSS Grid → single column)
- Vergleichstabelle: Horizontal scrollbar auf Mobile
- Audio/Video: 100% Breite, proportionale Höhe

## Nicht im Scope

- RSS-Feed (kann später einfach ergänzt werden)
- Tags/Kategorien (nicht nötig bei wenigen Artikeln)
- Pagination (nicht nötig bei wenigen Artikeln)
- Übersetzungen EN/FR/IT (separater Folgeschritt)
- Social Sharing Buttons
- Kommentarfunktion
