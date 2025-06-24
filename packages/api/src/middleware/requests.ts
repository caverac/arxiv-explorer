import type { Request, Response, NextFunction } from 'express'
import type { ZodObject, ZodRawShape } from 'zod'

/**
 * Middleware to parse and validate the request body, query, and params using Zod schema.
 * @param schema - The Zod schema to validate the request data.
 * @returns A middleware function that checks the request data against the schema.
 */
export const MiddlewareParseRequest = <T extends ZodRawShape>(
  schema: ZodObject<T>,
) => {
  return (
    request: Request<
      Record<string, unknown>,
      unknown,
      Record<string, unknown>,
      Record<string, unknown>
    >,
    response: Response,
    next: NextFunction,
  ) => {
    const results = schema.safeParse({
      ...request.params,
      ...request.query,
      ...request.body,
    })

    if (!results.success) {
      response.status(404).setHeader('Content-Type', 'application/json').json({
        error: 'Invalid request',
        message: results.error.format(),
      })
      return
    }

    next()
  }
}
