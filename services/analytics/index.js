import * as Env from '../../utils/env';
import * as Data from './data';
import * as Email from './email';
import analyticsConfig from '../../config/analytics.json';
import { logger } from '../../utils/logger';

logger.setLevel(Env.isProductionEnv ? 2 : 0);
const config = analyticsConfig[Env.env] || analyticsConfig.development;

const send = logger.wrapHandler(async (event, context, callback) => {
  const start = Date.now();
  logger.verbose(`Execution started in env: ${Env.env}`);

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
    logger.info(`Execution took ${Date.now() - start}ms`);
    return { success: true };
  } catch (error) {
    logger.error(error);
    throw error;
  }
});

export { send };
