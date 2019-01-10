import { google } from 'googleapis';

const scopes = 'https://www.googleapis.com/auth/analytics.readonly';

const jwt = new google.auth.JWT(
  process.env.GOOGLE_CLIENT_EMAIL,
  null,
  process.env.GOOGLE_PRIVATE_KEY,
  scopes,
);

async function analyticsReport(reportConfig) {
  await jwt.authorize();

  const viewId = process.env.GOOGLE_VIEW_ID;

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
