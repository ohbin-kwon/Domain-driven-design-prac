export class Exception extends Error {
  constructor(message: string, public statusCode: number = 500){
    super(message)
    this.statusCode = statusCode
    if(this.stack === undefined){
      Error.captureStackTrace(this, this.constructor)
    }
  }
}