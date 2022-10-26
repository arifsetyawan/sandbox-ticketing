import { Subjects } from "./subjects";

export interface OrderCancelledEvent {
  subjects: Subjects.OrderCancelled;
  data: {
    id: string;
    version: number;
    ticket: {
      id: string;
    }
  }
}