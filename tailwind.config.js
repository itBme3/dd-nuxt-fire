const funcs = require('./utils/funcs')
const colors = require('./utils/colors')
const whitelist = Object.keys(colors).reduce((acc, color) => {
  const prefixes = [
    '',
    'hover:',
    'bg-',
    'hover:bg-',
    'dark:hover:bg-',
    'text-',
    'hover:text-',
    'dark:hover:text-',
  ]
  if (
    typeof colors[color] === 'string' ||
    Object.keys(colors[color]).length === 0
  ) {
    return [...acc, ...prefixes.map((prefix) => `${prefix}${colors[color]}`)]
  }
  return [
    ...acc,
    ...funcs.flattenArray(
      Object.keys(colors[color]).map((k) =>
        prefixes.map((prefix) => `${prefix}${colors[color]}-${k}`)
      )
    ),
  ]
}, [])
module.exports = {
  darkMode: 'class',
  whitelist,
  important: true,
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
    zIndex: (() => {
      const obj = {
        1: '1',
        0: '0',
        999: '999',
        9999: '9999',
        99999: '99999',
        999999: '999999',
        nav: '9999999',
      }
      for (let i = 0; i < 11; i++) {
        obj[`${i * 10}`] = `${i * 10}`
      }
      return obj
    })(),
    extend: {
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
