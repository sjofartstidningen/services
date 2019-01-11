import winston from 'winston';
import { isDevelopmentEnv, isTestEnv, getEnv } from './env';

const payload = {};
const lambda = winston.format(info => {
  return { ...info, ...payload };
});

const errorJson = winston.format(info => {
  if (info.level === 'error' && info.error) {
    const { error } = info;
    info.error = { message: error.message || error.toString() };
  }

  return info;
});

const logger = winston.createLogger({
  level: isDevelopmentEnv ? 'debug' : 'info',
  transports: [new winston.transports.Console()],
  silent: isTestEnv,
  format: winston.format.combine(lambda(), errorJson(), winston.format.json()),
});

function wrapHandler(handler) {
  return (event, context, callback) => {
    if (event) payload.event = event;
    if (context) payload.awsRequestId = context.awsRequestId;
    payload.version = getEnv('VERSION');

    return handler(event, context, callback);
  };
}

function logPromise(message) {
  return res => {
    const msg = typeof message === 'function' ? message(res) : message;
    logger.info(msg);
    return res;
  };
}

function logException(message) {
  return error => {
    const msg = typeof message === 'function' ? message(error) : message;
    logger.error(msg, { error });
    return null;
  };
}

export { logger, wrapHandler, logPromise, logException };
