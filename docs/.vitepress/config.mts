import { defineConfig, type HeadConfig } from 'vitepress'
import { full as emoji } from 'markdown-it-emoji'
import { withMermaid } from 'vitepress-plugin-mermaid'

const SITE_URL = 'https://docs.mobileid.ch'

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
    ['meta', { name: 'robots', content: 'index, follow' }],
    ['meta', { property: 'og:site_name', content: 'Mobile ID docs' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:locale', content: 'en' }],
    ['meta', { name: 'twitter:card', content: 'summary' }],
  ],

  transformPageData(pageData) {
    const pagePath = pageData.relativePath
      .replace(/index\.md$/, '')
      .replace(/\.md$/, '.html')
    const canonicalUrl = `${SITE_URL}/${pagePath}`

    const ogTitle = pageData.title || 'Mobile ID docs'
    const ogDesc = pageData.description || 'Technical documentation for Mobile ID integration'

    pageData.frontmatter.head ??= []
    pageData.frontmatter.head.push(
      ['link', { rel: 'canonical', href: canonicalUrl }],
      ['meta', { property: 'og:title', content: ogTitle }],
      ['meta', { property: 'og:description', content: ogDesc }],
      ['meta', { property: 'og:url', content: canonicalUrl }],
    )
  },

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '/img/mobileid-colors-transparent.svg',
    siteTitle: false, // Hide visual title, keep only logo (HTML <title> remains)

    nav: [
      { text: 'Home', link: '/' },
      { text: 'REST API Guide', link: '/rest-api-guide/introduction' },
      { text: 'OIDC Integration Guide', link: '/oidc-integration-guide/introduction' },
      { text: 'RADIUS Gateway Guide', link: '/radius-interface-gateway-guide/introduction' }
    ],

    sidebar: {
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
          items: [{ text: 'Imprint', link: '/rest-api-guide/imprint' }]
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
          items: [{ text: 'Imprint', link: '/oidc-integration-guide/imprint' }]
        }
      ],


      '/radius-interface-gateway-guide/': [
        {
          text: 'RADIUS Gateway Guide',
          items: [
            { text: 'Introduction', link: '/radius-interface-gateway-guide/introduction' },
            { text: 'RIG Deployment', link: '/radius-interface-gateway-guide/deployment' },
            { text: 'The RADIUS Protocol', link: '/radius-interface-gateway-guide/radius-protocol' },
            { text: 'Annexes', link: '/radius-interface-gateway-guide/annexes' }
          ]
        },
        {
          text: '',
          items: [{ text: 'Imprint', link: '/radius-interface-gateway-guide/imprint' }]
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
