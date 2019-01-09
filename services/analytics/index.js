import { getData } from './data';
import * as email from './email';

async function send(event, context, callback) {
  try {
    const data = await getData();
    const html = await email.construct(data);
    await email.send(html);

    callback(null, true);
  } catch (error) {
    callback(error);
  }
}

export { send };
