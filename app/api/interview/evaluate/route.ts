import { NextRequest, NextResponse } from "next/server";

type EvaluateBody = {
  mode?: "MMI" | "Panel";
  title?: string;
  prompt?: string;
  response?: string;
};

function clampScore(value: number) {
  return Math.max(1, Math.min(5, Math.round(value)));
}

function evaluateInterviewResponse({
  mode,
  title,
  prompt,
  response,
}: {
  mode?: "MMI" | "Panel";
  title?: string;
  prompt?: string;
  response: string;
}) {
  const text = response.trim();
  const words = text.split(/\s+/).filter(Boolean);
  const lower = text.toLowerCase();

  const structureSignals = [
    "first",
    "firstly",
    "second",
    "secondly",
    "finally",
    "overall",
    "in this situation",
    "my approach would be",
  ];

  const reasoningSignals = [
    "because",
    "therefore",
    "however",
    "consequence",
    "benefit",
    "risk",
    "balance",
    "ethical",
    "fair",
    "appropriate",
  ];

  const empathySignals = [
    "understand",
    "perspective",
    "support",
    "respect",
    "feel",
    "emotion",
    "empat",
    "compassion",
    "patient",
    "family",
  ];

  const professionalismSignals = [
    "policy",
    "confidential",
    "safety",
    "guideline",
    "professional",
    "report",
    "supervisor",
    "escalate",
    "honest",
    "integrity",
  ];

  const wordFactor = Math.min(5, Math.max(1, words.length / 45));

  const structureCount = structureSignals.filter((x) => lower.includes(x)).length;
  const reasoningCount = reasoningSignals.filter((x) => lower.includes(x)).length;
  const empathyCount = empathySignals.filter((x) => lower.includes(x)).length;
  const professionalismCount = professionalismSignals.filter((x) =>
    lower.includes(x)
  ).length;

  const clarity = clampScore(wordFactor + structureCount * 0.35);
  const reasoning = clampScore(wordFactor + reasoningCount * 0.35);
  const empathy = clampScore(wordFactor * 0.7 + empathyCount * 0.55);
  const structure = clampScore(wordFactor + structureCount * 0.45);
  const professionalism = clampScore(
    wordFactor * 0.7 + professionalismCount * 0.55
  );

  const overall = clampScore(
    (clarity + reasoning + empathy + structure + professionalism) / 5
  );

  let feedback = "";
  const improvements: string[] = [];

  if (words.length < 25) {
    feedback =
      "This answer is too short to show strong judgement, reasoning, or structure. You need a clearer position, a reason for that position, and a practical action you would take.";
    improvements.push("Answer in a clear 3-step structure: issue, action, reason.");
    improvements.push("Show empathy toward everyone affected.");
    improvements.push("Finish with a balanced professional conclusion.");
  } else if (overall <= 2) {
    feedback =
      "This response has a basic direction but lacks depth. The main issue is that the reasoning is not fully explained and the answer does not feel professionally structured.";
    improvements.push("State your decision early and clearly.");
    improvements.push("Explain why using ethics, fairness, safety, or professionalism.");
    improvements.push("End with a realistic next step you would actually take.");
  } else if (overall === 3) {
    feedback =
      "This is a reasonable starting answer. You show some understanding of the issue, but you need more nuance, stronger structure, and more explicit reasoning.";
    improvements.push("Acknowledge both sides before giving your conclusion.");
    improvements.push("Use clearer signposting like firstly, however, and overall.");
    improvements.push("Add more empathy and stakeholder awareness.");
  } else if (overall === 4) {
    feedback =
      "This is a strong response. It is clear and fairly balanced. To push it into the top band, add sharper nuance, mention trade-offs explicitly, and make the final action even more specific.";
    improvements.push("Name the key stakeholders directly.");
    improvements.push("Discuss at least one trade-off or tension.");
    improvements.push("Make your final action concrete and professional.");
  } else {
    feedback =
      "This is a very strong answer. It is balanced, thoughtful, and well structured. You demonstrate good judgement and communication. To refine it further, make the wording even more concise and specific.";
    improvements.push("Keep the same structure under time pressure.");
    improvements.push("Use one concrete example or principle where relevant.");
    improvements.push("Trim repetition so the answer sounds more polished.");
  }

  return {
    mode,
    title: title || null,
    prompt: prompt || null,
    wordCount: words.length,
    scores: {
      clarity,
      reasoning,
      empathy,
      structure,
      professionalism,
      overall,
    },
    feedback,
    improvements,
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as EvaluateBody;

    if (!body.response || typeof body.response !== "string") {
      return NextResponse.json(
        { error: "Missing response text" },
        { status: 400 }
      );
    }

    const result = evaluateInterviewResponse({
      mode: body.mode,
      title: body.title,
      prompt: body.prompt,
      response: body.response,
    });

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "Failed to evaluate response" },
      { status: 500 }
    );
  }
}