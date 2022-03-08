import { getRandomNumber } from "./funcs";

export const colors = ['blue', 'cyan', 'green', 'yellow', 'orange', 'red', 'purple'];

export const getColor = (index: number | 'random' = 'random') => {
      if (index === 'random') return colors[getRandomNumber(0, colors.length - 1)];
      const offset = index <= 7 ? 0 : 7 * Math.floor(index / 7);
      const indx = index - offset;
      const colorIndex = indx % 7 === 0  ? 0
            : indx % 6 === 0  ? 6
            : indx % 5 === 0 ? 5
            : indx % 4 === 0 ? 4
            : indx % 3 === 0 ? 3
            : indx % 2 === 0 ? 2
            : 1;
      return colors[colorIndex];
}