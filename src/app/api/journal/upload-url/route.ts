import { NextResponse } from "next/server";
import { z } from "zod";

import { createAudioUploadUrl } from "@/lib/r2";

const uploadUrlSchema = z.object({
  userId: z.string().default("demo-user"),
  sessionId: z.string().default("demo-session"),
  contentType: z.string().default("audio/webm"),
});

export async function POST(request: Request) {
  const body = uploadUrlSchema.parse(await request.json().catch(() => ({})));
  const upload = await createAudioUploadUrl(body);

  return NextResponse.json(upload);
}
