import { NextResponse } from "next/server";
import { z } from "zod";

import { extractMemories } from "@/lib/ai/providers";

const extractionSchema = z.object({
  transcript: z.string().min(1),
});

export async function POST(request: Request) {
  const body = extractionSchema.parse(await request.json());
  const extraction = await extractMemories(body.transcript);

  return NextResponse.json(extraction);
}
