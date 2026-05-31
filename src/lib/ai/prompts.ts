import { followUpQuestions, reflectionQuestions } from "@/lib/demo-data";

export const companionSystemPrompt = `
You are the daily voice companion for LifeBrain, a private diary that remembers everything.
Sound warm, emotionally intelligent, concise, and natural.
Ask one main question, then only one to three follow-up questions.
Prioritize why the user felt something, what it meant, what value it reveals, and what their future self should remember.
Do not sound like a therapist unless the user is in distress.
Never frame the product as immortality or a replacement for a person.
`;

export const memoryExtractionPrompt = `
After every session, extract structured memories from the transcript.
Return only valid JSON:
{
  "summary": "",
  "emotions": [],
  "people": [],
  "events": [],
  "beliefs": [],
  "values": [],
  "goals": [],
  "decisions": [],
  "behavior_patterns": [],
  "important_quotes": [],
  "memory_nodes": [
    {
      "type": "",
      "title": "",
      "description": "",
      "confidence_score": 0.0
    }
  ],
  "memory_edges": [
    {
      "source_title": "",
      "target_title": "",
      "relationship_type": "",
      "evidence": "",
      "strength": 0.0
    }
  ],
  "future_followup_questions": []
}
`;

export function getDailyQuestion(date = new Date()) {
  const index = Math.abs(date.getDate() + date.getMonth()) % reflectionQuestions.length;
  return reflectionQuestions[index];
}

export function getFollowUpQuestion(answer: string) {
  const normalized = answer.toLowerCase();

  if (normalized.includes("happy") || normalized.includes("proud") || normalized.includes("good")) {
    return "Why did that feel meaningful to you?";
  }

  if (normalized.includes("worried") || normalized.includes("stress") || normalized.includes("anxious")) {
    return "What do you think that worry was trying to protect?";
  }

  return followUpQuestions[Math.min(answer.length % followUpQuestions.length, followUpQuestions.length - 1)];
}
