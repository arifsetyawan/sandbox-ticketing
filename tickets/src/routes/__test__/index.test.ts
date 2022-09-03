import request from 'supertest';
import { app } from '../../app';
import { Tickets } from '../../models/ticket';

describe('Test Fetch List All Ticket route', () => {

  const path = '/api/tickets';
  const createTicket = () => {
    return request(app)
       .post(path)
       .set('Cookie', global.signin())
       .send({
         title: '123',
         price: 20
       });
 }

  it('can fetch a list of tickets', async () => {
    await createTicket();
    await createTicket();
    await createTicket();

    const response = await request(app)
      .get(path)
      .send()
      .expect(200);

    expect(response.body.length).toEqual(3);
  })

})