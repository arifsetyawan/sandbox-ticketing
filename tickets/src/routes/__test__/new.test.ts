import request from 'supertest';
import { app } from '../../app';
import { Tickets } from '../../models/ticket';

describe('Test Create Ticket route', () => { 

  const path = '/api/tickets';

  it('has a route handler listening to /api/tickets for post requests', async () => {
    const response = await request(app).post(path).send({});
    expect(response.status).not.toEqual(404);  
  });
  
  it('can only be access if the user is signed in', async () => {
    await request(app).post(path).send({}).expect(401);
  });

  it('return status other than 401 if user is signed in', async () => {
    const response = await request(app)
      .post(path)
      .set('Cookie', global.signin())
      .send({});
    expect(response.status).not.toEqual(401);
  });
  
  it('returns an error if an invalid title is provided', async () => {
    await request(app)
      .post(path)
      .set('Cookie', global.signin())
      .send({
        title: '',
        price: 10
      })
      .expect(400);

    await request(app)
      .post(path)
      .set('Cookie', global.signin())
      .send({
        price: 10
      })
      .expect(400);
  });
  
  it('returns an error if an invalid price is provided', async () => {
    await request(app)
      .post(path)
      .set('Cookie', global.signin())
      .send({
        title: 'Test Ticket',
        price: -10
      })
      .expect(400);

    await request(app)
      .post(path)
      .set('Cookie', global.signin())
      .send({
        title: 'Test Ticket',
      })
      .expect(400);
  });
  
  it('create a ticket with valid inputs', async () => {
    // add in a check to make sure a ticket was saved
    let tickets = await Tickets.find({});
    expect(tickets.length).toEqual(0);
    
    let title = 'Valid Ticket'

    await request(app)
      .post(path)
      .set('Cookie', global.signin())
      .send({
        title: title,
        price: 20
      })
      .expect(201);

    tickets = await Tickets.find({});
    expect(tickets.length).toEqual(1);
    expect(tickets[0].price).toEqual(20);
    expect(tickets[0].title).toEqual(title);
  });

});