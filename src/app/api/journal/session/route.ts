import { NextResponse } from "next/server";
import { z } from "zod";

import { getDailyQuestion } from "@/lib/ai/prompts";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

const createSessionSchema = z.object({
  userId: z.string().uuid().optional(),
  timezone: z.string().optional(),
});

export async function GET() {
  return NextResponse.json({
    mainQuestion: getDailyQuestion(),
    status: "ready",
  });
}

export async function POST(request: Request) {
  const body = createSessionSchema.parse(await request.json().catch(() => ({})));
  const supabase = getSupabaseAdmin();
  const mainQuestion = getDailyQuestion();

  if (!supabase || !body.userId) {
    return NextResponse.json({
      demo: true,
      session: {
        id: crypto.randomUUID(),
        user_id: body.userId ?? "demo-user",
        date: new Date().toISOString().slice(0, 10),
        status: "active",
        main_question: mainQuestion,
      },
    });
  }

  const { data, error } = await supabase
    .from("journal_sessions")
    .insert({
      user_id: body.userId,
      date: new Date().toISOString().slice(0, 10),
      status: "active",
      main_question: mainQuestion,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ session: data });
}
