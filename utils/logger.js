import { env, getEnv } from './env';

const levels = {
  verbose: 0,
  debug: 1,
  info: 2,
  warning: 3,
  error: 4,
};

class Logger {
  constructor(level = 1) {
    this.level = level;
    this.version = getEnv('VERSION', false);
    this.id = null;
    this.event = null;
    this.env = env;
    this.tags = [];

    this.verbose = this.createLevel('verbose');
    this.debug = this.createLevel('debug');
    this.info = this.createLevel('info');
    this.warning = this.createLevel('warning');
    this.error = this.createLevel('error');
  }

  setLevel(level) {
    this.level = level;
  }

  setId(id) {
    this.id = id;
  }

  setEvent(event) {
    this.event = event;
  }

  setTag(...tags) {
    this.tags.push(...tags);
  }

  log({ message, level, tags = [] } = {}) {
    console.log({
      level,
      message,
      env: this.env,
      ...(this.version ? { version: this.version } : null),
      ...(this.id ? { id: this.id } : null),
      ...(this.event ? { event: this.event } : null),
      ...(tags.length ? { tags: [...this.tags, ...tags] } : null),
    });
  }

  createLevel(level) {
    return message => {
      if (levels[level] >= this.level) this.log({ message, level });
    };
  }

  wrapHandler(handler) {
    return (event, context, callback) => {
      if (event) {
        this.setId(event.id);
        this.setEvent(event);
      }

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

export { logger, Logger };
