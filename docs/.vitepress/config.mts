import { defineConfig } from 'vitepress'
import { full as emoji } from 'markdown-it-emoji'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Mobile ID docs',
  description: 'Technical documentation for Mobile ID integration',
  base: '/',
  lastUpdated: true,
  // Enable the built-in light/dark appearance switch in the navbar
  appearance: true,

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
  ],

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
          items: [{ text: 'API Specification', link: '/rest-api-guide/api-specification' }]
        },
        {
          text: '',
          items: [{ text: 'Imprint', link: '/rest-api-guide/imprint.md' }]
        }

      ],
      '/entraid-guide/': [
        {
          text: 'EntraID Guide',
          items: [
            { text: 'Index', link: '/entraid-guide/' },
            { text: 'One', link: '/entraid-guide/one' },
            { text: 'Two', link: '/entraid-guide/two' }
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
            { text: 'Public Cloud Integration', link: '/oidc-integration-guide/cloud-integration-guide' },
            { text: 'Passkey Authentication', link: '/oidc-integration-guide/passkey-authentication' },
            { text: 'MobileID OIDC - Use Cases', link: '/oidc-integration-guide/oidc-use-cases' },
            { text: 'App Message Formats', link: '/oidc-integration-guide/message-formats' }
          ]
        },
        {
          text: '',
          items: [{ text: 'Imprint', link: '/oidc-integration-guide/imprint.md' }]
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
          items: [{ text: 'Imprint', link: '/radius-interface-gateway-guide/imprint.md' }]
        }
      ]

    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/MobileID-Strong-Authentication/' },
      { icon: 'youtube', link: 'https://www.youtube.com/@Mobile-ID/' },
      { icon: 'linkedin', link: 'https://www.linkedin.com/company/25070712/' },
    ],

    search: {
      provider: 'local'
    }
  }
})
