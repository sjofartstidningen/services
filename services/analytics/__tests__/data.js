import { collect } from '../data';
import axiosMock from 'axios';

jest.mock('axios');

beforeEach(() => {
  axiosMock.get.mockReset();
});

describe('Module: Data.collect', () => {
  it('should get data about the time period for this email', async () => {
    const { date } = await collect();

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

    const { mailchimp } = await collect();

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

  it.skip('should get analytics from Google Analytics', async () => {
    const { google } = await collect();

    const periodDataObject = expect.objectContaining({
      total: expect.any(Number),
      diff: expect.any(Number),
    });

    const periodObject = expect.objectContaining({
      visitors: periodDataObject,
      unique: periodDataObject,
      pageviews: periodDataObject,
    });

    const linksArray = expect.arrayContaining([
      expect.objectContaining({
        title: expect.any(String),
        url: expect.any(String),
        views: expect.any(Number),
      }),
    ]);

    expect(google.week).toEqual(periodObject);
    expect(google.month).toEqual(periodObject);
    expect(google.articles).toEqual(linksArray);
    expect(google.jobs).toEqual(linksArray);
  });
});
