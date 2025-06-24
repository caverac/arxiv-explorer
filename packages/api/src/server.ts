import http from 'http'
import cors from 'cors'
import express, { type Express } from 'express'

import { errorHandler } from './middleware'
import * as rest from './rest'
import { initServices } from './services'
import { logger } from './util/logging'

/**
 * Creates and initializes the Express server with Socket.IO support.
 * @param port The port number on which the server will listen
 * @returns
 */
export const initServer = async (port: number): Promise<Express> => {
  const app = express()

  // http server
  const server = http.createServer(app)

  // services
  const services = await initServices()

  // middleware
  app.use(express.urlencoded({ extended: true }))
  app.use(express.json())
  app.use(
    cors({
      origin: '*',
      methods: 'GET,POST,OPTIONS',
      allowedHeaders: ['*'],
    }),
  )

  // rest routes
  const versionRouter = rest.init(services)
  app.use('/', versionRouter)

  // error handler
  app.use(errorHandler)

  // start server
  server.listen(port, () => {
    logger.info(`🚀 server is running on port ${port}`)
  })

  return app
}
