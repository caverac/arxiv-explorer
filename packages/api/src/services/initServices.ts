import { OpenAIService } from './oai'
import { RDSService } from './rds'

export type Services = {
  rdsService: RDSService
  openAIService: OpenAIService
}

/**
 * Initializes the services required for the application.
 * @returns A promise that resolves to an object containing initialized services.
 */
export const initServices = async (): Promise<Services> => {
  const rdsService = new RDSService()
  const openAIService = new OpenAIService()

  await rdsService.init()
  await openAIService.init()

  return {
    rdsService,
    openAIService,
  }
}
