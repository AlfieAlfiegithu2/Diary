export type MemoryNodeType =
  | "person"
  | "event"
  | "belief"
  | "value"
  | "emotion"
  | "goal"
  | "decision"
  | "story"
  | "place"
  | "topic"
  | "pattern";

export type MemoryEdgeType =
  | "related_to"
  | "caused_by"
  | "influenced"
  | "loves"
  | "fears"
  | "values"
  | "changed_after"
  | "occurred_during"
  | "connected_to";

export type JournalMessage = {
  id: string;
  role: "ai" | "user";
  transcriptText: string;
  createdAt: string;
};

export type MemoryNode = {
  id: string;
  type: MemoryNodeType;
  title: string;
  description: string;
  confidenceScore: number;
  x: number;
  y: number;
};

export type MemoryEdge = {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  relationshipType: MemoryEdgeType;
  strength: number;
  evidence: string;
};

export type DailySummary = {
  id: string;
  date: string;
  shortSummary: string;
  emotionalSummary: string;
  keyPeople: string[];
  keyValues: string[];
  behaviorPatterns: string[];
};
