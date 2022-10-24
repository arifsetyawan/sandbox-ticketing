import { Publisher, OrderCreatedEvent, Subjects } from "@yootick/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subjects: Subjects.OrderCreated = Subjects.OrderCreated;
}