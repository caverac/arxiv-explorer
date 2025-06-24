# API

## Running on development environment

To run the API on a development environment, you need to set up the following environment variables:

```bash
export RDS_HOST="localhost"
export RDS_PORT="5432"
export RDS_DB_NAME="postgres"
export RDS_USERNAME="some-username"
export RDS_PASSWORD="some-password"
export RDS_DATABASE_URL="postgresql://${RDS_USERNAME}:${RDS_PASSWORD}@${RDS_HOST}:${RDS_PORT}/${RDS_DB_NAME}"

export CONNECT_TO_RDS_WITH="credentials"

```

and the run the following command:

```bash
yarn workspace @arxiv-explorer/api run:local
```
