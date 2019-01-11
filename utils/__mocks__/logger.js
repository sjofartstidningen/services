const { Logger } = jest.requireActual('../logger.js');

const noOp = jest.fn();

class LoggerExt extends Logger {
  log({ message, level, tags = [] } = {}) {
    noOp({
      level,
      message,
      ...(this.id ? { id: this.id } : null),
      ...(this.event ? { event: this.event } : null),
      ...(tags.length ? { tags: [...this.tags, ...tags] } : null),
    });
  }
}

const logger = new LoggerExt();

export { Logger, logger };
