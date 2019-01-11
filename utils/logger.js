import winston from 'winston';
import { isDevelopmentEnv, isTestEnv } from './env';

class Logger {
  constructor(props) {
    this.logger = winston.createLogger({
      level: isDevelopmentEnv ? 'debug' : 'info',
      transports: [new winston.transports.Console()],
      silent: isTestEnv,
    });

    this.payload = {};
  }

  setPayload(payload) {
    this.payload = {
      ...this.payload,
      ...payload,
    };
  }

  log(message) {
    this.logger.log({ ...message, ...this.payload });
  }

  info(message) {
    this.logger.info({ message, ...this.payload });
  }

  debug(message) {
    this.logger.debug({ message, ...this.payload });
  }

  error(message, error) {
    this.logger.error({ message, error, ...this.payload });
  }

  wrapHandler(handler) {
    return (event, context, callback) => {
      if (event) this.setPayload({ event });
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
