import { createError } from '@middy/util';
import mjml2html from 'mjml';
import type { MJMLParsingOptions } from 'mjml-core';
import mjmlPkg from 'mjml/package.json';

function render(mjml: string, userConfig: MJMLParsingOptions = {}) {
  try {
    const { html, errors } = mjml2html(mjml, userConfig);
    return { html, errors, mjml, mjmlVersion: mjmlPkg.version };
  } catch (cause) {
    let error = createError(400, 'Bad mjml provided');
    error.cause = cause;
    throw error;
  }
}

export { render };
