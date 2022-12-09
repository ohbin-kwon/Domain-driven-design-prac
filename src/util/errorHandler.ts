import { DriverException, UniqueConstraintViolationException } from '@mikro-orm/core';
import { NextFunction, Request, Response } from 'express-serve-static-core';
import { Exception } from './exception';

export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if(error instanceof Exception){
    res.status(error.statusCode).send({message: error.message});
    return
  }
  if(error instanceof DriverException){
    let message = 'postgres database error: ' + error.message
    let statusCode = 500
    if(error instanceof UniqueConstraintViolationException){
      message = 'unique constraint violation + ' + error.message.split('-')[1].trim()
      statusCode = 400
    }
    res.status(statusCode).send({message});
    return
  }

  res.status(500).send({message:'this error is unhandled: ' + error.message});
}
