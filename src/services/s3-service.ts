import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { CONFIG } from "../config";

class S3Service {
  constructor() {
    this.client = new S3Client({
      region: "auto",
      endpoint: CONFIG.R2_ENDPOINT,
      forcePathStyle: true,
      credentials: {
        accessKeyId: CONFIG.R2_ACCESS_KEY,
        secretAccessKey: CONFIG.R2_SECRET_KEY,
      },
    });
  }

  private client: S3Client;

  async upload(key: string, body: any, contentType?: any, cacheControl?: any) {
    const object = new PutObjectCommand({
      Bucket: CONFIG.R2_BUCKET,
      Key: key,
      Body: body,
      ContentType: contentType,
      CacheControl: cacheControl,
    });

    await this.client.send(object);
    console.log("s3Service.upload=true");

    const url = this.getPublicUrl(key);

    return { key, url };
  }

  async getSignedUrl(key: string, expiresIn = 3600) {
    const cmd = new GetObjectCommand({ Bucket: CONFIG.R2_BUCKET, Key: key });
    return getSignedUrl(this.client, cmd, { expiresIn });
  }

  getPublicUrl(key: string) {
    return `${CONFIG.R2_PUBLIC_URL}/${encodeURI(key)}`;
  }

  async exists(key: string) {
    try {
      const object = new HeadObjectCommand({
        Bucket: CONFIG.R2_BUCKET,
        Key: key,
      });

      await this.client.send(object);

      console.log("s3Service.exists=true");
      return true;
    } catch (err) {
      console.log("s3Service.exists=false");
      return false;
    }
  }

  async delete(key: string) {
    const object = new DeleteObjectCommand({
      Bucket: CONFIG.R2_BUCKET,
      Key: key,
    });
    await this.client.send(object);
    console.log("s3Service.delete=true");
  }
}

export const s3Service = new S3Service();
