import { Publisher, Subjects, TicketUpdatedEvent } from "@yootick/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subjects = Subjects.TicketUpdated;
}