
let twColors = require('./static/tailwind-theme-values');
twColors = twColors.colors;

const colors = {
  blue: twColors.blue,
  cyan: twColors.cyan,
  green: twColors.green,
  yellow: twColors.yellow,
  orange: twColors.orange,
  red: twColors.red,
  purple: twColors.purple,
  gray: twColors.trueGray,
}

module.exports = {
  darkMode: 'class',
  important: true,
  purge: {
    safelist: [
    {
      pattern: /^(bg|text|border)-/,
      variants: ['hover', 'dark', 'dark:hover'],
    }
    ],
    enabled: true
  },
  
    
    fontSize: {
      xs: '.75rem',
      tiny: '.875rem',
      sm: '1rem',
      base: '1.125rem',
      lg: '1.25rem',
      xl: '1.33rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '4rem',
      '7xl': '5rem'
    },
    darkSelector: 'dark',
    colors,
  theme: {
    
    extend: {
      height: {
        13: '3.25rem'
      },
      rounded: {
        xs: '.03em',
        sm: '.13em'
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
      transitionTimingFunction: {
        'quick-in': 'cubic-bezier(0,.66,.11,1.01)',
        'ramp-in': 'cubic-bezier(.91,-0.06,.88,.34)'
      },
      keyframes: {
        'fade-in-down': {
          '0%': { display: 'none', transform: 'translateY(-100%)', opacity: 0 },
          '1%': { display: 'block', transform: 'translateY(-100%)', opacity: 0 },
          '70%': { display: 'block', transform: 'translateY(-30%)', opacity: 0.3 },
          '100%': { transform: 'translateY(0)', opacity: 1 }
        }
      },
      animation: {
        'fade-in-down': 'fade-in-down .2s quick-in'
      },
      scale: {
        '70': '.7',
        '80': '.8',
        '98': '.98',
        '97': '.97',
        '103': '1.03'
      },
      variants: {
        scale: ['hover'],
        order: ['hover'],
        zIndex: ['hover'],
        borderColor: [
          'dark',
          'dark-focus',
          'dark-focus-within',
          'hover',
          'responsive',
        ],
        backgroundColor: [
          'dark',
          'dark-hover',
          'dark-group-hover',
          'hover',
          'responsive',
        ],
        textColor: ['dark', 'dark-hover', 'dark-active', 'hover', 'responsive'],
      },
    },
  }
}
