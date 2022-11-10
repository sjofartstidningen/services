import { Logger } from '@aws-lambda-powertools/logger';
import middy from '@middy/core';
import { HttpError, createError } from '@middy/util';
import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
import { ZodTypeAny, z } from 'zod';

export type ZodMiddlewareEvent<Schema extends ZodTypeAny> = Omit<APIGatewayEvent, 'body'> & {
  /**
   * The body of the HTTP request.
   */
  body: z.infer<Schema>;
  rawBody: string;
};

export function zodMiddleware<Schema extends ZodTypeAny>(
  schema: Schema,
): middy.MiddlewareObj<ZodMiddlewareEvent<Schema>, APIGatewayProxyResult> {
  return {
    before(request) {
      try {
        let body = (request.event.body as string | undefined) ?? '{}';
        request.event.rawBody = body;

        let next = schema.parse(JSON.parse(body));
        request.event.body = next;
      } catch (cause) {
        const error = createError(400, 'Invalid or malformed JSON was provided');
        error.cause = cause;
        throw error;
      }
    },
  };
}

export function errorResponseMiddleware(logger: Logger): middy.MiddlewareObj<any, APIGatewayProxyResult> {
  return {
    onError(request): APIGatewayProxyResult {
      let error = request.error ?? new Error('Unknown error');
      logger.error('Error caught by error middleware', error);

      if (error != null && isHttpError(error) && error.expose) {
        return { statusCode: error.statusCode, body: JSON.stringify(error.cause) };
      }

      return { statusCode: 500, body: JSON.stringify({ success: false }) };
    },
  };
}

function isHttpError(error: Error): error is HttpError {
  return 'statusCode' in error;
}
