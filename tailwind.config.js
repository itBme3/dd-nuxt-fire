const colors = require('./utils/colors')

module.exports = {
  darkMode: 'class',
  whitelist: ['dark:bg-gray-900'],
  theme: {
    darkSelector: 'dark',
    purge: {
      content: [
        `/layouts/*.{vue,js,ts}`,
        `/layouts/**/*.{vue,js,ts}`,
        `/layouts/**/**/*.{vue,js,ts}`,
        `/pages/*.{vue,js,ts}`,
        `/pages/**/*.{vue,js,ts}`,
        `/pages/**/**/*.{vue,js,ts}`,
        `/plugins/*.{vue,js,ts}`,
        `/plugins/**/*.{vue,js,ts}`,
        `/plugins/**/**/*.{vue,js,ts}`,
        `/utils/*.{vue,js,ts}`,
        `/utils/**/*.{vue,js,ts}`,
        `/utils/**/**/*.{vue,js,ts}`,
        `/static/*.{vue,js,ts}`,
        `/static/**/*.{vue,js,ts}`,
        `/static/**/**/*.{vue,js,ts}`,
        `nuxt.config.{js,ts}`,
      ],
    },
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
        gray: colors.gray,
      },
      variants: {
        backgroundColor: [
          'dark',
          'dark-hover',
          'dark-group-hover',
          'dark-even',
          'dark-odd',
          'hover',
          'responsive',
        ],
        borderColor: [
          'dark',
          'dark-focus',
          'dark-focus-within',
          'hover',
          'responsive',
        ],
        textColor: ['dark', 'dark-hover', 'dark-active', 'hover', 'responsive'],
      },
    },
  },
}
