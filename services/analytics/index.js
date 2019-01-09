import * as email from './email';

async function send(event, context, callback) {
  const html = await email.construct(context);
  callback(null, html);
}

export { send };
