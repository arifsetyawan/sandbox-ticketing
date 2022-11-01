import { Listener, ExpirationCompleteEvent, Subjects } from "@yootick/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Order, OrderStatus } from "../../models/order";
import { OrderCancelledPublisher } from "../publisher/order-cancelled-publisher";
import { Ticket } from "../../models/ticket";

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
  queueGroupName = queueGroupName;

  async onMessage(data: ExpirationCompleteEvent["data"], msg: Message) {
    const order = await Order.findById(data.orderId).populate('ticket');
    if (!order) {
      throw new Error('Order not found');
    }

    if (order.status === OrderStatus.AwaitingPayment || order.status === OrderStatus.Created) {
      order.set({
        status: OrderStatus.Cancelled
      })
      await order.save();

      await new OrderCancelledPublisher(this.client).publish({
        id: order.id,
        version: order.version,
        ticket: {
          id: order.ticket.id
        }
      });
    }

    msg.ack();
  }
}