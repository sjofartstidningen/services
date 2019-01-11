/* eslint-disable no-native-reassign, strict */
'use strict';

require = require('esm')(module);

process.env.NODE_ENV = 'development';
process.env.VERSION = 'development';

require('dotenv').config();
const handler = require('../services/analytics');

async function main() {
  try {
    await handler.send({ id: 'test' });
  } catch (error) {
    console.error(error);
  }
}

main();
