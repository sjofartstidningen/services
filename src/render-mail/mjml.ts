import { BadRequest } from 'http-errors';
import mjml2html from 'mjml';
import type { MJMLParsingOptions } from 'mjml-core';
import mjmlPkg from 'mjml/package.json';

function render(mjml: string, userConfig: MJMLParsingOptions = {}) {
  try {
    const { html, errors } = mjml2html(mjml, userConfig);
    return { html, errors, mjml, mjmlVersion: mjmlPkg.version };
  } catch (error) {
    throw new BadRequest('Malformed mjml string, conversion throwed an unhandled error');
  }
}

export { render };
