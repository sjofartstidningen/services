import * as Data from './data';
import * as Email from './email';

async function send(event, context, callback) {
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

export { send };
