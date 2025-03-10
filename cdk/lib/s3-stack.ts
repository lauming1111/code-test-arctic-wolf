import { aws_s3, aws_s3_deployment } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as cdk from 'aws-cdk-lib';
import * as path from 'path';
import * as fs from 'fs';
import { checkS3Env } from '../lambda-functions/handler/functions/check-s3-env';

export class S3Stack extends cdk.Stack {
  public readonly s3Stack: aws_s3.Bucket; // Make it public for testing

  constructor(scope: Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);
    const { sourceBucketName, fileKey, targetBucketName } = checkS3Env();

    const sourceBucket = new aws_s3.Bucket(this, 'source-bucket', {
      bucketName: sourceBucketName,
    });
    const targetBucket = new aws_s3.Bucket(this, 'target-bucket', {
      bucketName: targetBucketName,
    });
    const getJSON: string = fs.readFileSync('../describe-images.json', {
      encoding: 'utf8',
    });

    new aws_s3_deployment.BucketDeployment(this, 'deploy-file', {
      sources: [aws_s3_deployment.Source.data(process.env.S3_SOURCE_FILE_NAME!, getJSON)],
      destinationBucket: sourceBucket,
    });
  }
}
