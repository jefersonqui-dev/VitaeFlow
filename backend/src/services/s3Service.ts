import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

const BUCKET_NAME = process.env.AWS_BUCKET_NAME || '';
const CLOUDFRONT_DOMAIN = process.env.AWS_CLOUDFRONT_DOMAIN;

export const generatePresignedUploadUrl = async (fileType: string, folder: string = 'uploads') => {
  if (!BUCKET_NAME) throw new Error('AWS_BUCKET_NAME not defined');

  const fileExtension = fileType.split('/')[1];
  const key = `${folder}/${uuidv4()}.${fileExtension}`;

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    ContentType: fileType,
  });

  const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 }); // 5 minutes

  // If CloudFront is configured, return the CDN URL for the resource, otherwise S3 URL
  const publicUrl = CLOUDFRONT_DOMAIN 
    ? `https://${CLOUDFRONT_DOMAIN}/${key}`
    : `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

  return { uploadUrl, publicUrl, key };
};
