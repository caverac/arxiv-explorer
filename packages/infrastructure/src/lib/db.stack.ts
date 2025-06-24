import * as cdk from 'aws-cdk-lib'
import type * as constructs from 'constructs'

/**
 * DB stack
 */
export class DBStack extends cdk.Stack {
  private scope: constructs.Construct

  private vpc: cdk.aws_ec2.Vpc
  private securityGroup: cdk.aws_ec2.SecurityGroup

  /**
   * Creates a new DB stack.
   * @param scope The scope in which this stack is defined.
   * @param id The ID of the stack.
   * @param props The stack properties.
   */
  constructor(scope: constructs.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    this.scope = this
    const { vpc, securityGroup } = this.createVpc()
    this.vpc = vpc
    this.securityGroup = securityGroup

    // replaces createRdsInstance()
    this.createServerlessCluster()
  }

  /**
   * Creates a VPC with a public subnet and a security group for the Aurora Serverless cluster.
   * The security group allows inbound traffic on port 5432 (PostgreSQL).
   */
  private createVpc(): {
    vpc: cdk.aws_ec2.Vpc
    securityGroup: cdk.aws_ec2.SecurityGroup
  } {
    const vpc = new cdk.aws_ec2.Vpc(this.scope, 'Vpc', {
      ipAddresses: cdk.aws_ec2.IpAddresses.cidr('10.0.0.0/24'),
      maxAzs: 2,
      vpcName: 'public-vpc',
      subnetConfiguration: [
        {
          name: 'public-subnet',
          subnetType: cdk.aws_ec2.SubnetType.PUBLIC,
        },
      ],
    })

    const securityGroup = new cdk.aws_ec2.SecurityGroup(
      this.scope,
      'SecurityGroup',
      {
        description: 'public Aurora Serverless security group',
        securityGroupName: 'public-aurora-sg',
        vpc,
      },
    )
    securityGroup.addIngressRule(
      cdk.aws_ec2.Peer.anyIpv4(),
      cdk.aws_ec2.Port.tcp(5432),
    )

    return { vpc, securityGroup }
  }

  /**
   * Creates an Aurora Serverless v1 Postgres cluster.
   */
  private createServerlessCluster(): {
    cluster: cdk.aws_rds.ServerlessCluster
    credentialSecret: cdk.aws_rds.DatabaseSecret
  } {
    const credentialSecret = new cdk.aws_rds.DatabaseSecret(
      this.scope,
      'CredentialSecret',
      {
        username: 'postgres',
        secretName: '/arxiv-explorer/aurora/credentials',
      },
    )

    const cluster = new cdk.aws_rds.ServerlessCluster(
      this.scope,
      'AuroraServerlessCluster',
      {
        engine: cdk.aws_rds.DatabaseClusterEngine.auroraPostgres({
          version: cdk.aws_rds.AuroraPostgresEngineVersion.VER_17_4,
        }),
        vpc: this.vpc,
        vpcSubnets: { subnetType: cdk.aws_ec2.SubnetType.PUBLIC },
        credentials: cdk.aws_rds.Credentials.fromSecret(credentialSecret),
        defaultDatabaseName: 'arxiv-explorer',
        scaling: {
          autoPause: cdk.Duration.minutes(10),
          minCapacity: cdk.aws_rds.AuroraCapacityUnit.ACU_2,
          maxCapacity: cdk.aws_rds.AuroraCapacityUnit.ACU_16,
        },
        securityGroups: [this.securityGroup],
      },
    )

    return { cluster, credentialSecret }
  }
}
