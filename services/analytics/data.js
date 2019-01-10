import dateFns from 'date-fns';
import locale from 'date-fns/locale/sv';
import axios from 'axios';
import * as Google from './google';

const mailchimpBaseConfig = {
  baseURL: `https://${process.env.MAILCHIMP_DC}.api.mailchimp.com/3.0`,
  auth: {
    username: 'sjofartstidningen',
    password: process.env.MAILCHIMP_API_KEY,
  },
};

async function collectMailchimpData({ start, end }) {
  const { data } = await axios.get('/campaigns', {
    ...mailchimpBaseConfig,
    params: {
      since_send_time: start,
      before_send_time: end,
      list_id: process.env.MAILCHIMP_LIST_ID,
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
    Google.getVisitsReport(weekDateRanges),
    Google.getVisitsReport(monthDateRanges),
    Google.getViewsReport(
      viewsDateRanges,
      'ga:pagePath!@/jobb/;ga:pagePath!=/;ga:pagePath!=/nyheter/',
    ),
    Google.getViewsReport(
      viewsDateRanges,
      'ga:pagePath=@/jobb/;ga:pagePath!@/jobb-karriar/',
    ),
  ]);

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
    collectMailchimpData(period).catch(() => null),
    collectGoogleData(period).catch(() => null),
  ]);

  return {
    date: {
      week: dateFns.format(period.start, 'W', { locale }),
      year: dateFns.format(period.end, 'YYYY', { locale }),
      start: dateFns.format(period.start, 'D MMMM', { locale }),
      end: dateFns.format(period.end, 'D MMMM', { locale }),
    },
    google,
    mailchimp,
  };
}

export { collect };
