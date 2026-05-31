import { z } from "zod";

import { getOptionalEnv } from "@/lib/env";
import { memoryExtractionPrompt } from "@/lib/ai/prompts";

const memoryExtractionSchema = z.object({
  summary: z.string(),
  emotions: z.array(z.string()),
  people: z.array(z.string()),
  events: z.array(z.string()),
  beliefs: z.array(z.string()),
  values: z.array(z.string()),
  goals: z.array(z.string()),
  decisions: z.array(z.string()),
  behavior_patterns: z.array(z.string()),
  important_quotes: z.array(z.string()),
  memory_nodes: z.array(
    z.object({
      type: z.string(),
      title: z.string(),
      description: z.string(),
      confidence_score: z.number(),
    }),
  ),
  memory_edges: z.array(
    z.object({
      source_title: z.string(),
      target_title: z.string(),
      relationship_type: z.string(),
      evidence: z.string(),
      strength: z.number(),
    }),
  ),
  future_followup_questions: z.array(z.string()),
});

export type MemoryExtraction = z.infer<typeof memoryExtractionSchema>;

export async function extractMemories(transcript: string): Promise<MemoryExtraction> {
  const apiKey = getOptionalEnv("GEMINI_API_KEY");

  if (!apiKey) {
    return createDemoExtraction(transcript);
  }

  const model = getOptionalEnv("GEMINI_MODEL") ?? "gemini-3.1-flash-lite";
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: `${memoryExtractionPrompt}\n\nTranscript:\n${transcript}` }],
          },
        ],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.2,
        },
      }),
    },
  );

  if (!response.ok) {
    throw new Error(`Gemini extraction failed with ${response.status}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  return memoryExtractionSchema.parse(JSON.parse(text));
}

function createDemoExtraction(transcript: string): MemoryExtraction {
  const words = transcript.toLowerCase();
  const people = words.includes("student") ? ["student"] : [];
  const emotions = words.includes("happy") || words.includes("proud") ? ["happy", "proud"] : ["reflective"];

  return {
    summary: transcript
      ? `The entry centered on this thought: "${transcript.slice(0, 120)}${transcript.length > 120 ? "..." : ""}"`
      : "The user completed a brief reflective check-in.",
    emotions,
    people,
    events: words.includes("student") ? ["A student improved"] : ["Daily reflection"],
    beliefs: ["Small moments can reveal what matters."],
    values: words.includes("student") ? ["teaching", "growth", "patience"] : ["self-knowledge"],
    goals: ["Keep a consistent memory archive"],
    decisions: [],
    behavior_patterns: ["Meaning appears when the user can see progress."],
    important_quotes: transcript ? [transcript] : [],
    memory_nodes: [
      {
        type: words.includes("student") ? "value" : "story",
        title: words.includes("student") ? "Helping people improve" : "Daily reflection",
        description: words.includes("student")
          ? "The user feels meaning when another person becomes more capable."
          : "The user is building a habit of recording what mattered.",
        confidence_score: 0.74,
      },
    ],
    memory_edges: [],
    future_followup_questions: ["What would your future self need to remember about this?"],
  };
}
