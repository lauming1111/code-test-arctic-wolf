export const uploadToS3 = async (s3: any, bucketName: string, key: string, body: string) => {
    await s3.putObject({
        Bucket: bucketName,
        Key: key,
        Body: body,
    }).promise();
};