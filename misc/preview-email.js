/* eslint-disable no-native-reassign, strict */
'use strict';

require = require('esm')(module);
require('dotenv').config();
const http = require('http');
const { getData } = require('../services/analytics/data');
const { construct } = require('../services/analytics/email');

const server = http.createServer(async (request, response) => {
  try {
    const data = await getData();
    const html = await construct(data);
    response.end(html);
  } catch (err) {
    response.end(err.toString());
  }
});

server.listen(3000, err => {
  if (err) throw new Error(err.message);
  console.log('Server is listening on http://localhost:3000');
});
