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
    this.id = null;
    this.event = null;
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
      id: this.id,
      ...(this.event ? { event: this.event } : null),
      tags: [...this.tags, ...tags],
    });
  }

  createLevel(level) {
    return message => {
      if (this.level >= levels[level]) this.log({ message, level });
    };
  }

  wrapHandler(handler) {
    return (event, context, callback) => {
      this.setId(event.id);
      this.setEvent(event);
      return handler(event, context, callback);
    };
  }
}

const logger = new Logger();

export { logger, Logger };
