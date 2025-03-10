import { Context } from 'aws-lambda';
import * as fs from 'fs';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { handler } from '../lambda-functions/handler';
import 'dotenv/config';

// Initialize S3 client with region from environment or default
const s3Client = new S3Client({ region: process.env.AWS_REGION || 'us-east-1' });

describe('Lambda Function Local Test', () => {
  let context: Context;
  const expectedAnswer1 = JSON.parse(fs.readFileSync('./test/answer_1.json', 'utf8'));
  const expectedAnswer2 = JSON.parse(fs.readFileSync('./test/answer_2.json', 'utf8'));
  const expectedAnswer3 = JSON.parse(fs.readFileSync('./test/answer_3.json', 'utf8'));

  it('should get JSON from S3 with null event', async () => {
    const response = await handler(null, context!);

    expect(response).not.toBeNull();
    // Uncomment to debug response
    // console.log(JSON.stringify(response));
  }, 3 * 60 * 1000);

  it('should get answer 1 JSON from S3', async () => {
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: 'answer_1.json',
    };

    const command = new GetObjectCommand(params);
    const data = await s3Client.send(command);
    const jsonData = JSON.parse(await data.Body!.transformToString('utf-8'));
    console.log(jsonData);

    expect(jsonData).toEqual(expectedAnswer1);
  }, 3 * 60 * 1000);

  it('should get answer 2 JSON from S3', async () => {
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: 'answer_2.json',
    };

    const command = new GetObjectCommand(params);
    const data = await s3Client.send(command);
    const jsonData = JSON.parse(await data.Body!.transformToString('utf-8'));
    console.log(jsonData);

    expect(jsonData).toEqual(expectedAnswer2);
  }, 3 * 60 * 1000);

  it('should get answer 3 JSON from S3', async () => {
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: 'answer_3.json',
    };

    const command = new GetObjectCommand(params);
    const data = await s3Client.send(command);
    const jsonData = JSON.parse(await data.Body!.transformToString('utf-8'));
    console.log(jsonData);

    expect(jsonData).toEqual(expectedAnswer3);
  }, 3 * 60 * 1000);
});
