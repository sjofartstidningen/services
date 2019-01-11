import { preventMultipleInvokations as pmi } from '../prevent-multiple-invokations';

jest.mock('../dynamo-db.js');

describe('Module: preventMultipleInvokations', () => {
  it("should prevent running handler if conditions aren't correct", async () => {
    const handlerFn = jest.fn(() => Promise.resolve({ handler: true }));

    const handler = pmi({
      id: 'test-handler',
      evaluate: (existingItem, event, context) => existingItem !== event.id,
      create: (event, context) => event.id,
    })(handlerFn);

    await handler({ id: 'foo' }, {});
    await handler({ id: 'foo' }, {});

    expect(handlerFn).toHaveBeenCalledTimes(1);

    await handler({ id: 'bar' });
    expect(handlerFn).toHaveBeenCalledTimes(2);
  });
});
