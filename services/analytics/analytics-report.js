import { google } from 'googleapis';
import { getEnv } from '../../utils/env';

const scopes = 'https://www.googleapis.com/auth/analytics.readonly';

const viewId = getEnv('GOOGLE_VIEW_ID');
const jwt = new google.auth.JWT(
  getEnv('GOOGLE_CLIENT_EMAIL'),
  null,
  getEnv('GOOGLE_PRIVATE_KEY'),
  scopes,
);

const authorize = jwt.authorize();

async function analyticsReport(reportConfig) {
  await authorize;

  const result = await google.analyticsreporting('v4').reports.batchGet({
    auth: jwt,
    requestBody: {
      reportRequests: [
        {
          viewId,
          ...reportConfig,
        },
      ],
    },
  });

  return result.data;
}

export { analyticsReport };
