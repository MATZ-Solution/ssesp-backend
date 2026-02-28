const AWS = require('aws-sdk');

const s3 = new AWS.S3({
  accessKeyId: process.env.s3_awsAccessKeyId,
  secretAccessKey: process.env.s3_awsSecretAccessKey,
  region: process.env.s3_region || 'eu-north-1', // ✅ explicit region
});

exports.deleteS3File = async (fileKey) => {
  if (!fileKey) return;

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME || 'iccdfreelancematzsolutionsbucket',
    Key: fileKey,
  };

  try {
    await s3.deleteObject(params).promise();
    console.log(`✅ File deleted from S3: ${fileKey}`);
  } catch (error) {
    console.error(`❌ Failed to delete file from S3: ${fileKey}`, error.message);
    throw error; // ✅ throw so the controller knows it failed
  }
};