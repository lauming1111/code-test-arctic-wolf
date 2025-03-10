import * as cdk from 'aws-cdk-lib';
import { aws_iam, aws_lambda } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import path = require('path');
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { checkS3Env } from '../lambda-functions/handler/functions/check-s3-env';

export class LambdaStack extends cdk.Stack {
  public readonly lambdaFunction: aws_lambda.Function; // Make it public for testing

  constructor(scope: Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);
    const { sourceBucketName, fileKey, targetBucketName } = checkS3Env();

    // Create a custom IAM role with least privilege
    const lambdaRole = new aws_iam.Role(this, 'LambdaExecutionRole', {
      roleName: 'custom-lambda-role',
      assumedBy: new aws_iam.ServicePrincipal('lambda.amazonaws.com'),
      description: 'Custom role for Lambda with least privilege',
    });

    // Get JSON from Source Bucket
    lambdaRole.addToPolicy(new aws_iam.PolicyStatement({
      effect: aws_iam.Effect.ALLOW,
      actions: [
        's3:GetObject',
      ],
      resources: [
        `arn:aws:s3:::${process.env.S3_SOURCE_BUCKET_NAME}/*`, // Scoped to specific bucket and all objects
      ],
    }));

    // Upload Results to Target Bucket
    lambdaRole.addToPolicy(new aws_iam.PolicyStatement({
      effect: aws_iam.Effect.ALLOW,
      actions: [
        's3:PutObject',
      ],
      resources: [
        `arn:aws:s3:::${process.env.S3_TARGET_BUCKET_NAME}/*`, // Scoped to specific bucket and all objects
      ],
    }));

    // Attach CloudWatch Logs permissions (required for Lambda execution)
    lambdaRole.addToPolicy(new aws_iam.PolicyStatement({
      effect: aws_iam.Effect.ALLOW,
      actions: [
        'logs:CreateLogGroup',
        'logs:CreateLogStream',
        'logs:PutLogEvents',
      ],
      resources: [
        `arn:aws:logs:${cdk.Stack.of(this).region}:${cdk.Stack.of(this).account}:log-group:/aws/lambda/json-handler:*`,
      ],
    }));

    this.lambdaFunction = new NodejsFunction(this, 'json-handler', {
      functionName: 'json-handler',
      runtime: aws_lambda.Runtime.NODEJS_20_X,
      timeout: cdk.Duration.seconds(30),
      memorySize: 256,
      environment: {
        S3_SOURCE_BUCKET_NAME: sourceBucketName,
        S3_TARGET_BUCKET_NAME: targetBucketName,
        S3_SOURCE_FILE_NAME: fileKey,
        LAMBDA_CUSTOM_START_DATE: process.env.LAMBDA_CUSTOM_START_DATE!,
      },
      entry: path.join(__dirname, '../', 'lambda-functions', 'handler', 'index.ts'),
      handler: 'handler',
      role: lambdaRole,
      bundling: {
        minify: true,
        bundleAwsSDK: true,
      },
      // code: aws_lambda.Code.fromAsset(path.join(__dirname,'../', 'lambda-functions', 'handler')),
    });
  }
}
