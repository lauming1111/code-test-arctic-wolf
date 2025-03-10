import { Context, APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda';
const AWS = require("aws-sdk");
const s3 = new AWS.S3();

export const handler = async (event: any, context: Context) => {
    const bucketName = process.env.S3_BUCKET_NAME; // Replace with your S3 bucket name
    const fileKey = process.env.S3_SOURCE_FILE_NAME; // Replace with your JSON file key

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