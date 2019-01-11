/* eslint-disable no-native-reassign, strict */
'use strict';

require = require('esm')(module);

process.env.NODE_ENV = 'development';
require('dotenv').config();
const handler = require('../services/analytics');
const { logger } = require('../utils/logger');

async function main() {
  try {
    logger.setLevel(0);
    await handler.send();
  } catch (error) {
    console.error(error);
  }
}

main();
