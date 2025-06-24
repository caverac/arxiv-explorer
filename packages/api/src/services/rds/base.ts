import type { Client } from 'pg'

/**
 * Base RDS Service
 */
export class BaseRDSService {
  protected pgClient: Client

  /**
   * Initialize RDS class
   * @param client PG client
   */
  constructor(client: Client) {
    this.pgClient = client
  }
}
