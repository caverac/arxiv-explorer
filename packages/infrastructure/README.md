# Infrastructure

This directory contains the infrastructure code for the project, including Terraform configurations and scripts to set up the necessary cloud resources.

Everything is managed using AWS CDK, which allows us to define our infrastructure as code in a more flexible and maintainable way.

# Running the Infrastructure
To list the stacks in the infrastructure, you can run the following command:

```bash
yarn workspace @arxiv-explorer/infrastructure list
```

To deploy a specific stack, use the following command:

```bash
yarn workspace @arxiv-explorer/infrastructure deploy <StackName>
```