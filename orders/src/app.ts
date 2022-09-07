import  express from "express";
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from "cookie-session";

import { errorHandler, NotFoundError, currentUser } from "@yootick/common";

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(cookieSession({
  signed: false,
  secure: process.env.NODE_ENV != 'test',
}))
app.use(currentUser);


app.all('*', async (res, req, next) => {
  throw new NotFoundError();
})

app.use(errorHandler);

export { app };