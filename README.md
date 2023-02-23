# Resports AWS CDK

### Deploying to AWS environment

First, clone the repository

```
git clone git@github.com:daniel-moderiano/resports-aws-cdk.git
```

Inside the root directory, install all dependencies with npm

```
npm install
```

Next, create a `.env` file and include the AWS environment identifiers. The initial CloudFormation deployment will occur in the environment specified here. We must also specify initial database parameters. To avoid exposing the password in your CDK stack, you can opt to use Secrets Manager instead of simple environment variables. You won't know the database host until post-deployment, so any placeholder can be used here.

```
AWS_ACCOUNT=accountId
AWS_REGION=region

DATABASE_PASSWORD=password
DATABASE_USER=user
DATABASE_NAME=databaseName
DATABASE_HOST=placeholder
```

We can now deploy the initial infrastructure. Note the AWS CLI profile must match that specified by the `.env` config from the previous step.

```
cdk deploy
```

With the initial infrastructure deployed, we can now update the database host environment variable, and redeploy.

```
DATABASE_HOST=databaseEndpoint

cdk deploy
```

The deployment creates a database initialiser lambda function. This should be run via CLI or AWS console using an API Gateway Proxy test event. Only run this once on intial setup as it will **fully erase the database**.

You should now have a complete infrastructure setup, including database table setup!
