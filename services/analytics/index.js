import * as Data from './data';
import * as Email from './email';
import { logger } from '../../utils/logger';

logger.setLevel(2); // Info level

const send = logger.wrapHandler(async (event, context, callback) => {
  const start = Date.now();
  logger.verbose('Execution started');

  try {
    const data = await Data.collect();
    const html = await Email.construct(data);

    await Email.send({
      body: html,
      subject: `Statistik för webb och nyhetsbrev vecka ${data.date.week} – ${
        data.date.year
      }`,
      recipients: [], // TODO: Figure out how to add recipients
    });

    logger.info('Execution successfully finished');
    logger.info(`Execution took ${Date.now() - start}ms`);
    return { success: true };
  } catch (error) {
    logger.error(error);
    throw error;
  }
});

export { send };
