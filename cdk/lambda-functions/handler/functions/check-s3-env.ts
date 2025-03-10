export const checkS3Env = () => {
  const sourceBucketName = process.env.S3_SOURCE_BUCKET_NAME;
  const targetBucketName = process.env.S3_TARGET_BUCKET_NAME;
  const fileKey = process.env.S3_SOURCE_FILE_NAME;
  if (!sourceBucketName || !fileKey || !targetBucketName) throw new Error('S3_SOURCE_BUCKET_NAME or S3_SOURCE_FILE_NAME or S3_SOURCE_FILE_NAME do not exist');

  return { sourceBucketName, fileKey, targetBucketName };
};
