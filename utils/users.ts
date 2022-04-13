import { getColor } from "./colors"

export const defaultAvatar = (seed: string) => {
      let backgroundColor = getColor(parseInt(seed.replace(/\D/g, '')))
      if (backgroundColor === 'blue') {
            backgroundColor = 'lightBlue'
      }
      const secondaryColors:any = {
            cyan: 'yellow',
            green: 'yellow',
            yellow: 'orange',
            orange: 'cyan',
            purple: 'red',
            lightBlue: 'cyan',
            red: 'cyan'
      }
      return `https://avatars.dicebear.com/api/bottts/${seed}.svg?colorful=false&scale=90&backgroundColor=${backgroundColor}&colors[]=${secondaryColors[backgroundColor]}`
}