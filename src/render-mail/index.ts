import { Logger, injectLambdaContext } from '@aws-lambda-powertools/logger';
import middy from '@middy/core';
import { APIGatewayProxyResult } from 'aws-lambda';
import { z } from 'zod';

import { errorResponseMiddleware, zodMiddleware } from '../utils/middleware';
import * as Mjml from './mjml';

const logger = new Logger({ logLevel: process.env.NODE_ENV === 'development' ? 'DEBUG' : 'WARN' });

const schema = z.object({
  mjml: z
    .string({ required_error: 'You must pass a string of mjml markup', invalid_type_error: 'mjml must be a string' })
    .min(1, { message: 'You must pass a string of mjml markup' }),
  config: z
    .object({
      fonts: z.record(z.string()).optional(),
      validationLevel: z.enum(['strict', 'soft', 'skip']).optional(),
    })
    .optional(),
});

export const render = middy()
  .use(injectLambdaContext(logger, { logEvent: true }))
  .use(zodMiddleware(schema))
  .use(errorResponseMiddleware(logger))
  .handler(async (event): Promise<APIGatewayProxyResult> => {
    const { body } = event;

    const result = Mjml.render(body.mjml, body.config);
    return { statusCode: 200, body: JSON.stringify(result) };
  });
