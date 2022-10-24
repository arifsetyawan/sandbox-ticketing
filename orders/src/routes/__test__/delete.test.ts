import request from "supertest";
import { app } from "../../app";
import { Order, OrderStatus } from "../../models/order";
import { Ticket } from "../../models/ticket";

it('marks an order as cancelled', async () => {
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

  const {body: cancelledOrder} = await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(204);

  const updatedOrder = await Order.findById(order.id);
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)
})

it('attempt cancelled from other user order', async () => {
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

  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', userB)
    .send()
    .expect(401);
})

it.todo('emits an order cancelled event');