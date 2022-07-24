import { ErrorRequestHandler } from "express";
import { ValidationError } from "sequelize";

const errorHandler: ErrorRequestHandler = (error, request, response, next) => {
  console.error(error)

  if (error instanceof ValidationError) {
    return response.status(400).json({ error: error.errors.map(err => err.message).join(', ') })
  }
  next(error)
}

export default errorHandler