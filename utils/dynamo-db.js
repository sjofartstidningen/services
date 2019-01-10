import AWS from 'aws-sdk';
import { promisify } from 'util';

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const get = promisify(dynamoDb.get);
const put = promisify(dynamoDb.put);
const update = promisify(dynamoDb.update);

export { get, put, update };
