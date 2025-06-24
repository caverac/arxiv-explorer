import * as cdk from 'aws-cdk-lib'
import type * as constructs from 'constructs'
import * as perms from 'util/permissions'

type AuthStackProps = cdk.StackProps & {
  api?: cdk.aws_apigatewayv2.WebSocketApi
}

type RoleType = 'authenticated' | 'unauthenticated' | 'admin'

/**
 * Cogito authentication stack
 */
export class AuthStack extends cdk.Stack {
  private scope: constructs.Construct
  private api?: cdk.aws_apigatewayv2.WebSocketApi

  private userPool: cdk.aws_cognito.UserPool
  private userPoolClient: cdk.aws_cognito.UserPoolClient
  private identityPool: cdk.aws_cognito.CfnIdentityPool
  private roles: Record<RoleType, cdk.aws_iam.Role>

  /**
   *
   * @param scope - cdk stack
   * @param id - stack id
   * @param props - stack props
   */
  constructor(scope: constructs.Construct, id: string, props: AuthStackProps) {
    super(scope, id, props)
    this.scope = this
    this.api = props.api

    this.userPool = this.createUserPool()
    this.userPoolClient = this.addUserPoolClient()
    this.identityPool = this.createIdentityPool()
    this.roles = this.initializeRoles()

    this.attachRoles()
    this.createAdminGroup()
    this.addApiPolicies()
  }

  /**
   * Create user pool for cognito
   * @returns user pool
   */
  private createUserPool(): cdk.aws_cognito.UserPool {
    // create pool
    const userPool = new cdk.aws_cognito.UserPool(this.scope, 'UserPool', {
      userPoolName: 'arxivexplorer__userpool',
      selfSignUpEnabled: false,
      signInAliases: { email: true },
      passwordPolicy: {
        minLength: 8,
        requireLowercase: true,
        requireUppercase: true,
        requireDigits: true,
        requireSymbols: true,
        tempPasswordValidity: cdk.Duration.days(30),
      },
      standardAttributes: {
        givenName: {
          required: true,
          mutable: false,
        },
        familyName: {
          required: true,
          mutable: false,
        },
        middleName: {
          required: false,
          mutable: false,
        },
        fullname: {
          required: true,
          mutable: true,
        },
      },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    })

    // output id
    new cdk.aws_ssm.StringParameter(this.scope, 'SSMUserPoolID', {
      parameterName: '/arxivexplorer-api/auth/user-pool-id',
      stringValue: userPool.userPoolId,
      description: 'Cognito user pool id',
    })

    return userPool
  }

  /**
   * Add user pool client
   * @returns user pool client
   */
  private addUserPoolClient(): cdk.aws_cognito.UserPoolClient {
    const userPoolClient = this.userPool.addClient('UserPoolClient', {
      userPoolClientName: 'arxivexplorer__userpool_client',
      authFlows: {
        adminUserPassword: true,
        custom: true,
        userPassword: true,
        userSrp: true,
      },
      generateSecret: false,
    })

    // output id
    new cdk.aws_ssm.StringParameter(this.scope, 'SSMUserPoolClientID', {
      parameterName: '/arxivexplorer-api/auth/user-pool-client-id',
      stringValue: userPoolClient.userPoolClientId,
      description: 'Cognito user pool client id',
    })

    return userPoolClient
  }

  /**
   * Create admin group
   */
  private createAdminGroup() {
    new cdk.aws_cognito.CfnUserPoolGroup(this.scope, 'AuthAdminGroup', {
      groupName: 'admin',
      userPoolId: this.userPool.userPoolId,
      roleArn: this.roles.admin.roleArn,
    })
  }

  /**
   * Create identity pool
   * @returns identity pool
   */
  private createIdentityPool(): cdk.aws_cognito.CfnIdentityPool {
    const identityPool = new cdk.aws_cognito.CfnIdentityPool(
      this.scope,
      'IdentityPool',
      {
        identityPoolName: 'arxivexplorer__identitypool',
        allowUnauthenticatedIdentities: true,
        cognitoIdentityProviders: [
          {
            clientId: this.userPoolClient.userPoolClientId,
            providerName: this.userPool.userPoolProviderName,
          },
        ],
      },
    )

    new cdk.aws_ssm.StringParameter(this.scope, 'SSMIdentityPoolId', {
      parameterName: '/arxivexplorer-api/auth/identity-pool-id',
      stringValue: identityPool.ref,
      description: 'Cognito identity pool id',
    })

    return identityPool
  }

