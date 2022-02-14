const tailwindColors = require('tailwindcss/colors')
const colors = {
    transparent: 'transparent',
    white: tailwindColors.white,
    black: tailwindColors.black,
    blue: tailwindColors.blue,
    cyan: tailwindColors.cyan,
    green: tailwindColors.green,
    yellow: tailwindColors.yellow,
    orange: tailwindColors.orange,
    red: tailwindColors.red,
    purple: tailwindColors.purple,
    gray: tailwindColors.trueGray,
}

const safelist = Object.keys(colors).reduce((acc, color) => {
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
    return [...acc, ...prefixes.map((prefix) => `${prefix}${color}`)]
  }
  return [
    ...acc,
    ...Object.keys(colors[color]).reduce((_acc, k) => {
      return [..._acc, ...prefixes.map((prefix) => `${prefix}${color}-${k}`)]
    }, []),
  ]
}, []);
module.exports = {

    colors, safelist

}