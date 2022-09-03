import express, { Request, Response } from "express";
import { body } from "express-validator"; 
import jwt from "jsonwebtoken";
import { BadRequestError, validateRequest } from "@yootick/common";

import { User } from "../model/users";
import { Password } from "../services/password";

const router = express.Router();

router.post(
  '/api/users/signin',
  [
    body('email')
      .isEmail()
      .withMessage('Email must be valid'),
    body('password')
      .trim()
      .notEmpty()
      .withMessage('You must supply a password')
  ], 
  validateRequest,
  async (req: Request, res: Response
) => {
  const { email, password }  = req.body

  const existingUser = await User.findOne({ email });
  if (!existingUser) {
    throw new BadRequestError('Invalid Credential');
  }

  if (await Password.compare(password, existingUser.password) === false) {
    throw new BadRequestError('Invalid Credential');
  }

  const userJwt = jwt.sign(
    {
      id: existingUser.id,
      email: existingUser.email
    }, 
    process.env.JWT_KEY!
  )

  // Store it on session object
  req.session = {
    jwt: userJwt
  };

  res.status(201).send(existingUser);
  
});

export { router as signinRouter };