import { IdeaService } from './idea'
import { PaperService } from './paper'
import { RDSConnection } from './rdsConnection'
import { ReferenceService } from './reference'

/**
 * Service to interact with RDS Vector database
 */
export class RDSService {
  public paper!: PaperService
  public idea!: IdeaService
  public reference!: ReferenceService

  /**
   * Initializes the RDSService with connections to various services.
   */
  constructor() {}

  /**
   * Initializes the RDSService by creating access patterns.
   * It retrieves a PostgreSQL client from the RDSConnection and initializes the services.
   * @returns {Promise<void>} A promise that resolves when the service is initialized.
   */
  public async init(): Promise<void> {
    const rds = new RDSConnection()
    const client = await rds.getClient()

    this.paper = new PaperService(client)
    this.idea = new IdeaService(client)
    this.reference = new ReferenceService(client)
  }
}
