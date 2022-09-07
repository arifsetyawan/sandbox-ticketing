
import { Message } from 'node-nats-streaming';
import { Listener } from './base-listener';
import { Subject } from './subject';
import { TicketUpdatedEvent } from './ticket-updated-event';


export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  readonly subject = Subject.TicketUpdated;
  queueGroupName = 'payments-services';
  onMessage(data: TicketUpdatedEvent['data'], msg: Message): void {
    console.log('Event data!', data);
    msg.ack();
  }
}