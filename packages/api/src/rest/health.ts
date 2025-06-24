import type { Request, Response } from 'express'

/**
 * Health check endpoint to verify the server is running.
 * @param _ - The request object, not used in this handler
 * @param res The response object used to send the health status
 */
export const health = (_: Request, res: Response) => {
  res.status(200).json({ status: 'ok' })
}
