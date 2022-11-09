import { BadRequest } from 'http-errors';
import mjml2html from 'mjml';
import mjmlPkg from 'mjml/package.json';

const render = (mjml, userConfig = {}) => {
  try {
    const config = {
      fonts: userConfig.fonts || {},
      keepComments: userConfig.keepComments || false,
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
    throw new BadRequest('Malformed mjml string, conversion throwed an unhandled error');
  }
};

export { render };
