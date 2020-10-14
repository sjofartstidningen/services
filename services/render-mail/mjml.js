import mjml2html from 'mjml';
import mjmlPkg from 'mjml/package.json';
import { BadRequest } from 'http-errors';

import { getEnv } from '../../utils/env';

const render = (mjml, userConfig = {}) => {
  try {
    const config = {
      fonts: userConfig.fonts || {},
      keepComments: userConfig.keepComments || false,
      minify: userConfig.minify || getEnv('NODE_ENV', false) !== 'development',
      validationLevel: userConfig.validationLevel || 'soft',
    };

    const { html, errors } = mjml2html(mjml, config);
    return {
      html,
      errors,
      mjml,
      mjmlVersion: mjmlPkg.version,
    };
  } catch (error) {
    throw new BadRequest(
      'Malformed mjml string, conversion throwed an unhandled error',
    );
  }
};

export { render };
