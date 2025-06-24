import { Client } from 'pg'
import { z } from 'zod'

import { logger } from '../../util/logging'
import { fetchSecret, fetchSSMParameter } from '../../util/secret'

const MapDbEnvironmentSchema = z.discriminatedUnion('CONNECT_TO_RDS_WITH', [
  z.object({
    CONNECT_TO_RDS_WITH: z.literal('credentials'),
    RDS_USERNAME: z.string(),
    RDS_PASSWORD: z.string(),
    RDS_HOST: z.string(),
    RDS_DB_NAME: z.string(),
    RDS_PORT: z.coerce.number(),
  }),
  z.object({
    CONNECT_TO_RDS_WITH: z.literal('awsSecretName'),
    RDS_SECRET_NAME: z.string(),
  }),
])

type PgCredentials = {
  user: string
  password: string
  host: string
  port: number
  database: string
}

/**
 * RDSConnection class to manage connections to an RDS database.
 * It retrieves credentials from environment variables or AWS Secrets Manager.
 * @class
 */
export class RDSConnection {
  /**
   * Retrieves the database credentials based on the environment configuration.
   * It supports two methods: using direct credentials or fetching from AWS Secrets Manager.
   * @returns {Promise<PgCredentials>} The database credentials.
   */
  private async getCredentials(): Promise<PgCredentials> {
    const params = MapDbEnvironmentSchema.parse(process.env)

    if (params.CONNECT_TO_RDS_WITH == 'credentials') {
      return {
        user: params.RDS_USERNAME,
        password: params.RDS_PASSWORD,
        host: params.RDS_HOST,
        port: params.RDS_PORT,
        database: params.RDS_DB_NAME,
      }
    }

    if (params.CONNECT_TO_RDS_WITH == 'awsSecretName') {
      const secretName = await fetchSSMParameter(params.RDS_SECRET_NAME)
      const secretString = await fetchSecret(secretName)
      const secret = JSON.parse(secretString) as Record<string, string>
      return {
        user: secret.username,
        password: secret.password,
        host: secret.host,
        port: secret.port as unknown as number,
        database: secret.dbname,
      }
    }

    throw new Error('Unable to parse credentials')
  }

  /**
   * Creates a new PostgreSQL client and connects to the database.
   * @returns {Promise<Client>} The connected PostgreSQL client.
   */
  public async getClient(): Promise<Client> {
    const credentials = await this.getCredentials()
    const client = new Client(credentials)

    try {
      await client.connect()
    } catch (error: unknown) {
      logger.error('failed to connect to db')
      throw error
    }

    return client
  }
}
