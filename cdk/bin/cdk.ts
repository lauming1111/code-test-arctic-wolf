#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CdkStack } from '../lib/cdk-stack';
import { InitS3 } from '../lib/init-s3';
import 'dotenv/config';

const app = new cdk.App();




const deployFiles = new InitS3(app, 'InitS3', {});


const deployLambda = new CdkStack(app, 'CdkStack', {}).addDependency(deployFiles);

