import * as Data from './data';
import * as Email from './email';
import { preventMultipleInvokations } from '../../utils/prevent-multiple-invokations';

async function sendHandler(event, context, callback) {
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

    return { success: true };
  } catch (error) {
    throw error;
  }
}

const send = preventMultipleInvokations({
  id: 'service-analytics',
  evaluate: () => {},
  create: () => {},
})(sendHandler);

export { send };
