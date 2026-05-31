import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { getOptionalEnv, hasR2Config } from "@/lib/env";

let r2Client: S3Client | null = null;

function getR2Client() {
  if (!hasR2Config()) {
    return null;
  }

  if (!r2Client) {
    r2Client = new S3Client({
      region: "auto",
      endpoint: `https://${getOptionalEnv("R2_ACCOUNT_ID")}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: getOptionalEnv("R2_ACCESS_KEY_ID")!,
        secretAccessKey: getOptionalEnv("R2_SECRET_ACCESS_KEY")!,
      },
    });
  }

  return r2Client;
}

export async function createAudioUploadUrl(input: {
  userId: string;
  sessionId: string;
  contentType: string;
}) {
  const client = getR2Client();
  const bucket = getOptionalEnv("R2_BUCKET");

  if (!client || !bucket) {
    return {
      demo: true,
      key: `demo/${input.userId}/${input.sessionId}/voice.webm`,
      uploadUrl: "/api/journal/upload-url",
    };
  }

  const key = `${input.userId}/${input.sessionId}/${crypto.randomUUID()}.webm`;
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: input.contentType,
  });

  return {
    demo: false,
    key,
    uploadUrl: await getSignedUrl(client, command, { expiresIn: 60 * 5 }),
  };
}
