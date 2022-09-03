import express, {Request, Response} from "express";
import { requireAuth, validateRequest } from "@yootick/common";
import { body } from "express-validator";
import { Tickets } from "../models/ticket";

const router = express.Router()

router.get('/api/tickets', async(req:Request, res:Response) => {
  const tickets = await Tickets.find({});

  res.send(tickets);
})

export {router as indexTicketRouter};