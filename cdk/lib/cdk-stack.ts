import * as cdk from 'aws-cdk-lib';
import { aws_lambda } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import path = require('path');
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { InitS3 } from './init-s3';
import { Default_Config } from '../types/interfaces';

export class CdkStack extends cdk.Stack {
  public readonly lambdaFunction: aws_lambda.Function; // Make it public for testing
  constructor(scope: Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);


    this.lambdaFunction = new NodejsFunction(this, 'MyFunction', {
      functionName: 'json-handler',
      runtime: aws_lambda.Runtime.NODEJS_20_X,
      environment: {
        S3_BUCKET_NAME: process.env.S3_BUCKET_NAME!,
        S3_SOURCE_FILE_NAME: process.env.S3_SOURCE_FILE_NAME!,
      },
      entry: path.join(__dirname, '../', 'lambda-functions', 'handler', 'index.ts'),
      handler: 'handler',
      bundling: {
        minify: true,
        bundleAwsSDK: true,
      },
      // code: aws_lambda.Code.fromAsset(path.join(__dirname,'../', 'lambda-functions', 'handler')),
    });
  }
}
