import { randomBytes } from 'crypto';
import nats from 'node-nats-streaming';
import { TicketCreatedPublisher } from './events/ticket-created-publisher';

console.clear();

const stan = nats.connect('ticketing', 'abc', {
  url: 'http://localhost:4222',
})

stan.on('connect', async () => {
  console.log('Publisher connected to NATS');

  const publisher = new TicketCreatedPublisher(stan);

  try{

    let id = randomBytes(4).toString('hex');

    await publisher.publish({
      id,  
      price: Math.round(Math.random() * 100),
      title: `test ${id}`,
    })
  } catch (err) {
    console.log(err);
  }

});