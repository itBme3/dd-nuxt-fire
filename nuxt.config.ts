import { NuxtConfig } from '@nuxt/types'

const isDev = process.env.NODE_ENV === 'development'
const useEmulators = false // manually change if emulators needed
console.log({ port: isDev && useEmulators ? 12345 : undefined })

const config: NuxtConfig = {
  mode: 'spa',
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
      { rel: 'stylesheet', href: 'https://d1azc1qln24ryf.cloudfront.net/99224/GiGIcons/style-cf.css?x6haug' }
    ],
    script: [
      { src: 'https://cdnjs.cloudflare.com/ajax/libs/masonry/4.0.0/masonry.pkgd.min.js', async: true, defer: true }
    ]
  },

  css: ['~/assets/scss/style.scss'],

  components: true,

  buildModules: [
    '@nuxt/typescript-build',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/firebase',
    '@nuxtjs/color-mode',
  ],


  firebase: {
    lazy: false,
    config: {
      apiKey: 'AIzaSyDiuv3nUpj6Z05k8ph3AbzQyHyusxknoMk',
      authDomain: 'dearborn-denim.firebaseapp.com',
      databaseURL: 'https://dearborn-denim.firebaseio.com',
      projectId: 'dearborn-denim',
      storageBucket: 'dearborn-denim.appspot.com',
      messagingSenderId: '14338671750',
      appId: '1:14338671750:web:0b0777f1f131edba',
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
        emulatorPort: 12345
      },
      storage: {
        emulatorPort: isDev && useEmulators ? 9199 : undefined,
        emulatorHost: 'localhost',
      }
    },
  },

  modules: ['@nuxtjs/pwa'],
  plugins: [
    '~/plugins/check-view.js',
    '~/plugins/scrollbar.js',
    { src: '~/plugins/vue-masonry', ssr: false }
  ],

  build: {
    transpile: ['vue-instantsearch', 'instantsearch.js/es']
  },

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
      require('tailwindcss-dark-mode')()
    ],
   
  }
}
export default config
