import { getData } from '../data';
import axiosMock from 'axios';

jest.mock('axios');

beforeEach(() => {
  axiosMock.get.mockReset();
});

describe('Module: data.getData', () => {
  it('should get data about the time period for this email', async () => {
    const { date } = await getData();

    expect(Number.parseInt(date.week)).not.toBeNaN();
    expect(Number.parseInt(date.year)).not.toBeNaN();
    expect(date.start).toMatch(/\d+ \w+/);
    expect(date.end).toMatch(/\d+ \w+/);
  });

  it('should get analytics from Mailchimp', async () => {
    axiosMock.get
      .mockResolvedValueOnce({
        data: require('../../../test/mock-data/mailchimp-campaigns.json'),
      })
      .mockResolvedValueOnce({
        data: require('../../../test/mock-data/mailchimp-click-report.json'),
      });

    const { mailchimp } = await getData();

    expect(mailchimp.campaigns).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: expect.any(String),
          subject: expect.any(String),
          stats: expect.objectContaining({
            recipients: expect.any(Number),
            openRate: expect.any(Number),
            clickRate: expect.any(Number),
          }),
          articles: expect.arrayContaining([
            expect.objectContaining({
              url: expect.any(String),
              clicks: expect.any(Number),
            }),
          ]),
        }),
      ]),
    );
  });
});
