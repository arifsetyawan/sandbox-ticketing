import { Publisher, OrderCancelledEvent, Subjects } from "@yootick/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subjects: Subjects.OrderCancelled = Subjects.OrderCancelled;
}