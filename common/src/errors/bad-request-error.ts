import { CustomError } from "./custom-error";

export class BadRequestError extends CustomError {
  statusCode = 400;
  reason = 'something went wrong';

  constructor(public message: string) {
    super(message);
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }

  serializeError() { 
    return [
      { message: this.message }
    ]
  }
}