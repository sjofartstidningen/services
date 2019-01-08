import { send } from '../handler';

it('should call callback function with "success"', async () => {
  const cb = jest.fn();
  await send(null, null, cb);
  expect(cb).toHaveBeenCalledWith(null, 'success');
});
