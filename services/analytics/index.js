import * as Env from '../../utils/env';
import * as Data from './data';
import * as Email from './email';
import analyticsConfig from '../../config/analytics.json';
import { logger, wrapHandler } from '../../utils/logger';

const config = analyticsConfig[Env.env] || analyticsConfig.development;

const send = wrapHandler(async (event, context, callback) => {
  logger.info(`Execution started in env: ${Env.env}`);

  try {
    const data = await Data.collect();
    const html = await Email.construct(data);

    await Email.send({
      body: html,
      subject: `Statistik för webb och nyhetsbrev vecka ${data.date.week} – ${
        data.date.year
      }`,
      from: config.from,
      recipients: config.recipients,
    });

    logger.info('Execution successfully finished');
    return { success: true };
  } catch (error) {
    logger.error('Execution failed', { error });
    throw error;
  }
});

export { send };
