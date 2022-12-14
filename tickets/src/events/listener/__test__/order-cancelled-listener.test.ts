import { Message } from "node-nats-streaming"
import mongoose from "mongoose"
import { OrderCancelledListener } from "../order-cancelled-listener"
import { OrderCancelledEvent, OrderStatus } from "@yootick/common"
import { Tickets } from "../../../models/ticket"
import { natsWrapper } from "../../../nats-wrapper"

const setup = async () => {
  // Create an instance of the listener
  const listener = new OrderCancelledListener(natsWrapper.client);

  const orderId = new mongoose.Types.ObjectId().toHexString()

  // Create and save a ticket
  const ticket = Tickets.build({
    title: "concert",
    price: 99,
    userId: new mongoose.Types.ObjectId().toHexString(),
  })
  ticket.set({orderId})
  await ticket.save();

  // Create the fake data event
  const data: OrderCancelledEvent["data"] = {
    id: orderId,
    version: 0,
    ticket: {
      id: ticket.id
    }
  }

  // Create a fake message object
  // @ts-ignore
  const msg:Message = {
    ack: jest.fn()
  }

  return {listener, ticket, orderId, data, msg}
}

it("update the ticket, publishes an event and acks the message", async () => {
  const {listener, ticket, data, msg, orderId} = await setup();
  await listener.onMessage(data, msg);

  const updatedTicket = await Tickets.findById(ticket.id);
  expect(updatedTicket!.orderId).not.toBeDefined();
  expect(msg.ack).toHaveBeenCalled();
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});