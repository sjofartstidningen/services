const DB = new Map();

module.exports = {
  get: jest.fn(params => Promise.resolve(DB.get(params.Key.id))),
  put: jest.fn(params =>
    Promise.resolve(DB.set(params.Item.id, params.Item.value)),
  ),
  update: jest.fn(params =>
    Promise.resolve(
      DB.set(params.Key.id, params.ExpressionAttributeValues[':v']),
    ),
  ),
};
