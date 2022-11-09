import axiosMock from 'axios';

import { analyticsReport as analyticsReportMock } from '../analytics-report';
import { collect } from '../data';

jest.mock('axios');
jest.mock('../analytics-report.js');

beforeEach(() => {
  axiosMock.get.mockReset();
  analyticsReportMock.mockReset();
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

  it('should collect data from google', async () => {
    const visitsReport = require('../../../test/mock-data/google-visits-report.json');
    const viewsReport = require('../../../test/mock-data/google-views-report.json');

    analyticsReportMock
      .mockResolvedValueOnce(visitsReport)
      .mockResolvedValueOnce(visitsReport)
      .mockResolvedValueOnce(viewsReport)
      .mockResolvedValueOnce(viewsReport);

    const { google } = await collect();

    const visitsReportDataObject = expect.objectContaining({
      total: expect.any(Number),
      diff: expect.any(Number),
    });

    const visitsReportData = expect.objectContaining({
      users: visitsReportDataObject,
      sessions: visitsReportDataObject,
      pageviews: visitsReportDataObject,
    });

    const viewsReportData = expect.arrayContaining([
      expect.objectContaining({
        title: expect.any(String),
        url: expect.any(String),
        views: expect.any(Number),
      }),
    ]);

    expect(google.week).toEqual(visitsReportData);
    expect(google.month).toEqual(visitsReportData);
    expect(google.articles).toEqual(viewsReportData);
    expect(google.jobs).toEqual(viewsReportData);
  });
});
