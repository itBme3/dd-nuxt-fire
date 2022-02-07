import { NuxtConfig } from '@nuxt/types'
import colors from './utils/colors';

const isDev = process.env.NODE_ENV === 'development'
const useEmulators = false // manually change if emulators needed
console.log({ port: isDev && useEmulators ? 12345 : undefined })

const config: NuxtConfig = {
  mode: 'spa',
  head: {
    title: 'nuxt-firebase-demo',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  css: ['~/assets/scss/style.scss'],

  components: true,

  buildModules: [
    '@nuxt/typescript-build',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/firebase',
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
  // plugins: ['~/plugins/lazyMode'],

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
  tailwindcss: {
    extend: {
      colors: {
        transparent: 'transparent',
        white: colors.white,
        black: colors.black,
        blue: colors.blue,
        cyan: colors.cyan,
        green: colors.green,
        yellow: colors.yellow,
        orange: colors.orange,
        red: colors.red,
        purple: colors.purple,
        gray: colors.coolGray,
      }
    }
  }
}
export default config
