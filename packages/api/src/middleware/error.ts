import type { Request, Response, NextFunction } from 'express'
import { logger } from '../util/logging'

/**
 * Global error handler for the API.
 * @param err - The error object containing details about the error.
 * @param req  - The request object containing details about the HTTP request.
 * @param res  - The response object used to send the HTTP response.
 * @param _next  - The next function in the middleware chain (not used here).
 */
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  logger.error({
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    params: req.params,
  })

  res
    .status(500)
    .setHeader('Content-Type', 'application/json')
    .json({ message: 'Internal Server Error', error: err.message })
}
