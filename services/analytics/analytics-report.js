import { google } from 'googleapis';

const scopes = 'https://www.googleapis.com/auth/analytics.readonly';

const viewId = process.env.GOOGLE_VIEW_ID;
const jwt = new google.auth.JWT(
  process.env.GOOGLE_CLIENT_EMAIL,
  null,
  process.env.GOOGLE_PRIVATE_KEY,
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
