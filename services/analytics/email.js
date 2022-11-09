import axios from 'axios';
import fs from 'fs';
import Handlebars from 'handlebars';
import mjml from 'mjml';
import path from 'path';
import { promisify } from 'util';

import { getEnv } from '../../utils/env';
import * as helpers from '../../utils/handlebars-helpers';
import { logger } from '../../utils/logger';

const readFile = promisify(fs.readFile);

async function construct(data) {
  logger.info('Will generate email body from data provided');

  const templatePath = path.join(__dirname, '../../static/email-templates/analytics.mjml');
  const templateSource = await readFile(templatePath, 'utf-8');
  logger.debug(`Read template source from ${templatePath}`);

  const hbsTemplate = Handlebars.compile(templateSource, { strict: true });
  const mjmlTemplate = hbsTemplate(data, { helpers });
  logger.debug('Compiled Handlebars template');

  const { html } = mjml(mjmlTemplate, {
    minify: true,
    validationLevel: 'strict',
  });
  logger.debug('Generated email body from mjml template');

  logger.info('Generated email body from template');
  return html;
}

async function send({ body, subject, from, recipients }) {
  logger.info('Will send email');
  logger.info(`Sending with subject: ${subject}`);
  logger.info(`Sending to: ${recipients.map((r) => r.email).join(', ')}`);

  await axios.post(
    'https://api.sendgrid.com/v3/mail/send',
    {
      personalizations: recipients.map((r) => ({ to: [r] })),
      from,
      subject,
      content: [{ type: 'text/html', value: body }],
      categories: ['services', 'analytics'],
    },
    { headers: { Authorization: `Bearer ${getEnv('SENDGRID_API_KEY')}` } },
  );

  logger.info('Email sent successfully');
}

export { construct, send };
