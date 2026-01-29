import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Mobile ID docs',
  description: 'Technical documentation for Mobile ID integration',
  base: '/',
  lastUpdated: true,
  // Enable the built-in light/dark appearance switch in the navbar
  appearance: true,

  head: [['link', { rel: 'icon', href: '/mobileid.svg' }]],

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '/img/mobileid-colors-transparent.svg',
    siteTitle: false, // Hide visual title, keep only logo (HTML <title> remains)

    nav: [
      { text: 'Home', link: '/' },
      { text: 'REST API Guide', link: '/rest-api-guide/introduction' },
      { text: 'OIDC Integration Guide', link: '/oidc-integration-guide/introduction' },
      { text: 'Release Notes', link: '/release-notes/release-notes' }

    ],

    sidebar: {
      '/rest-api-guide/': [
        {
          text: 'Reference Guide',
          items: [
            { text: 'Introduction', link: '/rest-api-guide/introduction' },
            { text: 'Integration Steps', link: '/rest-api-guide/app-provider-client-integration' },
            { text: 'Mobile ID API', link: '/rest-api-guide/mobile-id-api' },
            { text: 'Best Practices', link: '/rest-api-guide/best-practices' },
            { text: 'Auto Activation', link: '/rest-api-guide/auto-activation' },
            { text: 'Status and Fault Codes', link: '/rest-api-guide/status-fault-codes' },
            { text: 'Root CA Certificates', link: '/rest-api-guide/root-ca-certs' },
            { text: 'Create Client Certificates', link: '/rest-api-guide/create-client-certs' },
            { text: 'Health Status Service', link: '/rest-api-guide/health-status' }
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
          text: 'OIDC Guide',
          items: [
            { text: 'Introduction', link: '/oidc-integration-guide/introduction' },
            { text: 'Getting Started', link: '/oidc-integration-guide/getting-started' },
            { text: 'Best Practices', link: '/oidc-integration-guide/best-practices' },
            { text: 'Public Cloud Integration Guide', link: '/oidc-integration-guide/cloud-integration-guide' },
            { text: 'MobileID OIDC - Use Cases', link: '/oidc-integration-guide/oidc-use-cases' },
            { text: 'Message Formats on the Mobile ID App', link: '/oidc-integration-guide/message-formats' }
          ]
        }
      ],


      '/radius-interface-gateway-guide/': [
        {
          text: 'RIG Radius Guide',
          items: [
            { text: 'Index', link: '/radius-interface-gateway-guide/' },
            { text: 'One', link: '/radius-interface-gateway-guide/one' },
            { text: 'Two', link: '/radius-interface-gateway-guide/two' }
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
