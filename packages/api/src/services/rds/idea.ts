import format from 'pg-format'
import { BaseRDSService } from './base'

import { ErrorWithStatus } from '../../util/error'

/**
 * Service to interact with RDS Vector database
 */
export class IdeaService extends BaseRDSService {
  /**
   *  Create a new idea in the database.
   * @param params - Request parameters to create a new idea
   */
  public async create(
    follow_up_projects: string[],
    paper_id: number,
  ): Promise<void> {
    const query = format(
      `
      INSERT INTO ideas (paper_id, content)
      VALUES %L
    `,
      follow_up_projects.map((content) => [paper_id, content]),
    )

    try {
      await this.pgClient.query(query)
    } catch (err) {
      throw new ErrorWithStatus(
        `Failed to create idea: ${err instanceof Error ? err.message : 'Unknown error'}`,
        500,
        'InternalServeError',
      )
    }
  }
}
