import express, {Request, Response} from "express";
import { BadRequestError, NotAuthorizedError, NotFoundError, requireAuth, validateRequest } from "@yootick/common";
import { body } from "express-validator";
import { Tickets } from "../models/ticket";
import { TicketUpdatedPublisher } from "../events/publisher/ticket-updated.publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router()

router.put(
  '/api/tickets/:id', 
  requireAuth,
  [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price').isFloat({ gt: 0 }).withMessage('Price must greater than 0')
  ],
  validateRequest,
  async (req:Request, res:Response) => {
  const ticket = await Tickets.findById(req.params.id).catch((err) => {
    console.log(err);
    throw new NotFoundError()
  });
  if(!ticket) {
    throw new NotFoundError()
  }

  if(ticket.userId !== req.currentUser!.id) {
    throw new NotAuthorizedError()
  }

  try {
    ticket.set({
      title: req.body.title,
      price: req.body.price
    });
    await ticket.save();

    await new TicketUpdatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId
    })

  } catch (error) {
    throw new BadRequestError('Error Update');
  }

  res.send(ticket)
})

export {router as updateTicketRouter};