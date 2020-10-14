import { google } from 'googleapis';

import { getEnv } from '../../utils/env';

const scopes = 'https://www.googleapis.com/auth/analytics.readonly';

const GOOGLE_CLIENT_EMAIL = getEnv('GOOGLE_CLIENT_EMAIL');
const GOOGLE_PRIVATE_KEY = getEnv('GOOGLE_PRIVATE_KEY');
const GOOGLE_VIEW_ID = getEnv('GOOGLE_VIEW_ID');

const jwt = new google.auth.JWT(
  GOOGLE_CLIENT_EMAIL,
  null,
  GOOGLE_PRIVATE_KEY,
  scopes,
);

const authorize = jwt.authorize();

async function analyticsReport(reportConfig) {
  await authorize;

  const result = await google.analyticsreporting('v4').reports.batchGet({
    auth: jwt,
    requestBody: {
      reportRequests: [{ viewId: GOOGLE_VIEW_ID, ...reportConfig }],
    },
  });

  return result.data;
}

export { analyticsReport };
