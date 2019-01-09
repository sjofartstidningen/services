/* eslint-disable no-native-reassign, strict */
'use strict';

require = require('esm')(module);
const http = require('http');
const { construct } = require('../services/analytics/email');
const context = require('../test/mock-data/analytics-context.json');

const server = http.createServer(async (request, response) => {
  try {
    const html = await construct(context);
    response.end(html);
  } catch (err) {
    response.end(err.toString());
  }
});

server.listen(3000, err => {
  if (err) throw new Error(err.message);
  console.log('Server is listening on http://localhost:3000');
});
