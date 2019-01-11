import { URL } from 'url';
import { getWidth } from './string-pixel-width';

const percent = num => `${(num * 100).toFixed(1)}%`;

const formatNumber = num => num.toLocaleString();

const capString = (maxWidth, string) => {
  if (getWidth(string) < maxWidth) return string;

  let finalString = `${string.slice(0, -1)}...`;

  while (getWidth(finalString) > maxWidth) {
    finalString = `${finalString.replace('...', '').slice(0, -1)}...`;
  }

  return finalString;
};

const urlPath = str => {
  const url = new URL(str);
  return `${url.pathname}${url.search}`;
};

function gt(num1, num2, opts) {
  if (num1 > num2) return opts.fn(this);
  return opts.inverse(this);
}

export { percent, formatNumber, capString, urlPath, gt };
