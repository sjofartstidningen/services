/* eslint-disable no-native-reassign, strict */
'use strict';

require = require('esm')(module);
require('dotenv').config();
const Data = require('../services/analytics/data');
const Email = require('../services/analytics/email');

const [, , ...recipients] = process.argv;

async function main() {
  try {
    const data = await Data.collect();
    const html = await Email.construct(data);
    await Email.send({
      body: html,
      subject: 'Test email',
      recipients: recipients.map(email => ({ email })),
    });
  } catch (error) {
    console.error(error);
  }
}

main();
