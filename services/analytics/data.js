import dateFns from 'date-fns';
import locale from 'date-fns/locale/sv';
import axios from 'axios';

const mailchimpBaseConfig = {
  baseURL: `https://${process.env.MAILCHIMP_DC}.api.mailchimp.com/3.0`,
  auth: {
    username: 'sjofartstidningen',
    password: process.env.MAILCHIMP_API_KEY,
  },
};

async function collectMailchimpData({ start, end }) {
  try {
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
  } catch (error) {
    return null;
  }
}

async function collectGoogleData({ start, end }) {
  return {
    week: {},
    month: {},
    articles: [],
    jobs: [],
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
    collectMailchimpData(period),
    collectGoogleData(period),
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