  /**
   * Initialize roles for cognito identity pool
   * @returns roles
   */
  private initializeRoles() {
    const authenticatedRole = new cdk.aws_iam.Role(
      this.scope,
      'CognitoDefaultAuthenticatedRole',
      {
        roleName: 'arxivexplorer__cognito_default_authenticated_role',
        assumedBy: new cdk.aws_iam.FederatedPrincipal(
          'cognito-identity.amazonaws.com',
          {
            // eslint-disable-next-line quote-props
            StringEquals: {
              'cognito-identity.amazonaws.com:aud': this.identityPool.ref,
            },
            'ForAnyValue:StringLike': {
              'cognito-identity.amazonaws.com:amr': 'authenticated',
            },
          },
          'sts:AssumeRoleWithWebIdentity',
        ),
      },
    )

    const unAuthenticatedRole = new cdk.aws_iam.Role(
      this.scope,
      'CognitoDefaultUnAuthenticatedRole',
      {
        roleName: 'arxivexplorer__cognito_default_unauthenticated_role',
        assumedBy: new cdk.aws_iam.FederatedPrincipal(
          'cognito-identity.amazonaws.com',
          {
            // eslint-disable-next-line quote-props
            StringEquals: {
              'cognito-identity.amazonaws.com:aud': this.identityPool.ref,
            },
            'ForAnyValue:StringLike': {
              'cognito-identity.amazonaws.com:amr': 'unauthenticated',
            },
          },
          'sts:AssumeRoleWithWebIdentity',
        ),
      },
    )

    const adminRole = new cdk.aws_iam.Role(
      this.scope,
      'CognitoAdminAuthenticatedRole',
      {
        roleName: 'arxivexplorer_cognito_admin_authenticated_role',
        assumedBy: new cdk.aws_iam.FederatedPrincipal(
          'cognito-identity.amazonaws.com',
          {
            // eslint-disable-next-line quote-props
            StringEquals: {
              'cognito-identity.amazonaws.com:aud': this.identityPool.ref,
            },
            'ForAnyValue:StringLike': {
              'cognito-identity.amazonaws.com:amr': 'authenticated',
            },
          },
          'sts:AssumeRoleWithWebIdentity',
        ),
      },
    )

    return {
      authenticated: authenticatedRole,
      unauthenticated: unAuthenticatedRole,
      admin: adminRole,
    }
  }

  /**
   * Create policy for api
   * @param role - role type
   * @param namespace - api namespace
   */
  private apiPolicy(role: cdk.aws_iam.Role, namespace: string) {
    if (this.api) {
      role.addToPolicy(
        new cdk.aws_iam.PolicyStatement({
          effect: cdk.aws_iam.Effect.ALLOW,
          actions: perms.API_INVOKE,
          resources: [
            `arn:aws:execute-api:${this.region}:${this.account}:${this.api.apiId}/${namespace}`,
          ],
        }),
      )
    }
  }

  /**
   * Attach roles to identity pool
   */
  private attachRoles() {
    new cdk.aws_cognito.CfnIdentityPoolRoleAttachment(
      this.scope,
      'RolesAttachment',
      {
        identityPoolId: this.identityPool.ref,
        roles: {
          authenticated: this.roles.authenticated.roleArn,
          unauthenticated: this.roles.unauthenticated.roleArn,
        },
        roleMappings: {
          adminMapping: {
            type: 'Token',
            ambiguousRoleResolution: 'AuthenticatedRole',
            identityProvider: `${this.userPool.userPoolProviderName}:${this.userPoolClient.userPoolClientId}`,
          },
        },
      },
    )
  }

  /**
   * Add api policies
   */
  private addApiPolicies() {
    this.apiPolicy(this.roles.admin, '*')

    // === [ authenticated ]===
    // can access the summary namespace
    this.apiPolicy(this.roles.authenticated, 'summary')

    // === [ unauthenticated ]===
    // can access the public namespace
    this.apiPolicy(this.roles.unauthenticated, 'public')
  }
}
