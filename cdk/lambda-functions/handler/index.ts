import { Context, APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda';
import { checkDateFormat } from './functions/check-date-format';
const AWS = require("aws-sdk");
const s3 = new AWS.S3();

export const handler = async (event: any, context: Context) => {
    const bucketName = process.env.S3_BUCKET_NAME; // Replace with your S3 bucket name
    const startDate = await checkDateFormat(process.env.LAMBDA_CUSTOM_START_DATE);

    try {
        const params = {
            Bucket: bucketName,
            Key: fileKey,
        };

        // Fetch the JSON file from S3
        const data = await s3.getObject(params).promise();
        const jsonData = JSON.parse(data.Body.toString("utf-8"));

        const startDate = '2023-02-01T00:00:00.000Z';

        const start = new Date(startDate);
        const thresholdDate = new Date(start);
        thresholdDate.setDate(start.getDate() + 120);

        // Filter images where DeprecationTime is within 120 days of startDate
        const filteredImages = jsonData.Images.filter((image: any) => {
            const deprecationTime = new Date(image.DeprecationTime);
            console.log(start, thresholdDate, deprecationTime,);

            return deprecationTime <= thresholdDate && deprecationTime >= start;
        });

        console.log(jsonData.Images.length, filteredImages.length);
        console.log(filteredImages.filter((item: any) => item.Platform === 'windows').map((item: any) => item.Name));


        // return jsonContent;
        return {
            statusCode: 200,
            message: 'success'
        };
    } catch (e) {
        console.log(e);
        return {
            statusCode: 500,
            message: (e as Error).stack
        };
    }
};