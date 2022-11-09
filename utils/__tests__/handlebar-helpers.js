import * as helpers from '../handlebars-helpers';

// percent, formatNumber, capString, urlPath, gt

describe('handlebarHelpers.percent', () => {
  it('should transform a float to percent', () => {
    expect(helpers.percent(0.1)).toEqual('10.0%');
    expect(helpers.percent(0.1234)).toEqual('12.3%');
    expect(helpers.percent(-0.01)).toEqual('-1.0%');
  });
});

describe('handlebarHelpers.formatNumber', () => {
  it('should format a number', () => {
    expect(helpers.formatNumber(1234)).toEqual('1,234');
    expect(helpers.formatNumber(1)).toEqual('1');
    expect(helpers.formatNumber(1000.5)).toEqual('1,000.5');
  });
});

describe('handlebarHelpers.capString', () => {
  it('should cut a string and append ellipsis based on length', () => {
    expect(helpers.capString(100, 'The brown fox jumped')).toMatchSnapshot();
    expect(helpers.capString(10, 'The brown fox jumped')).toMatchSnapshot();
  });
});

describe('handlebarHelpers.urlPath', () => {
  it('should extract only the path and serach parts of a url', () => {
    expect(helpers.urlPath('https://test.com')).toEqual('/');
    expect(helpers.urlPath('https://test.com/')).toEqual('/');
    expect(helpers.urlPath('https://test.com/path-part')).toEqual('/path-part');
    expect(helpers.urlPath('https://test.com/path-part?search=part')).toEqual('/path-part?search=part');
  });
});

describe('handlebarHelpers.gt', () => {
  it('should check if num 1 is greater than num 2', () => {
    const opts = {
      fn: jest.fn(() => 'num 1 is greater'),
      inverse: jest.fn(() => 'num 2 is greater'),
    };

    expect(helpers.gt(3, 2, opts)).toEqual('num 1 is greater');
    expect(helpers.gt(2, 3, opts)).toEqual('num 2 is greater');
    expect(helpers.gt(2, 2, opts)).toEqual('num 2 is greater');
  });
});
