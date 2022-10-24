import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";

it ("fetches the order", async () => {
  // Create a ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 20
  })
  await ticket.save();

  const user = global.signin();

  // make a request to build an order with this ticket
  const {body: order} = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ticketId: ticket.id})
    .expect(201);

  // make request to fetch the order
  const {body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(200);

  expect(fetchedOrder.id).toEqual(order.id);

})

it ("fetches the order with other user", async () => {
  // Create a ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 20
  })
  await ticket.save();

  const userA = global.signin();
  const userB = global.signin();

  // make a request to build an order with this ticket
  const {body: order} = await request(app)
    .post('/api/orders')
    .set('Cookie', userA)
    .send({ticketId: ticket.id})
    .expect(201);

  // make request to fetch the order
  const {body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', userB)
    .send()
    .expect(401);

})