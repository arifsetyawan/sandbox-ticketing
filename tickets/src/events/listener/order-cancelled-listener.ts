import { Message } from "node-nats-streaming";
import { OrderCancelledEvent, Subjects, Listener } from "@yootick/common";
import { queueGroupName } from "./queue-group-name";
import { Tickets } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publisher/ticket-updated.publisher";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
    
    // Find the ticket that the order is reserving
    const ticket = await Tickets.findById(data.ticket.id);
    if (!ticket) {
      throw new Error("Ticket not found");
    }
    ticket.set({orderId: undefined})
    
    await ticket.save();
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      price: ticket.price,
      title: ticket.title,
      userId: ticket.userId,
      version: ticket.version,
      orderId: ticket.orderId
    });

    msg.ack();
  }
}