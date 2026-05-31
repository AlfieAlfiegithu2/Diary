import type { DailySummary, MemoryEdge, MemoryNode } from "@/types/lifebrain";

export const reflectionQuestions = [
  "What stayed on your mind today?",
  "What was the happiest moment of your day?",
  "Was there a moment today that changed your mood?",
  "What did you learn about yourself today?",
  "What should your future self remember about today?",
  "What felt heavier than you expected today?",
  "What small moment do you not want to forget?",
  "Who did you think about today, and why?",
  "What did you avoid today?",
  "What made you feel more like yourself?",
  "What did today quietly teach you?",
  "What are you carrying into tomorrow?",
  "What did you wish someone understood about your day?",
  "When did you feel calm today?",
  "What choice today says something about who you are becoming?",
  "What made you pause, even for a second?",
  "What did you need today but not say out loud?",
  "What part of today would your future self be curious about?",
];

export const followUpQuestions = [
  "Why did that feel meaningful to you?",
  "What does that say about what you care about?",
  "Does this connect to anything you have felt before?",
];

export const memoryNodes: MemoryNode[] = [
  {
    id: "n1",
    type: "value",
    title: "Teaching well",
    description: "A recurring value around helping students improve and feel capable.",
    confidenceScore: 0.88,
    x: 50,
    y: 20,
  },
  {
    id: "n2",
    type: "person",
    title: "Student progress",
    description: "Moments where a student improves have a strong emotional effect.",
    confidenceScore: 0.82,
    x: 18,
    y: 47,
  },
  {
    id: "n3",
    type: "emotion",
    title: "Quiet pride",
    description: "Happiness often appears as calm pride rather than excitement.",
    confidenceScore: 0.76,
    x: 70,
    y: 50,
  },
  {
    id: "n4",
    type: "goal",
    title: "Build patiently",
    description: "Long-term work feels better when progress is visible in small steps.",
    confidenceScore: 0.7,
    x: 41,
    y: 75,
  },
];

export const memoryEdges: MemoryEdge[] = [
  {
    id: "e1",
    sourceNodeId: "n2",
    targetNodeId: "n1",
    relationshipType: "connected_to",
    strength: 0.84,
    evidence: "The user felt happy because a student improved.",
  },
  {
    id: "e2",
    sourceNodeId: "n1",
    targetNodeId: "n3",
    relationshipType: "caused_by",
    strength: 0.72,
    evidence: "Meaning came from seeing effort turn into confidence.",
  },
  {
    id: "e3",
    sourceNodeId: "n3",
    targetNodeId: "n4",
    relationshipType: "influenced",
    strength: 0.64,
    evidence: "Small visible progress reinforced patience.",
  },
];

export const summaries: DailySummary[] = [
  {
    id: "s1",
    date: "Today",
    shortSummary: "You noticed that helping someone improve gave the day its center.",
    emotionalSummary: "Warm, grounded, quietly proud.",
    keyPeople: ["student"],
    keyValues: ["usefulness", "patience", "craft"],
    behaviorPatterns: ["You feel energized when progress is visible."],
  },
  {
    id: "s2",
    date: "Yesterday",
    shortSummary: "You felt restless about work, then calmer after writing the next step.",
    emotionalSummary: "Tense early, clearer later.",
    keyPeople: [],
    keyValues: ["clarity", "momentum"],
    behaviorPatterns: ["Writing one concrete next action reduces worry."],
  },
  {
    id: "s3",
    date: "This week",
    shortSummary: "Most entries orbit around building, teaching, and wanting evidence of progress.",
    emotionalSummary: "Focused, ambitious, occasionally overloaded.",
    keyPeople: ["student", "family"],
    keyValues: ["growth", "independence", "care"],
    behaviorPatterns: ["You return to long-term ideas when the day feels scattered."],
  },
];
