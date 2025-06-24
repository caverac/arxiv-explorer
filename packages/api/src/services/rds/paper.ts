import type {
  SummarizePaperResponse,
  CreatePaperRequest,
} from '@arxiv-explorer/types/api'
import { BaseRDSService } from './base'

import { ErrorWithStatus } from '../../util/error'

/**
 * Service to interact with RDS Vector database
 */
export class PaperService extends BaseRDSService {
  /**
   * Get the summary of a paper by its ID.
   * @param params - Request parameters
   */
  public async getByCode(code: string): Promise<SummarizePaperResponse> {
    const query = `
      WITH
        idea_list AS (
          SELECT 
            paper_id,
            ARRAY_AGG(content) AS follow_up_projects
          FROM ideas
          GROUP BY paper_id
        ),
        ref_list AS (
          SELECT 
            paper_id,
            ARRAY_AGG(content) AS references
          FROM "references"
          GROUP BY paper_id
        )
      SELECT
        p.id,
        p.summary,
        il.follow_up_projects,
        rl.references
      FROM papers p
      LEFT JOIN idea_list il ON il.paper_id = p.id
      LEFT JOIN ref_list  rl ON rl.paper_id = p.id
      WHERE p.code = $1;
    `

    const result = await this.pgClient.query<SummarizePaperResponse>(query, [
      code,
    ])

    if (result.rows.length === 0) {
      throw new ErrorWithStatus(
        `Paper with code ${code} not found`,
        404,
        'PaperNotFound',
      )
    }

    return result.rows[0]
  }

  /**
   *  Create a new paper in the database.
   * @param params - Request parameters to create a new paper
   */
  public async create(params: CreatePaperRequest): Promise<number> {
    const { title, summary, embedding, code, href } = params
    const vecLiteral = '[' + embedding.join(',') + ']'

    const query = `
      INSERT INTO papers (title, summary, embedding, code, href)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id
    `

    try {
      const result = await this.pgClient.query(query, [
        title,
        summary,
        vecLiteral,
        code,
        href,
      ])
      return result.rows[0].id as number
    } catch (err) {
      throw new ErrorWithStatus(
        `Failed to create paper: ${err instanceof Error ? err.message : 'Unknown error'}`,
        500,
        'InternalServeError',
      )
    }
  }
}
