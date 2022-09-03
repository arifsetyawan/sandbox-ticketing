import express, {Request, Response} from "express";
import { BadRequestError, NotAuthorizedError, NotFoundError, requireAuth, validateRequest } from "@yootick/common";
import { body } from "express-validator";
import { Tickets } from "../models/ticket";

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
    ticket.title = req.body.title;
    ticket.price = req.body.price;

    await ticket.updateOne()
  } catch (error) {
    throw new BadRequestError('Error Update');
  }

  res.send(ticket)
})

export {router as updateTicketRouter};