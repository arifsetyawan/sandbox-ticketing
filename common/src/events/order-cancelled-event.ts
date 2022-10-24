import { Subjects } from "./subjects";

export interface OrderCancelledEvent {
  subjects: Subjects.OrderCancelled;
  data: {
    id: string;
    ticket: {
      id: string;
    }
  }
}