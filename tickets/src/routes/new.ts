import express, {Request, Response} from "express";
import { requireAuth, validateRequest } from "@yootick/common";
import { body } from "express-validator";
import { Tickets } from "../models/ticket";

const router = express.Router()

router.post(
  '/api/tickets', 
  requireAuth, 
  [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price').isFloat({ gt: 0 }).withMessage('Price must greater than 0')
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const {title, price} = req.body;

    const ticket = Tickets.build({
      title,
      price,
      userId: req.currentUser!.id
    })

    await ticket.save();

    res.status(201).send(ticket);
  }
);

export {router as createTicketRouter};