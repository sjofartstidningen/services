import { analyticsReport } from './utils';

const extractVisitsData = (index, curr, prev) => ({
  total: Number.parseInt(curr.values[index], 10),
  diff:
    Number.parseInt(curr.values[index], 10) /
      Number.parseInt(prev.values[index], 10) -
    1,
});

async function getVisitsReport(dateRanges) {
  const metrics = [
    { expression: 'ga:users' },
    { expression: 'ga:sessions' },
    { expression: 'ga:pageviews' },
  ];

  const data = await analyticsReport({
    dateRanges,
    metrics,
  });

  const [currentPeriod, previousPeriod] = data.reports[0].data.rows[0].metrics;

  const report = {
    users: extractVisitsData(0, currentPeriod, previousPeriod),
    sessions: extractVisitsData(1, currentPeriod, previousPeriod),
    pageviews: extractVisitsData(2, currentPeriod, previousPeriod),
  };

  return report;
}

/**
 * Filter news: ga:pagePath!@/jobb/;ga:pagePath!=/;ga:pagePath!=/nyheter/
 * Filter jobs: ga:pagePath=@/jobb/;ga:pagePath!@/jobb-karriar/
 */
async function getViewsReport(dateRanges, filtersExpression) {
  const metrics = [{ expression: 'ga:pageviews' }];
  const dimensions = [{ name: 'ga:pagePath' }, { name: 'ga:pageTitle' }];
  const orderBys = [{ fieldName: 'ga:pageviews', sortOrder: 'DESCENDING' }];

  const report = await analyticsReport({
    dateRanges,
    metrics,
    dimensions,
    orderBys,
    pageSize: 5,
    filtersExpression,
  });

  const data = report.reports[0].data.rows;
  return data.map(entry => ({
    title: entry.dimensions[1]
      .replace('Sjöfartstidningen', '')
      .replace(/\|/g, '')
      .trim(),
    url: `https://www.sjofartstidningen.se${entry.dimensions[0]}`,
    views: Number.parseInt(entry.metrics[0].values[0], 10),
  }));
}

export { getVisitsReport, getViewsReport };
