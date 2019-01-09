import path from 'path';
import fs from 'fs';
import Handlebars from 'handlebars';
import mjml from 'mjml';
import { promisify } from 'util';
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

export { construct };
