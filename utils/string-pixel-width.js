/**
 * This is a slightly modified fork of @adambisek/string-pixel-width with only
 * Helvetica included as that is the font I'm relying on right now
 */
import deburr from 'lodash.deburr';
import widthMap from './width-map.json';

const defaultSettings = { size: 12 };

const getWidth = (string, settings = {}) => {
  const { size, ...opts } = { ...settings, ...defaultSettings };
  const variant = (opts.bold ? 1 : 0) + (opts.italic ? 2 : 0);
  const map = widthMap.helvetica;

  const totalWidth = deburr(string)
    .split('')
    .reduce((acc, char) => {
      // eslint-disable-next-line
      if (/[\x00-\x1F]/.test(char)) return acc;

      const widths = map[char] || map.x;
      const width = widths[variant];
      return acc + width;
    }, 0);

  return totalWidth * (size / 100);
};

export { getWidth };
