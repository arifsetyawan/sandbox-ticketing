import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Tickets } from '../../models/ticket';
import {natsWrapper} from '../../nats-wrapper';

jest.mock('../../nats-wrapper');

describe('Updating Ticket', () => {
  const path = '/api/tickets';
  const createTicket = (cookie: string[] = []) => {
    return request(app)
       .post(path)
       .set('Cookie', cookie.length > 0 ? cookie : global.signin())
       .send({
         title: '123',
         price: 20
       })
  }

  it('return a 404 if the provided id does not exists', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    console.log(id);
    await request(app)
        .put(path+`/${id}`)
        .set('Cookie', global.signin())
        .send({
          title: '123',
          price: 20
        })
        .expect(404);
  });

  it('return a 401 if the user is not authenticated', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    const response = await request(app)
        .put(path+`/${id}`)
        .send({
          title: '123',
          price: 20
        }).expect(401);

    console.log(response.status);
  });

  it('returns a 401 if the user does not own the ticket', async () => {
    const newTicket = await createTicket();
    
    const updateTicket = await request(app)
        .put(path+`/${newTicket.body.id}`)
        .set('Cookie', global.signin())
        .send({
          title: 'AAA',
          price: 200
        }).expect(401)
  });

  it('return a 400 if the user provides an invalid title or price', async () => {
    const cookie = global.signin();
    const newTicket = await createTicket(cookie);

    await request(app)
        .put(path+`/${newTicket.body.id}`)
        .set('Cookie', cookie)
        .send({
          title: '',
          price: 200
        }).expect(400);
    
    await request(app)
      .put(path+`/${newTicket.body.id}`)
      .set('Cookie', cookie)
      .send({
        title: 'Updated Ticket',
        price: -10
      }).expect(400);

  });

  it('return a 200 if the user provides valid input', async () => {
    const cookie = global.signin();
    const newTicket = await createTicket(cookie);

    const updateResponse = await request(app)
        .put(path+`/${newTicket.body.id}`)
        .set('Cookie', cookie)
        .send({
          title: 'Something New',
          price: 129
        }).expect(200);

    expect(updateResponse.body.title).toEqual('Something New');
    expect(updateResponse.body.price).toEqual(129);
    
  });

  it('publishes an event', async () => {
    const cookie = global.signin();
    const newTicket = await createTicket(cookie);

    const updateResponse = await request(app)
        .put(path+`/${newTicket.body.id}`)
        .set('Cookie', cookie)
        .send({
          title: 'Something New',
          price: 129
        }).expect(200);
    
    expect(natsWrapper.client.publish).toHaveBeenCalled();
  })

  it('reject updates if the ticket is reserved', async () => {
    const cookie = global.signin();
    const newTicket = await createTicket(cookie);

    const ticket = await Tickets.findById(newTicket.body.id);
    ticket!.set({orderId: new mongoose.Types.ObjectId().toHexString()});
    await ticket!.save()

    const updateResponse = await request(app)
        .put(path+`/${newTicket.body.id}`)
        .set('Cookie', cookie)
        .send({
          title: 'Something New',
          price: 129
        }).expect(400);
    
  })

})