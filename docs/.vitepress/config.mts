import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'MobileID',
  description: 'Technical documentation for Mobile ID integration',

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '/img/mobileid.svg',

    nav: [
      { text: 'Home', link: '/' },
      { text: 'Reference Guide', link: '/reference-guide/introduction' }
    ],

    sidebar: {
      '/reference-guide/': [
        {
          text: 'Reference Guide',
          items: [
            { text: 'Introduction', link: '/reference-guide/introduction' },
            { text: 'Application Provider Client Integration', link: '/reference-guide/application-integration' },
            { text: 'Mobile ID API', link: '/reference-guide/mobile-id-api' },
            { text: 'Best Practices', link: '/reference-guide/best-practices' },
            { text: 'Auto Activation', link: '/reference-guide/auto-activation' },
            { text: 'Status and Fault Codes', link: '/reference-guide/status-fault-codes' },
            { text: 'Root CA Certificates (Trust Anchor)', link: '/reference-guide/root-ca-certs' },
            { text: 'Create X509 Client Certificates', link: '/reference-guide/create-client-certs' },
            { text: 'Health Status Microservice', link: '/reference-guide/health-status' }
          ]
        }
      ],
      '/config/': [
        {
          text: 'Config Guide',
          items: [
            { text: 'Index', link: '/config/' },
            { text: 'One', link: '/config/one' },
            { text: 'Two', link: '/config/two' }
          ]
        }
      ]
    },

    footer: {
      message: '© Swisscom (Schweiz) AG',
      copyright: 'All rights reserved'
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/MobileID-Strong-Authentication/' }
    ],

    search: {
      provider: 'local'
    }
  }
})
