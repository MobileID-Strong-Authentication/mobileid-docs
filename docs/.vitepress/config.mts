import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: ' ',
  description: 'Technical documentation for Mobile ID integration',
  base: '/',
  lastUpdated: true,
  appearance: false,

  head: [['link', { rel: 'icon', href: '/mobileid.svg' }]],

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '/img/mobileid-colors.png',

    nav: [
      { text: 'Home', link: '/' },
      { text: 'API Reference Guide', link: '/reference-guide/introduction' },
      { text: 'OIDC Integration', link: '/oidc/introduction' },
      {
        text: 'More',
        items: [
          { text: 'Release Notes', link: '/release-notes/release-notes' },
          { text: 'API Specification', link: '/api-reference/api' },
        ]
      }

    ],

    sidebar: {
      '/reference-guide/': [
        {
          text: 'Reference Guide',
          items: [
            { text: 'Introduction', link: '/reference-guide/introduction' },
            { text: 'Application Provider Client Integration', link: '/reference-guide/app-provider-client-integration' },
            { text: 'Mobile ID API', link: '/reference-guide/mobile-id-api' },
            { text: 'Best Practices', link: '/reference-guide/best-practices' },
            { text: 'Auto Activation', link: '/reference-guide/auto-activation' },
            { text: 'Status and Fault Codes', link: '/reference-guide/status-fault-codes' },
            { text: 'Root CA Certificates (Trust Anchor)', link: '/reference-guide/root-ca-certs' },
            { text: 'Create X509 Client Certificates', link: '/reference-guide/create-client-certs' },
            { text: 'Health Status Microservice', link: '/reference-guide/health-status' }
          ]
        },

        {
        text: '',
          items: [
            { text: 'Imprint', link: '/reference-guide/imprint.md' },
            ]
        }

      ],
      '/entraid/': [
        {
          text: 'EntraID Guide',
          items: [
            { text: 'Index', link: '/entraid/' },
            { text: 'One', link: '/entraid/one' },
            { text: 'Two', link: '/entraid/two' }
          ]
        }
      ],

      '/oidc/': [
        {
          text: 'OIDC Guide',
          items: [
            { text: 'Introduction', link: '/oidc/introduction' },
            { text: 'Getting Started', link: '/oidc/getting-started' },
            { text: 'Best Practices', link: '/oidc/best-practices' },
            { text: 'Public Cloud Integration Guide', link: '/oidc/cloud-integration-guide' },
            { text: 'MobileID OIDC - Use Cases', link: '/oidc/oidc-use-cases' },
            { text: 'Message Formats on the Mobile ID App', link: '/oidc/message-formats' }
          ]
        }
      ],


      '/rig-radius/': [
        {
          text: 'RIG Radius Guide',
          items: [
            { text: 'Index', link: '/rig-radius/' },
            { text: 'One', link: '/rig-radius/one' },
            { text: 'Two', link: '/rig-radius/two' }
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
      provider: 'local'
    }
  }
})
