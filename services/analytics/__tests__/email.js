import { construct } from '../email';
import analyticsContext from '../../../test/mock-data/analytics-context.json';

jest.mock('../../../utils/logger.js');

describe('Module: email.construct', () => {
  it('should construct an email based on the given context', async () => {
    expect(await construct(analyticsContext)).toMatchSnapshot();
  });
});
