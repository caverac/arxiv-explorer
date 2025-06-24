import {
  GetSecretValueCommand,
  SecretsManagerClient,
} from '@aws-sdk/client-secrets-manager'
import { GetParameterCommand, SSMClient } from '@aws-sdk/client-ssm'

/**
 * Fetches a secret from AWS Secrets Manager
 * @param secretName - The name of the secret to fetch
 * @returns The secret value as a string
 */
export const fetchSecret = async (secretName: string): Promise<string> => {
  const client = new SecretsManagerClient({})

  const response = await client.send(
    new GetSecretValueCommand({
      SecretId: secretName,
    }),
  )

  const secret = response.SecretString as string

  return secret
}

/**
 * Fetches a parameter from AWS Systems Manager Parameter Store
 * @param parameterName - The name of the parameter to fetch
 * @returns The parameter value as a string
 */
export const fetchSSMParameter = async (
  parameterName: string,
): Promise<string> => {
  const client = new SSMClient({})

  const response = await client.send(
    new GetParameterCommand({
      Name: parameterName,
    }),
  )

  const parameter = response.Parameter?.Value as string

  return parameter
}
