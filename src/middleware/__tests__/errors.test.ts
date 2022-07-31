import supertest from 'supertest';
import { app } from '../../app';

describe('middleware error handler', () => {
  it('should return 404 with a messsage when url without handler is called', async () => {
    const { statusCode, text } = await supertest(app).get('/');

    expect(statusCode).toEqual(404);
    expect(text).toEqual('THESE ARE NOT THE DROIDS YOU ARE LOOKING FOR');
  });
});
