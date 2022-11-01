import { Publisher, ExpirationCompleteEvent, Subjects } from "@yootick/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete; 
}