import * as Data from './data';
import * as Email from './email';

async function send(event, context, callback) {
  try {
    const data = await Data.collect();
    const html = await Email.construct(data);
    await Email.send(html);

    callback(null, true);
  } catch (error) {
    callback(error);
  }
}

export { send };
