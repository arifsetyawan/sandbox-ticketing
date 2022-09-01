import request from 'supertest';
import { app } from '../../app';

it('signout should remove cookies', async () => {
  const signup = await request(app)
    .post('/api/users/signup')
    .send({
      email: "test@test.com",
      password: "password"
    })
    .expect(201);
  
  const signout = await request(app)
    .post('/api/users/signout')
    .send({})
    .expect(200);

  expect(signout.get('Set-Cookie')[0]).toEqual('session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly')
})