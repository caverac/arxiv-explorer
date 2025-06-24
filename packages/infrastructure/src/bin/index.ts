#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib'
import { z } from 'zod'

import { AuthStack } from 'lib/auth.stack'
import { DBStack } from 'lib/db.stack'
// import { ApiStack } from 'lib/api.stack'

const envSchema = z.object({
  ENVIRONMENT: z.enum(['development', 'production', 'local']),
})
const env = envSchema.parse(process.env)
if (env.ENVIRONMENT === 'local') {
  throw new Error('Cannot deploy to local environment')
}

const app = new cdk.App()

// const api = new ApiStack(app, 'ApiStack', {
//   environment: env.ENVIRONMENT,
// })

new AuthStack(app, 'ArxivExplorerAuthStack', {
  // api: api.api,
})

new DBStack(app, 'ArxivExplorerDBStack', {})
