import { Subjects } from "./subjects";

export interface TicketCreatedEvent {
  subjects: Subjects.TicketCreated;
  data: {
    id: string;
    version: number;
    title: string;
    price: number;
    userId: string;
  }
}