import { Publisher, OrderCancelledEvent, Subjects } from "@yootick/common";

export class OrderCreatedPublisher extends Publisher<OrderCancelledEvent> {
  subjects: Subjects.OrderCancelled = Subjects.OrderCancelled;
}