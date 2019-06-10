module.exports = sls => {
  if (process.env.AWS_CERTIFICATE_ARN == null) {
    throw new Error('Environment variable AWS_CERTIFICATE_ARN is required');
  }

  const stage = process.env.STAGE || process.env.NODE_ENV || 'development';

  const cloudFrontDomain =
    stage === 'production'
      ? 'services.sjofartstidningen.se'
      : `${stage}.services.sjofartstidningen.se`;

  return {
    defaultStage: stage,
    defaultRegion: 'eu-north-1',
    apiCloudFront: {
      domain: cloudFrontDomain,
      certificate: process.env.AWS_CERTIFICATE_ARN,
      compress: true,
      cookies: 'none',
      headers: ['x-api-key'],
      querystring: 'all',
    },
  };
};
