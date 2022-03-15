import { NuxtConfig } from '@nuxt/types'

const isDev = process.env.NODE_ENV === 'development'
const fireDev = process.env.FIRE_ENV !== 'live'
const useEmulators = false // manually change if emulators needed
console.log({ isDev, port: isDev && useEmulators ? 5000 : undefined })


const config: NuxtConfig = {
  ssr: false,
  head: {
    title: 'DD Fire',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/media/fire.png' },
      { rel: 'stylesheet', href: 'https://use.typekit.net/ptm4ahe.css' },
      { rel: 'stylesheet', href: 'https://d1azc1qln24ryf.cloudfront.net/99224/GiGIcons/style-cf.css?8ct99z' }
    ],
    script: []
  },

  server: {
    port: '3333'
  },

  css: ['~/assets/scss/style.scss'],

  components: true,

  buildModules: [
    '@nuxt/typescript-build',
    '@nuxtjs/tailwindcss',
    '@nuxt/postcss8',
    '@nuxtjs/firebase',
    '@nuxtjs/color-mode',
  ],


  firebase: {
    lazy: false,
    config: {
      apiKey: fireDev ? 'AIzaSyBvdRs7O57J8c1baYHE3olZskgBxLHJtWw' : 'AIzaSyDiuv3nUpj6Z05k8ph3AbzQyHyusxknoMk',
      authDomain: fireDev ? 'dearborn-fire-dev.firebaseapp.com' : 'dearborn-denim.firebaseapp.com',
      databaseURL: fireDev ? 'https://dearborn-fire-dev.firebaseio.com' : 'https://dearborn-denim.firebaseio.com',
      projectId: fireDev ? 'dearborn-fire-dev' : 'dearborn-denim',
      storageBucket: fireDev ? 'dearborn-fire-dev.appspot.com' : 'dearborn-fire',
      messagingSenderId: fireDev ? '773304666438' : '14338671750',
      appId: fireDev ? '1:773304666438:web:ebbd2d9158bf22ee713d47' : '1:14338671750:web:0b0777f1f131edba',
      measurementId: '206385704',
    },
    onFirebaseHosting: false,
    terminateDatabasesAfterGenerate: true,
    services: {
      auth: {
        initialize: {
          onAuthStateChangedAction: 'onAuthStateChanged',
        },
        ssr: true,
        emulatorPort: isDev && useEmulators ? 9099 : undefined,
        disableEmulatorWarnings: false,
      },
      firestore: {
        memoryOnly: false,
        enablePersistence: true,
        emulatorPort: isDev && useEmulators ? 8080 : undefined,
      },
      functions: {
        emulatorPort: 5000
      },
      storage: {
        emulatorPort: isDev && useEmulators ? 9199 : undefined,
        emulatorHost: 'localhost',
      }
    },
  },

  modules: [
    '@nuxtjs/pwa',
    ['nuxt-vuex-localstorage', {
      localStorage: ['productsCache'],
    }]
  ],
  plugins: [
    '~/plugins/check-view.js',
    '~/plugins/scrollbar.js',
    '~/plugins/tailwind-components.js',
    '~/plugins/tooltip.js',
    '~/plugins/shops.js',
    '~/plugins/db.js',
    '~/plugins/algolia.js',
  ],

  build: {},

  /*
   ** Nuxt.js Middleware
   */
  router: {
    middleware: ['auth'],
  },

  pwa: {
    workbox: {
      importScripts: ['/firebase-auth-sw.js'],
      // by default the workbox module will not install the service worker in dev environment to avoid conflicts with HMR
      // only set this true for testing and remember to always clear your browser cache in development
      dev: process.env.NODE_ENV === 'development',
    },
  },
  colorMode: {
    preference: 'system', // default value of $colorMode.preference
    fallback: 'dark', // fallback value if not system preference found
    hid: 'nuxt-color-mode-script',
    globalName: '__NUXT_COLOR_MODE__',
    componentName: 'ColorScheme',
    classPrefix: '',
    classSuffix: '',
    storageKey: 'nuxt-color-mode'
  },
  tailwindcss: {
    plugins: [
      require('tailwindcss-dark-mode')(),
      require('@tailwindcss/typography')
    ],
  }
}
export default config
