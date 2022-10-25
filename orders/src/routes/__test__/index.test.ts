import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Order, OrderStatus } from '../../models/order';
import { Ticket } from '../../models/ticket';

const buildTickets = async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 20
  });
  await ticket.save();
  return ticket;
}

it('fetch orders for an particular user', async () => {
  // Create three tickets
  const ticketOne = await buildTickets();
  const ticketTwo = await buildTickets();
  const ticketThree = await buildTickets();

  const userOne = global.signin();
  const userTwo = global.signin();
  // Create one order as User #1
  const {body: orderOne} = await request(app)
    .post('/api/orders')
    .set('Cookie', userOne)
    .send({ ticketId: ticketOne.id })
    .expect(201);

  // Create two orders as User #2
  const {body: orderTwo} = await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({ ticketId: ticketTwo.id })
    .expect(201);
  
  const {body: orderThree} = await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({ ticketId: ticketThree.id })
    .expect(201);

  // Make request to get orders for User #2
  const response = await request(app)
    .get('/api/orders')
    .set('Cookie', userTwo)
    .expect(200)

  // Make sure we only got the orders for User #2
  expect(response.body.length).toEqual(2);
  expect(response.body[0]).toEqual(orderTwo)
  expect(response.body[1]).toEqual(orderThree)
})