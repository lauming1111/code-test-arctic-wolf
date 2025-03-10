import * as cdk from 'aws-cdk-lib';
import { aws_lambda } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import path = require('path');
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { log } from 'console';

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    console.log(path.join(__dirname, 'lambda-functions', 'handler'));

    const fn = new NodejsFunction(this, 'MyFunction', {
      runtime: aws_lambda.Runtime.NODEJS_20_X,
      entry: path.join(__dirname, '../', 'lambda-functions', 'handler', 'index.ts'),
      handler: 'handler',
      bundling: {
        bundleAwsSDK: true,
      },
      // code: aws_lambda.Code.fromAsset(path.join(__dirname,'../', 'lambda-functions', 'handler')),
    });
  }
}
