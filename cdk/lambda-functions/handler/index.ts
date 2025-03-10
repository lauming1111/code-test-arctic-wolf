import { Context, APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda';
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { checkDateFormat } from './functions/check-date-format';
import { uploadToS3 } from './functions/upload-to-s3';
import { checkS3Env } from './functions/check-s3-env';

const s3Client = new S3Client({ region: process.env.AWS_REGION || 'us-east-1' });

export const handler = async (event: any, context: Context) => {
  const { bucketName, fileKey } = await checkS3Env();
  const startDate = await checkDateFormat(process.env.LAMBDA_CUSTOM_START_DATE);

  try {
    // Fetch the JSON file from S3
    const data = await s3Client.send(new GetObjectCommand({
      Bucket: bucketName,
      Key: fileKey,
    }));
    const jsonData = JSON.parse(await data.Body!.transformToString('utf-8'));

    const customStartDate = new Date(startDate);
    const thresholdDate = new Date(customStartDate);
    thresholdDate.setDate(customStartDate.getDate() + 120);

    // Filter images where DeprecationTime is within 120 days of startDate
    const filteredImages = jsonData.Images.filter((image: any) => {
      const deprecationTime = new Date(image.DeprecationTime);
      return deprecationTime <= thresholdDate && deprecationTime >= customStartDate;
    });
    const filteredWindowsImages = filteredImages.filter((item: any) => item.Platform === 'windows')
      .map((item: any) => item.Name);

    // console.log(jsonData.Images.length, filteredImages.length);
    // console.log(filteredImages);

    const sortedImages = jsonData.Images.filter((item: any) => item.Name.includes('bottlerocket-aws-k8s'))
      .sort((a: any, b: any) => {
        const dateA = new Date(a.CreationDate);
        const dateB = new Date(b.CreationDate);
        // Descending order
        return dateB.getTime() - dateA.getTime();
      })
      .map((r: any) => ({
        Name: r.Name,
        CreationDate: r.CreationDate,
      }));

    await uploadToS3(s3Client, bucketName, 'answer_1.json', JSON.stringify({ Answer: filteredImages.length }));
    await uploadToS3(s3Client, bucketName, 'answer_2.json', JSON.stringify({ Answer: filteredWindowsImages }));
    await uploadToS3(s3Client, bucketName, 'answer_3.json', JSON.stringify({ Answer: sortedImages }));

    return {
      statusCode: 200,
      message: 'success',
    };
  } catch (e) {
    console.log(e);
    return {
      statusCode: 500,
      message: (e as Error).stack,
    };
  }
};
