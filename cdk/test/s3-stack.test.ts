import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { S3Stack } from '../lib/s3-stack';
import 'dotenv/config';

describe('S3Stack', () => {
  let app: cdk.App;
  let stack: S3Stack;
  let template: Template;

  beforeAll(() => {
    app = new cdk.App();
    stack = new S3Stack(app, 'S3TestStack', {
      stackName: 's3-stack',
      // env: { account: '123456789012', region: 'us-east-1' },
    });
    template = Template.fromStack(stack);
  });

  it('creates a source bucket with the specified name', () => {
    template.hasResourceProperties('AWS::S3::Bucket', {
      BucketName: process.env.S3_SOURCE_BUCKET_NAME,
    });
    template.resourceCountIs('AWS::S3::Bucket', 2); // Source + Target
  });

  it('creates a target bucket with the specified name', () => {
    template.hasResourceProperties('AWS::S3::Bucket', {
      BucketName: process.env.S3_TARGET_BUCKET_NAME,
    });
  });

  it('throws an error if S3_SOURCE_BUCKET_NAME is missing', () => {
    delete process.env.S3_SOURCE_BUCKET_NAME;
    expect(() => new S3Stack(app, 'S3FailStack', {
      stackName: 's3-stack',
    })).toThrow('S3_SOURCE_BUCKET_NAME or S3_SOURCE_FILE_NAME or S3_SOURCE_FILE_NAME do not exist');
  });
});
