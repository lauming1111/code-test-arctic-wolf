import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

export const uploadToS3 = async (s3: S3Client, bucketName: string, key: string, body: string) => {
  await s3.send(new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: body,
  }));
};
