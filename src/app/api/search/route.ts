import { NextResponse } from "next/server";
import { z } from "zod";

import { memoryNodes, summaries } from "@/lib/demo-data";

const searchSchema = z.object({
  query: z.string().min(1),
});

export async function POST(request: Request) {
  const body = searchSchema.parse(await request.json());
  const normalized = body.query.toLowerCase();

  const relevantNodes = memoryNodes.filter((node) => {
    const haystack = `${node.title} ${node.description} ${node.type}`.toLowerCase();
    return normalized.split(/\s+/).some((word) => haystack.includes(word));
  });

  if (relevantNodes.length === 0) {
    return NextResponse.json({
      confidence: "low",
      answer: "I don't have enough memory about that yet.",
      references: [],
    });
  }

  return NextResponse.json({
    confidence: "medium",
    answer:
      "Your strongest stored pattern is that visible progress makes you feel grounded and proud. The current memory graph connects that feeling to teaching, patience, and building slowly.",
    references: summaries.slice(0, 2).map((summary) => ({
      date: summary.date,
      summary: summary.shortSummary,
    })),
  });
}
