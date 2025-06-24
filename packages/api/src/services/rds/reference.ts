import format from 'pg-format'
import { BaseRDSService } from './base'

import { ErrorWithStatus } from '../../util/error'

/**
 * Service to interact with RDS Vector database
 */
export class ReferenceService extends BaseRDSService {
  /**
   *  Create a new reference in the database.
   * @param references - Array of reference strings to be inserted
   * @param paper_id - ID of the paper to which these references belong
   * @returns {Promise<void>} A promise that resolves when the references are created
   */
  public async create(references: string[], paper_id: number): Promise<void> {
    const query = format(
      `
      INSERT INTO "references" (paper_id, content)
      VALUES %L
    `,
      references.map((reference) => [paper_id, reference]),
    )

    try {
      await this.pgClient.query(query)
    } catch (err) {
      throw new ErrorWithStatus(
        `Failed to create reference: ${err instanceof Error ? err.message : 'Unknown error'}`,
        500,
        'InternalServeError',
      )
    }
  }
}
