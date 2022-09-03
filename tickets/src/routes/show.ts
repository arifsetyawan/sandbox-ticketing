import express, {Request, Response} from "express";
import { NotFoundError, requireAuth, validateRequest } from "@yootick/common";
import { body } from "express-validator";
import { Tickets } from "../models/ticket";

const router = express.Router()

router.get('/api/tickets/:id', async (req:Request, res:Response) => {
  const ticket = await Tickets.findById(req.params.id).catch((err) => {
    console.log(err);
    throw new NotFoundError();
  });
  if(!ticket) {
    throw new NotFoundError()
  }

  res.send(ticket)
})

export {router as showTicketRouter};