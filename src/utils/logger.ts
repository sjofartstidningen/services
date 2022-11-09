import type { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import winston from 'winston';

import { env, getEnv } from './env';

const payload: Record<string, any> = {};
const lambda = winston.format((info) => {
  return { ...info, ...payload };
});

const errorJson = winston.format((info) => {
  if (info.level === 'error' && info.error) {
    const { error } = info;
    info.error = { message: error.message || error.toString() };
  }

  return info;
});

export const logger = winston.createLogger({
  level: env === 'development' ? 'debug' : 'info',
  transports: [new winston.transports.Console()],
  silent: env === 'test',
  format: winston.format.combine(lambda(), errorJson(), winston.format.json()),
});

export function wrapHandler(handler: APIGatewayProxyHandlerV2): APIGatewayProxyHandlerV2 {
  return (event, context, callback) => {
    if (event) payload.event = event;
    if (context) payload.awsRequestId = context.awsRequestId;
    payload.version = getEnv('VERSION');

    return handler(event, context, callback);
  };
}
