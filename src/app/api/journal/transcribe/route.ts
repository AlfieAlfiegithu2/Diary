import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const formData = await request.formData().catch(() => null);
  const typedTranscript = formData?.get("transcript");

  return NextResponse.json({
    provider: process.env.SPEECH_TO_TEXT_PROVIDER ?? "demo",
    transcript:
      typeof typedTranscript === "string" && typedTranscript.trim().length > 0
        ? typedTranscript
        : "I felt happy when my student improved because it made the work feel meaningful.",
  });
}
