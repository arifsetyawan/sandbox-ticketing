import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Tickets } from '../../models/ticket';

jest.mock('../../nats-wrapper');

describe('Test Create Ticket route', () => { 

  const path = '/api/tickets';

  it('return a 404 if the ticket is not found', async() => {
    const id = new mongoose.Types.ObjectId().toHexString();
    const response = await request(app)
      .get(path+`/${id}`)
      .set('Cookie', global.signin())
      .send();

    console.log(response.body);
  })
  
  it('return the ticket if the ticket is found', async() => {
    const title = 'concert';
    const price = 20;

    const response = await request(app)
      .post(path)
      .set('Cookie', global.signin())
      .send({
        title, price
      });

    const ticketResponse = await request(app)
    .get(path+`/${response.body.id}`)
    .set('Cookie', global.signin())
    .send()
    .expect(200);

    expect(ticketResponse.body.title).toEqual(title);
    expect(ticketResponse.body.price).toEqual(price);
  })

});