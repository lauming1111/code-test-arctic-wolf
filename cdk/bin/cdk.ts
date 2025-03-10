#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { S3Stack } from '../lib/s3-stack';
import { LambdaStack } from '../lib/lambda-stack';
import 'dotenv/config';

const app = new cdk.App();

const deployFiles = new S3Stack(app, 's3-stack', {
  stackName: 's3-stack',
});

const deployLambda = new LambdaStack(app, 'lambda-stack', {
  stackName: 'lambda-stack',
}).addDependency(deployFiles);
