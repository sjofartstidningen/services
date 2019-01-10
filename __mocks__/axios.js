const axios = jest.genMockFromModule('axios');

module.exports = {
  ...axios,
  get: jest.fn(),
};
