import { get, put, update } from './dynamo-db';

const TableName = process.env.TABLE_NAME;

const getItem = id => get({ TableName, Key: { id } });

const createItem = (id, value) => put({ TableName, Item: { id, value } });

const updateItem = (id, newValue) =>
  update({
    TableName,
    Key: { id },
    ExpressionAttributeNames: { '#value': 'value' },
    ExpressionAttributeValues: { ':v': newValue },
    UpdateExpression: 'set #value = :v',
    ReturnValues: 'ALL_NEW',
  });

function preventMultipleInvokations({
  id,
  evaluate,
  create,
  onPrevented = () => ({ prevented: true }),
}) {
  return handler => async (event, context, callback) => {
    // Get the set value from the database
    const existingItem = await getItem(id).catch(() => null);

    // If value doesn't exist we just create a new one and put it in the DB
    // Before invoking the handler
    if (existingItem == null) {
      const value = await create(event, context);
      await createItem(id, value);
      return handler(event, context, callback);
    }

    // Evaluate if handler should be invoked based on item from DB
    const shouldRun = await evaluate(existingItem, event, context);

    // If handler should be invoked we update the value in the DB before
    // invoking the handler
    if (shouldRun) {
      const value = await create(event, context);
      await updateItem(id, value);
      return handler(event, context, callback);
    }

    return onPrevented();
  };
}

export { preventMultipleInvokations };
