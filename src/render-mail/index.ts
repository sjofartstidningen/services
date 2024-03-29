import { BadRequest, HttpError } from 'http-errors';

import { createResponse } from '../utils/create-response';
import * as Env from '../utils/env';
import { logger, wrapHandler } from '../utils/logger';
import * as Mjml from './mjml';

const render = wrapHandler(async (event) => {
  logger.info(`Execution started in env: ${Env.env}`);

  try {
    const body = JSON.parse(event.body ?? '{}');
    if (body.mjml == null) {
      throw new BadRequest('Missing MJML string in json body');
    }

    if (typeof body.mjml !== 'string') {
      throw new BadRequest('mjml key is not a string');
    }

    const result = Mjml.render(body.mjml, body.config);

    logger.info(`Successfully rendered html from mjml string`);
    return createResponse(result, { cache: false });
  } catch (error) {
    let statusCode;
    let message;

    if (error instanceof HttpError && error.expose) {
      statusCode = error.statusCode;
      message = error.message;
    } else {
      statusCode = 500;
      message = 'Internal server error';
      if (Env.getEnv('NODE_ENV') !== 'production' && error instanceof Error) {
        message += `: ${error.message}`;
      }
    }

    logger.error('Failure, error response', { error });
    return createResponse(message, { statusCode, cache: false });
  }
});

export { render };
