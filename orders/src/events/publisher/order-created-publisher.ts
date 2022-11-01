import { Publisher, OrderCreatedEvent, Subjects } from "@yootick/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}