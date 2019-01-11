import dateFns from 'date-fns';
import * as Google from '../google';
import { analyticsReport as analyticsReportMock } from '../analytics-report';

jest.mock('../analytics-report.js');
jest.mock('../../../utils/logger.js');

const format = date => dateFns.format(date, 'YYYY-MM-DD');
const dateRange = [
  {
    startDate: format(dateFns.subWeeks(new Date(), 1)),
    endDate: format(new Date()),
  },
  {
    startDate: format(dateFns.subWeeks(new Date(), 2)),
    endDate: format(dateFns.subWeeks(new Date(), 1)),
  },
];

beforeEach(() => analyticsReportMock.mockReset());

describe('Module: Google.getVisitsReport', () => {
  it('should get a visits report', async () => {
    analyticsReportMock.mockResolvedValueOnce(
      require('../../../test/mock-data/google-visits-report.json'),
    );

    const result = await Google.getVisitsReport(dateRange);

    const dataObject = expect.objectContaining({
      total: expect.any(Number),
      diff: expect.any(Number),
    });

    const visitsReport = expect.objectContaining({
      users: dataObject,
      sessions: dataObject,
      pageviews: dataObject,
    });

    expect(result).toEqual(visitsReport);
  });
});

describe('Module: Google.getViewsReport', () => {
  it('should get a list pages sorted by most views', async () => {
    analyticsReportMock.mockResolvedValueOnce(
      require('../../../test/mock-data/google-views-report.json'),
    );

    const filter = 'ga:pagePath!@/jobb/;ga:pagePath!=/;ga:pagePath!=/nyheter/';
    const result = await Google.getViewsReport(dateRange.slice(0, 1), filter);

    const viewsReport = expect.arrayContaining([
      expect.objectContaining({
        title: expect.any(String),
        url: expect.any(String),
        views: expect.any(Number),
      }),
    ]);

    expect(result).toEqual(viewsReport);
  });
});
