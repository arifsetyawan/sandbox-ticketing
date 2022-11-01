import { Publisher, Subjects, TicketCreatedEvent } from "@yootick/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}