import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const region = process.env.AWS_REGION;
const bucket = process.env.S3_BUCKET;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

const DEFAULT_VIEW_URL_EXPIRES_IN = 3600; // 1 hour

if (!region || !bucket || !accessKeyId || !secretAccessKey) {
  throw new Error("Missing required AWS environment variables");
}

const s3Client = new S3Client({
  region: region,
  credentials: {
    accessKeyId: accessKeyId ?? "",
    secretAccessKey: secretAccessKey ?? "",
  },
});

/**
 * Uploads a file to S3 and returns the key.
 */
export const uploadFile = async (
  file: Buffer | Uint8Array,
  contentType: string,
  userId: string,
  tripId: string,
  photoId: string,
  originalFilename: string,
): Promise<string> => {
  const key = `users/${userId}/trips/${tripId}/photos/${photoId}-${originalFilename}`;

  await s3Client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      ContentType: contentType,
      Body: file,
    }),
  );
  return key;
};

/**
 * Returns a signed URL for viewing/downloading a private object
 */
export const getPresignedUrl = async (
  key: string,
  expiresIn: number = DEFAULT_VIEW_URL_EXPIRES_IN,
): Promise<string> => {
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });
  return getSignedUrl(s3Client, command, { expiresIn });
};
