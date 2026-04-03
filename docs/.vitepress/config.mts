import { defineConfig, type HeadConfig } from 'vitepress'
import { full as emoji } from 'markdown-it-emoji'
import { withMermaid } from 'vitepress-plugin-mermaid'
import { existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const SITE_URL = 'https://docs.mobileid.ch'
const DOCS_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const RELEASE_NOTES_POST_LAYOUT = 'release-notes-post'
const SUPPORTED_LANGS = ['en', 'de', 'fr', 'it'] as const

type SupportedLang = typeof SUPPORTED_LANGS[number]

const HREFLANG_BY_LANG: Record<SupportedLang, string> = {
  en: 'en',
  de: 'de-CH',
  fr: 'fr-CH',
  it: 'it-CH',
}

const OG_LOCALE_BY_LANG: Record<SupportedLang, string> = {
  en: 'en_US',
  de: 'de_CH',
  fr: 'fr_CH',
  it: 'it_CH',
}

function toAbsoluteUrl(url: string): string {
  if (/^https?:\/\//.test(url)) return url
  return `${SITE_URL}${url.startsWith('/') ? '' : '/'}${url}`
}

function getPageLang(pageData: { relativePath: string; frontmatter: Record<string, any> }): SupportedLang {
  const frontmatterLang = pageData.frontmatter.lang
  if (SUPPORTED_LANGS.includes(frontmatterLang)) return frontmatterLang

  const langFromPath = pageData.relativePath.match(/\.(de|fr|it|en)\.md$/)?.[1]
  if (langFromPath && SUPPORTED_LANGS.includes(langFromPath as SupportedLang)) {
    return langFromPath as SupportedLang
  }

  return 'en'
}

function getPagePath(relativePath: string): string {
  return relativePath
    .replace(/index\.md$/, '')
    .replace(/\.md$/, '.html')
}

function getSourceRelativePath(url: string): string {
  const normalizedUrl = url.replace(/^\//, '')
  if (!normalizedUrl) return 'index.md'
  if (normalizedUrl.endsWith('/')) return `${normalizedUrl}index.md`
  return normalizedUrl.replace(/\.html$/, '.md')
}

function getAlternatePages(relativePath: string) {
  const baseRel = relativePath
    .replace(/\.md$/, '')
    .replace(/\.(de|fr|it|en)$/, '')

  return SUPPORTED_LANGS.flatMap((lang) => {
    const candidateRel = lang === 'en' ? `${baseRel}.md` : `${baseRel}.${lang}.md`
    if (!existsSync(resolve(DOCS_ROOT, candidateRel))) return []

    return [{
      lang,
      hreflang: HREFLANG_BY_LANG[lang],
      ogLocale: OG_LOCALE_BY_LANG[lang],
      path: `/${getPagePath(candidateRel)}`,
      url: toAbsoluteUrl(`/${getPagePath(candidateRel)}`),
    }]
  })
}

function getFrontmatterKeywords(frontmatter: Record<string, any>): string[] {
  const rawKeywords = frontmatter.keywords
  if (Array.isArray(rawKeywords)) {
    return rawKeywords
      .map((keyword) => String(keyword).trim())
      .filter(Boolean)
  }

  if (typeof rawKeywords === 'string') {
    return rawKeywords
      .split(',')
      .map((keyword) => keyword.trim())
      .filter(Boolean)
  }

  return []
}

// https://vitepress.dev/reference/site-config
export default withMermaid(defineConfig({
  title: 'Mobile ID docs',
  description: 'Technical documentation for Mobile ID integration',
  lang: 'en',
  base: '/',
  lastUpdated: true,
  // Enable the built-in light/dark appearance switch in the navbar
  appearance: true,

  sitemap: {
    hostname: SITE_URL,
    transformItems(items) {
      return items
        .map((item) => {
          const alternates = getAlternatePages(getSourceRelativePath(String(item.url)))
          if (alternates.length < 2) return item

          const xDefault = alternates.find((alternate) => alternate.lang === 'en')

          return {
            ...item,
            links: [
              ...alternates.map((alternate) => ({
                lang: alternate.hreflang,
                url: alternate.path,
              })),
              ...(xDefault
                ? [{
                    lang: 'x-default',
                    url: xDefault.path,
                  }]
                : []),
            ],
          }
        })
    },
  },

  markdown: {
    config: (md) => {
      md.use(emoji)
    }
  },

  head: [
    ['link', { rel: 'icon', type: 'image/png', sizes: '96x96', href: '/favicon-96x96.png' }],
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    ['link', { rel: 'shortcut icon', href: '/favicon.ico' }],
    ['link', { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' }],
    ['link', { rel: 'manifest', href: '/site.webmanifest' }],
    ['meta', { name: 'google-site-verification', content: '2x5Mq4fWD8x1K2N_Z9W0za5Bwjb2WGSv0EdXZjtboPQ' }],
    ['meta', { name: 'robots', content: 'index, follow, max-image-preview:large' }],
    ['meta', { property: 'og:site_name', content: 'Mobile ID docs' }],
    ['meta', { name: 'twitter:card', content: 'summary' }],
  ],

  transformPageData(pageData) {
    const pagePath = getPagePath(pageData.relativePath)
    const canonicalUrl = `${SITE_URL}/${pagePath}`
    const lang = getPageLang(pageData)
    const alternates = getAlternatePages(pageData.relativePath)

    const ogTitle = pageData.title || 'Mobile ID docs'
    const ogDesc = pageData.description || 'Technical documentation for Mobile ID integration'
    const socialImage = pageData.frontmatter.thumbnail
      ? toAbsoluteUrl(pageData.frontmatter.thumbnail)
      : undefined
    const isReleaseNotesPost = pageData.frontmatter.layout === RELEASE_NOTES_POST_LAYOUT
    const keywords = getFrontmatterKeywords(pageData.frontmatter)
    const head: HeadConfig[] = [
      ['link', { rel: 'canonical', href: canonicalUrl }],
      ['meta', { property: 'og:title', content: ogTitle }],
      ['meta', { property: 'og:description', content: ogDesc }],
      ['meta', { property: 'og:url', content: canonicalUrl }],
      ['meta', { property: 'og:type', content: isReleaseNotesPost ? 'article' : 'website' }],
      ['meta', { property: 'og:locale', content: OG_LOCALE_BY_LANG[lang] }],
    ]

    if (socialImage) {
      head.push(
        ['meta', { property: 'og:image', content: socialImage }],
        ['meta', { property: 'og:image:alt', content: ogTitle }],
        ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
        ['meta', { name: 'twitter:image', content: socialImage }],
      )
    }

    if (isReleaseNotesPost) {
      const publishedDate = pageData.frontmatter.date
        ? new Date(pageData.frontmatter.date).toISOString()
        : undefined

      head.push(
        ['meta', { name: 'twitter:title', content: ogTitle }],
        ['meta', { name: 'twitter:description', content: ogDesc }],
      )

      if (publishedDate) {
        head.push(['meta', { property: 'article:published_time', content: publishedDate }])
      }

      if (pageData.frontmatter.author) {
        head.push(['meta', { property: 'article:author', content: pageData.frontmatter.author }])
      }

      head.push(['meta', { property: 'article:section', content: 'Release Notes' }])

      if (keywords.length > 0) {
        head.push(['meta', { name: 'keywords', content: keywords.join(', ') }])

        for (const keyword of keywords) {
          head.push(['meta', { property: 'article:tag', content: keyword }])
        }
      }

      if (alternates.length > 1) {
        const currentAlternate = alternates.find((alternate) => alternate.lang === lang)
        const xDefault = alternates.find((alternate) => alternate.lang === 'en') ?? currentAlternate

        for (const alternate of alternates) {
          head.push(['link', { rel: 'alternate', hreflang: alternate.hreflang, href: alternate.url }])
        }

        if (xDefault) {
          head.push(['link', { rel: 'alternate', hreflang: 'x-default', href: xDefault.url }])
        }

        for (const alternate of alternates) {
          if (alternate.lang !== lang) {
            head.push(['meta', { property: 'og:locale:alternate', content: alternate.ogLocale }])
          }
        }
      }

      const articleSchema = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: ogTitle,
        description: ogDesc,
        url: canonicalUrl,
        mainEntityOfPage: canonicalUrl,
        datePublished: publishedDate,
        inLanguage: HREFLANG_BY_LANG[lang],
        articleSection: 'Release Notes',
        keywords: keywords.length > 0 ? keywords : undefined,
        image: socialImage ? [socialImage] : undefined,
        author: pageData.frontmatter.author
          ? {
              '@type': 'Organization',
              name: pageData.frontmatter.author,
            }
          : undefined,
        publisher: {
          '@type': 'Organization',
          name: 'Swisscom',
          url: 'https://www.swisscom.ch/mobileid',
        },
      }

      head.push([
        'script',
        { type: 'application/ld+json' },
        JSON.stringify(articleSchema),
      ])
    }

    pageData.frontmatter.head ??= []
    pageData.frontmatter.head.push(...head)
  },

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '/img/mobileid-colors-transparent.svg',
    siteTitle: false, // Hide visual title, keep only logo (HTML <title> remains)

    nav: [
      { text: 'Home', link: '/' },
      { text: 'REST API Guide', link: '/rest-api-guide/introduction' },
      { text: 'OIDC Integration Guide', link: '/oidc-integration-guide/introduction' },
      { text: 'RADIUS Gateway Guide', link: '/radius-interface-gateway-guide/introduction' },
      { text: 'Release Notes', link: '/release-notes/' },
    ],

    sidebar: {
      '/release-notes/': [],
      '/rest-api-guide/': [
        {
          text: 'REST API Guide',
          items: [
            { text: 'Introduction', link: '/rest-api-guide/introduction' },
            { text: 'Integration Steps', link: '/rest-api-guide/app-provider-client-integration' },
            { text: 'Mobile ID API', link: '/rest-api-guide/mobile-id-api' },
            { text: 'Best Practices', link: '/rest-api-guide/best-practices' },
            { text: 'Auto Activation', link: '/rest-api-guide/auto-activation' },
            { text: 'Status and Fault Codes', link: '/rest-api-guide/status-fault-codes' },
            { text: 'Root CA Certificates', link: '/rest-api-guide/root-ca-certs' },
            { text: 'Create Client Certificates', link: '/rest-api-guide/create-client-certs' },
            { text: 'Health Status Service', link: '/rest-api-guide/health-status' },
            { text: 'Java Reference Client', link: '/rest-api-guide/java-reference-client' },
            { text: 'Troubleshooting', link: '/rest-api-guide/troubleshooting' }
          ]
        },

        {
          text: '',
          items: [
            { text: 'API Specification (REST)', link: '/rest-api-guide/api-specification' },
            { text: 'WSDL Specification (SOAP)', link: '/rest-api-guide/wsdl-specification' }
          ]
        },
        {
          text: '',
          items: [
            { text: 'Imprint', link: '/legal/imprint' },
            { text: 'Privacy Notice', link: '/legal/privacy' }
          ]
        }

      ],
      '/oidc-integration-guide/': [
        {
          text: 'OIDC Integration Guide',
          items: [
            { text: 'Introduction', link: '/oidc-integration-guide/introduction' },
            { text: 'Getting Started', link: '/oidc-integration-guide/getting-started' },
            { text: 'Best Practices', link: '/oidc-integration-guide/best-practices' },
            { text: 'Passkey Authentication', link: '/oidc-integration-guide/passkey-authentication' },
            { text: 'Public Cloud Integration', link: '/oidc-integration-guide/cloud-integration-guide' },
            { text: 'Use Cases', link: '/oidc-integration-guide/oidc-use-cases' },
            { text: 'App Message Formats', link: '/oidc-integration-guide/message-formats' }
          ]
        },
        {
          text: '',
          items: [
            { text: 'Imprint', link: '/legal/imprint' },
            { text: 'Privacy Notice', link: '/legal/privacy' }
          ]
        }
      ],


      '/radius-interface-gateway-guide/': [
        {
          text: 'RADIUS Gateway Guide',
          items: [
            { text: 'Introduction', link: '/radius-interface-gateway-guide/introduction' },
            { text: 'RIG Deployment', link: '/radius-interface-gateway-guide/deployment' },
            { text: 'Configuration', link: '/radius-interface-gateway-guide/configuration' },
            { text: 'The RADIUS Protocol', link: '/radius-interface-gateway-guide/radius-protocol' },
            { text: 'Annexes', link: '/radius-interface-gateway-guide/annexes' }
          ]
        },
        {
          text: '',
          items: [
            { text: 'Imprint', link: '/legal/imprint' },
            { text: 'Privacy Notice', link: '/legal/privacy' }
          ]
        }
      ]

    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/MobileID-Strong-Authentication/' },
      { icon: 'youtube', link: 'https://www.youtube.com/@Mobile-ID/' },
      { icon: 'linkedin', link: 'https://www.linkedin.com/company/25070712/' },
    ],

    search: {
      provider: 'local',
      options: {
        detailedView: true,
        miniSearch: {
          searchOptions: {
            fuzzy: 0.2,
            prefix: true,
            boost: { title: 4, text: 2, titles: 1 },
          },
        },
      },
    },
  },

  mermaid: {},
}))
