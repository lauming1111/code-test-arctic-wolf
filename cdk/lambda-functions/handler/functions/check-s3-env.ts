export const checkS3Env = async () => {
    const bucketName = process.env.S3_BUCKET_NAME; // Replace with your S3 bucket name
    const fileKey = process.env.S3_SOURCE_FILE_NAME; // Replace with your JSON file key
    if (!bucketName || !fileKey) throw new Error('S3_BUCKET_NAME or S3_SOURCE_FILE_NAME not exist');

    return { bucketName, fileKey };
};