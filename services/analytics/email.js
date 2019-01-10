import path from 'path';
import fs from 'fs';
import Handlebars from 'handlebars';
import mjml from 'mjml';
import { promisify } from 'util';
import axios from 'axios';
import * as helpers from '../../utils/handlebars-helpers';

const readFile = promisify(fs.readFile);

async function construct(data) {
  const templateSource = await readFile(
    path.join(__dirname, '../../static/email-templates/analytics.mjml'),
    'utf-8',
  );

  const hbsTemplate = Handlebars.compile(templateSource, { strict: true });
  const mjmlTemplate = hbsTemplate(data, { helpers });
  const { html } = mjml(mjmlTemplate, {
    minify: true,
    validationLevel: 'strict',
  });

  return html;
}

async function send({ body, subject, recipients }) {
  await axios.post(
    'https://api.sendgrid.com/v3/mail/send',
    {
      personalizations: recipients.map(r => ({ to: [r] })),
      from: { email: process.env.SST_EMAIL, name: process.env.SST_NAME },
      subject,
      content: [{ type: 'text/html', value: body }],
      categories: ['services', 'analytics'],
      mail_settings: {
        sandbox_mode: { enable: process.env.NODE_ENV !== 'production' },
      },
    },
    { headers: { Authorization: `Bearer ${process.env.SENDGRID_API_KEY}` } },
  );
}

export { construct, send };
