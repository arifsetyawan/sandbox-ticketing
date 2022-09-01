import request from 'supertest';
import { app } from '../../app';

it('returns a 201 on successful signin', async () => {
  const signup = await request(app)
    .post('/api/users/signup')
    .send({
      email: "test@test.com",
      password: "password"
    })
    .expect(201);

  const signin = await request(app)
    .post('/api/users/signin')
    .send({
      email: "test@test.com",
      password: "password"
    })
    .expect(201);

    expect(signin.get('Set-Cookie')).toBeDefined();
});

it('fails when a email that does not exist is supplied', async () => {
  await request(app)
    .post('/api/users/signin')
    .send({
      email: "test@test.com",
      password: "password"
    })
    .expect(400);
});

it('faile on incorrect password', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: "test@test.com",
      password: "password"
    })
    .expect(201);
  
  await request(app)
    .post('/api/users/signin')
    .send({
      email: "test@test.com",
      password: "usdhflshdfi"
    })
    .expect(400);
});