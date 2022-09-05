import { Subjects } from "./subjects";

export interface TicketUpdatedEvent {
  subjects: Subjects.TicketUpdated;
  data: {
    id: string;
    title: string;
    price: number;
    userId: string;
  }
}