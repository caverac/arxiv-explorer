import { Router } from 'express'
import { health } from './health'
import { type Services } from '../services'
import { PaperNeighborsController } from './v1/paper'

/**
 * Initialize the API routes.
 */
export const init = (services: Services): Router => {
  const router = Router()

  router.use('/v1', [PaperNeighborsController(services)])
  router.get('/health', health)

  return router
}
