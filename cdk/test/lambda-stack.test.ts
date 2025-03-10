import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { LambdaStack } from '../lib/lambda-stack';
import { S3Stack } from '../lib/s3-stack';
import 'dotenv/config';

describe('LambdaStack', () => {
  let app: cdk.App;
  let s3Stack: S3Stack;
  let lambdaStack: LambdaStack;
  let template: Template;

  beforeAll(() => {
    app = new cdk.App();
    s3Stack = new S3Stack(app, 'S3TestStack', {
      stackName: 's3-stack',
      env: { account: '123456789012', region: 'us-east-1' },
    });
    lambdaStack = new LambdaStack(app, 'LambdaTestStack', {
      stackName: 'lambda-stack',
      env: { account: '123456789012', region: 'us-east-1' },
    });
    lambdaStack.addDependency(s3Stack); // Ensure dependency is set
    template = Template.fromStack(lambdaStack);
  });

  it('creates a Lambda function with the correct properties', () => {
    template.hasResourceProperties('AWS::Lambda::Function', {
      FunctionName: 'json-handler',
      Runtime: 'nodejs20.x',
      Timeout: 30,
      MemorySize: 256,
      Environment: {
        Variables: {
          S3_SOURCE_BUCKET_NAME: process.env.S3_SOURCE_BUCKET_NAME,
          S3_TARGET_BUCKET_NAME: process.env.S3_TARGET_BUCKET_NAME,
          S3_SOURCE_FILE_NAME: process.env.S3_SOURCE_FILE_NAME,
          LAMBDA_CUSTOM_START_DATE: process.env.LAMBDA_CUSTOM_START_DATE,
        },
      },
    });
    template.resourceCountIs('AWS::Lambda::Function', 1);
  });

  it('creates a custom IAM role with least privilege', () => {
    template.hasResourceProperties('AWS::IAM::Role', {
      RoleName: 'custom-lambda-role',
      AssumeRolePolicyDocument: {
        Statement: [{
          Action: 'sts:AssumeRole',
          Effect: 'Allow',
          Principal: { Service: 'lambda.amazonaws.com' },
        }],
      },
    });

    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 's3:GetObject',
            Effect: 'Allow',
            Resource: `arn:aws:s3:::${process.env.S3_SOURCE_BUCKET_NAME}/*`,
          },
          {
            Action: 's3:PutObject',
            Effect: 'Allow',
            Resource: `arn:aws:s3:::${process.env.S3_TARGET_BUCKET_NAME}/*`,
          },
          {
            Action: [
              'logs:CreateLogGroup',
              'logs:CreateLogStream',
              'logs:PutLogEvents',
            ],
            Effect: 'Allow',
            Resource: 'arn:aws:logs:us-east-1:123456789012:log-group:/aws/lambda/json-handler:*',
          },
        ],
      },
    });
  });
});
