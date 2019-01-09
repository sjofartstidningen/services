import * as email from './email';

async function send(event, context, callback) {
  const data = {};
  const html = await email.construct(data);
  callback(null, html);
}

export { send };
