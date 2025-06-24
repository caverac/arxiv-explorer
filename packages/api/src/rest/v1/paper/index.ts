import { SummarizePaperRequestSchema } from '@arxiv-explorer/types/api'
import bodyParser from 'body-parser'
import { Router } from 'express'
import { post } from './post'
import { MiddlewareParseRequest } from '../../../middleware'
import type { Services } from '../../../services'

/**
 * Controller for handling requests related to paper neighbors.
 * @param services - The services object containing the necessary service methods.
 * @returns An Express Router configured with the paper neighbors routes.
 */
export const PaperNeighborsController = (services: Services): Router => {
  const router = Router()

  const jsonBodyParser = bodyParser.json()

  router.post(
    '/paper',
    jsonBodyParser,
    MiddlewareParseRequest(SummarizePaperRequestSchema),
    post(services),
  )

  return router
}
