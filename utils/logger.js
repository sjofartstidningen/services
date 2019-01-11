import winston from 'winston';
import { isDevelopmentEnv, isTestEnv, getEnv } from './env';

class Logger {
  constructor(props) {
    this.logger = winston.createLogger({
      level: isDevelopmentEnv ? 'debug' : 'info',
      transports: [new winston.transports.Console()],
      silent: isTestEnv,
    });

    this.event = {};
    this.version = getEnv('VERSION');
    this.requestId = null;
  }

  setEvent(event) {
    this.event = event;
  }

  setRequestId(requestId) {
    this.requestId = requestId;
  }

  getPayload() {
    return {
      event: this.event,
      version: this.version,
      ...(this.requestId ? { requestId: this.requestId } : null),
    };
  }

  log(message) {
    this.logger.log({ ...message, ...this.getPayload() });
  }

  info(message) {
    this.logger.info({ message, ...this.getPayload() });
  }

  debug(message) {
    this.logger.debug({ message, ...this.getPayload() });
  }

  error(message, error) {
    this.logger.error({
      message,
      error,
      ...this.getPayload(),
    });
  }

  wrapHandler(handler) {
    return (event, context, callback) => {
      if (event) this.setEvent(event);
      if (context) this.setRequestId(context.requestId);

      return handler(event, context, callback);
    };
  }

  logPromise(message) {
    return res => {
      const msg = typeof message === 'function' ? message(res) : message;
      this.info(msg);
      return res;
    };
  }
}

const logger = new Logger();

export { logger };
