import { Message } from "node-nats-streaming";
import mongoose from "mongoose";
import { TicketUpdatedEvent } from "@yootick/common";
import { TicketUpdatedListener } from "../ticket-updated-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Ticket } from "../../../models/ticket";

const setup = async () => {
  // create an instance of a ticket
  const listener = new TicketUpdatedListener(natsWrapper.client);

  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 20,
  })
  await ticket.save()

  // create a fake data event
  const data: TicketUpdatedEvent["data"] = {
    id: ticket.id,
    version: ticket.version + 1,
    title: "yolo",
    price: 999,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };

  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg, ticket }
}

it('find, update and saves a ticket', async () => {
  const { listener, data, msg, ticket } = await setup();


  // call onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  // write assertions to make sure a ticket was created!
  expect(updatedTicket).toBeDefined();
  expect(updatedTicket!.title).toEqual(data.title)
  expect(updatedTicket!.price).toEqual(data.price)
});

it('acks the message', async () => {
  const { listener, data, msg } = await setup();

  // call onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // write assertions to make sure ack is called
  expect(msg.ack).toHaveBeenCalled();
});

it('does not call ack if the event has a skipped version number', async () => {
  const { listener, data, msg, ticket } = await setup();

  data.version = 100;

  try{
    // call onMessage function with the data object + message object
    await listener.onMessage(data, msg);
  } catch(err) {
    expect(err).toBeDefined();
  }

  expect(msg.ack).not.toHaveBeenCalled();
})