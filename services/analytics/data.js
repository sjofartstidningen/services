import dateFns from 'date-fns';
import locale from 'date-fns/locale/sv';
import axios from 'axios';
import * as Google from './google';
import { logger, logPromise, logException } from '../../utils/logger';
import { getEnv } from '../../utils/env';

const mailchimpBaseConfig = {
  baseURL: `https://${getEnv('MAILCHIMP_DC')}.api.mailchimp.com/3.0`,
  auth: {
    username: 'sjofartstidningen',
    password: getEnv('MAILCHIMP_API_KEY'),
  },
};

async function collectMailchimpData({ start, end }) {
  const { data } = await axios.get('/campaigns', {
    ...mailchimpBaseConfig,
    params: {
      since_send_time: start,
      before_send_time: end,
      list_id: getEnv('MAILCHIMP_LIST_ID'),
    },
  });

  const campaigns = await Promise.all(
    data.campaigns.map(async campaign => {
      const { data: clickReport } = await axios.get(
        `/reports/${campaign.id}/click-details`,
        {
          ...mailchimpBaseConfig,
          params: { count: 50 },
        },
      );

      return {
        title: campaign.settings.title,
        subject: campaign.settings.subject_line,
        stats: {
          recipients: campaign.recipients.recipient_count,
          openRate: campaign.report_summary.open_rate,
          clickRate: campaign.report_summary.click_rate,
        },
        articles: clickReport.urls_clicked
          .sort((a, b) => b.total_clicks - a.total_clicks)
          .slice(0, 5)
          .map(item => ({
            url: item.url,
            clicks: item.total_clicks,
          })),
      };
    }),
  );

  logger.info('Mailchimp data successfully collected');
  return { campaigns };
}

async function collectGoogleData({ start, end }) {
  const format = d => dateFns.format(d, 'YYYY-MM-DD');

  const weekDateRanges = [
    { startDate: format(start), endDate: format(end) },
    {
      startDate: format(dateFns.subWeeks(start, 1)),
      endDate: format(dateFns.subWeeks(end, 1)),
    },
  ];

  const monthDateRanges = [
    { startDate: format(dateFns.subMonths(end, 1)), endDate: format(end) },
    {
      startDate: format(dateFns.subYears(dateFns.subMonths(end, 1), 1)),
      endDate: format(dateFns.subYears(end, 1)),
    },
  ];

  const viewsDateRanges = weekDateRanges.slice(0, 1);

  const [week, month, articles, jobs] = await Promise.all([
    Google.getVisitsReport(weekDateRanges).then(
      logPromise('Google week data fetched'),
    ),
    Google.getVisitsReport(monthDateRanges).then(
      logPromise('Google month data fetched'),
    ),
    Google.getViewsReport(
      viewsDateRanges,
      'ga:pagePath!@/jobb/;ga:pagePath!=/;ga:pagePath!=/nyheter/',
    ).then(logPromise('Google articles data fetched')),
    Google.getViewsReport(
      viewsDateRanges,
      'ga:pagePath=@/jobb/;ga:pagePath!@/jobb-karriar/',
    ).then(logPromise('Google jobs data fetched')),
  ]);

  logger.info('Google data succesfully collected');
  return {
    week,
    month,
    articles,
    jobs,
  };
}

async function collect() {
  const today = new Date();
  const lastWeek = dateFns.subWeeks(today, 1);

  const period = {
    start: dateFns.startOfWeek(lastWeek, { weekStartsOn: 1 }),
    end: dateFns.endOfWeek(lastWeek, { weekStartsOn: 1 }),
  };

  const [mailchimp, google] = await Promise.all([
    collectMailchimpData(period).catch(
      logException('Failed fetching Mailchimp data'),
    ),
    collectGoogleData(period).catch(
      logException('Failed fetching Google data'),
    ),
  ]);

  const data = {
    date: {
      week: dateFns.format(period.start, 'W', { locale }),
      year: dateFns.format(period.end, 'YYYY', { locale }),
      start: dateFns.format(period.start, 'D MMMM', { locale }),
      end: dateFns.format(period.end, 'D MMMM', { locale }),
    },
    google,
    mailchimp,
  };

  logger.info('Data successfully collected');
  return data;
}

export { collect };
