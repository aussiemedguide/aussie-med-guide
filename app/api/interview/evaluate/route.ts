import { NextRequest, NextResponse } from "next/server";

type EvaluateBody = {
  mode?: "MMI" | "Panel";
  title?: string;
  prompt?: string;
  response?: string;
};

type Scores = {
  clarity: number;
  reasoning: number;
  empathy: number;
  structure: number;
  professionalism: number;
  overall: number;
};

function clamp(value: number, min = 1, max = 5) {
  return Math.max(min, Math.min(max, value));
}

function roundToOneDecimal(value: number) {
  return Math.round(value * 10) / 10;
}

function finaliseScore(value: number) {
  return roundToOneDecimal(clamp(value));
}

function normalise(text: string) {
  return text.replace(/\s+/g, " ").trim();
}

function splitWords(text: string) {
  return normalise(text).split(" ").filter(Boolean);
}

function countMatches(lower: string, phrases: string[]) {
  return phrases.reduce((count, phrase) => {
    return count + (lower.includes(phrase) ? 1 : 0);
  }, 0);
}

function countParagraphs(text: string) {
  return text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean).length;
}

function sentenceSplit(text: string) {
  return text
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function uniqueWordRatio(words: string[]) {
  if (!words.length) return 0;
  const unique = new Set(words.map((w) => w.toLowerCase()));
  return unique.size / words.length;
}

function hasAny(lower: string, phrases: string[]) {
  return phrases.some((phrase) => lower.includes(phrase));
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
  const text = normalise(response);
  const lower = text.toLowerCase();
  const words = splitWords(text);
  const sentences = sentenceSplit(text);
  const paragraphs = countParagraphs(response);
  const wordCount = words.length;
  const avgSentenceLength =
    sentences.length > 0 ? wordCount / sentences.length : wordCount;
  const lexicalVariety = uniqueWordRatio(words);

  const structureSignals = [
    "first",
    "firstly",
    "second",
    "secondly",
    "third",
    "thirdly",
    "finally",
    "overall",
    "in summary",
    "to conclude",
    "my approach would be",
    "i would begin by",
    "i would start by",
    "the first step",
    "the next step",
    "in this situation",
  ];

  const reasoningSignals = [
    "because",
    "therefore",
    "however",
    "although",
    "on the other hand",
    "while",
    "whereas",
    "this is important because",
    "the reason is",
    "as a result",
    "which means",
    "trade-off",
    "balance",
    "benefit",
    "risk",
    "consequence",
    "fair",
    "ethical",
    "appropriate",
    "proportionate",
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
    "concern",
    "distress",
    "listen",
    "reassure",
    "sensitive",
    "trust",
    "dignity",
  ];

  const professionalismSignals = [
    "policy",
    "confidential",
    "confidentiality",
    "safety",
    "guideline",
    "professional",
    "report",
    "supervisor",
    "escalate",
    "honest",
    "integrity",
    "duty",
    "documentation",
    "scope",
    "senior",
    "team",
    "appropriate channels",
    "best interests",
  ];

  const actionSignals = [
    "i would",
    "i'd",
    "my first step",
    "i would begin",
    "i would speak",
    "i would explain",
    "i would ask",
    "i would clarify",
    "i would involve",
    "i would escalate",
    "i would document",
    "i would check",
    "i would ensure",
  ];

  const stakeholderSignals = [
    "patient",
    "family",
    "friend",
    "staff",
    "team",
    "doctor",
    "nurse",
    "student",
    "university",
    "faculty",
    "supervisor",
    "community",
  ];

  const conclusionSignals = [
    "overall",
    "in summary",
    "to conclude",
    "ultimately",
    "in the end",
  ];

  const structureCount = countMatches(lower, structureSignals);
  const reasoningCount = countMatches(lower, reasoningSignals);
  const empathyCount = countMatches(lower, empathySignals);
  const professionalismCount = countMatches(lower, professionalismSignals);
  const actionCount = countMatches(lower, actionSignals);
  const stakeholderCount = countMatches(lower, stakeholderSignals);
  const conclusionCount = countMatches(lower, conclusionSignals);

  const hasBalancedReasoning =
    hasAny(lower, ["however", "on the other hand", "although", "while"]) &&
    hasAny(lower, ["overall", "therefore", "ultimately", "my approach would be"]);

  const hasConcretePlan =
    actionCount >= 2 &&
    hasAny(lower, ["first", "begin", "start", "next", "then", "after"]);

  const hasEmpatheticAcknowledgement =
    hasAny(lower, ["understand", "acknowledge", "respect", "listen", "concern"]) &&
    hasAny(lower, ["feel", "perspective", "distress", "family", "patient"]);

  const hasProfessionalAnchor =
    hasAny(lower, ["safety", "confidential", "integrity", "guideline", "supervisor", "escalate"]);

  const lengthQuality =
    wordCount < 35
      ? 1.4
      : wordCount < 70
        ? 2.2
        : wordCount < 120
          ? 3.1
          : wordCount < 180
            ? 4.0
            : wordCount < 280
              ? 4.5
              : 4.2;

  const concisionPenalty =
    avgSentenceLength > 38 ? 0.45 : avgSentenceLength > 32 ? 0.25 : 0;

  const repetitionPenalty =
    lexicalVariety < 0.38 ? 0.4 : lexicalVariety < 0.45 ? 0.2 : 0;

  const clarity =
    lengthQuality +
    Math.min(structureCount, 4) * 0.22 +
    (paragraphs >= 2 ? 0.2 : 0) +
    (conclusionCount > 0 ? 0.2 : 0) -
    concisionPenalty -
    repetitionPenalty;

  const reasoning =
    lengthQuality * 0.85 +
    Math.min(reasoningCount, 5) * 0.28 +
    (hasBalancedReasoning ? 0.45 : 0) +
    (stakeholderCount >= 2 ? 0.15 : 0);

  const empathy =
    lengthQuality * 0.65 +
    Math.min(empathyCount, 5) * 0.33 +
    (hasEmpatheticAcknowledgement ? 0.5 : 0) +
    (stakeholderCount >= 2 ? 0.2 : 0);

  const structure =
    lengthQuality * 0.85 +
    Math.min(structureCount, 5) * 0.3 +
    (hasConcretePlan ? 0.45 : 0) +
    (paragraphs >= 2 ? 0.2 : 0);

  const professionalism =
    lengthQuality * 0.65 +
    Math.min(professionalismCount, 5) * 0.34 +
    (hasProfessionalAnchor ? 0.5 : 0) +
    (hasAny(lower, ["honest", "respectful", "calm", "professional"]) ? 0.2 : 0);

  let modeAdjustment = 0;

  if (mode === "MMI") {
    if (hasConcretePlan) modeAdjustment += 0.1;
    if (stakeholderCount >= 2) modeAdjustment += 0.1;
  }

  if (mode === "Panel") {
    if (hasAny(lower, ["reflect", "learned", "experience", "example"])) {
      modeAdjustment += 0.12;
    }
  }

  const scores: Scores = {
    clarity: finaliseScore(clarity),
    reasoning: finaliseScore(reasoning + modeAdjustment),
    empathy: finaliseScore(empathy + modeAdjustment * 0.5),
    structure: finaliseScore(structure),
    professionalism: finaliseScore(professionalism),
    overall: 1,
  };

  scores.overall = finaliseScore(
    scores.clarity * 0.2 +
      scores.reasoning * 0.25 +
      scores.empathy * 0.18 +
      scores.structure * 0.2 +
      scores.professionalism * 0.17
  );

  const strengths: string[] = [];
  const improvements: string[] = [];

  if (scores.clarity >= 4) strengths.push("Your response is clear and easy to follow.");
  if (scores.reasoning >= 4) strengths.push("You explain your judgement with solid reasoning.");
  if (scores.empathy >= 4) strengths.push("You show strong awareness of how others may feel.");
  if (scores.structure >= 4) strengths.push("Your answer has a logical and interview-friendly structure.");
  if (scores.professionalism >= 4) strengths.push("Your tone feels professional and appropriately grounded.");

  if (scores.clarity < 3.5) {
    improvements.push("State your main position earlier so the examiner knows your direction immediately.");
  }
  if (scores.reasoning < 3.5) {
    improvements.push("Explain why your approach is appropriate, not just what you would do.");
  }
  if (scores.empathy < 3.5) {
    improvements.push("Acknowledge the emotions and perspective of the people affected more explicitly.");
  }
  if (scores.structure < 3.5) {
    improvements.push("Use a clearer sequence such as issue, action, reason, and conclusion.");
  }
  if (scores.professionalism < 3.5) {
    improvements.push("Anchor your answer more in safety, honesty, escalation, confidentiality, or professional responsibility.");
  }
  if (!hasBalancedReasoning) {
    improvements.push("Show more nuance by acknowledging competing considerations before concluding.");
  }
  if (!hasConcretePlan) {
    improvements.push("Include a more concrete step-by-step action plan.");
  }
  if (wordCount < 70) {
    improvements.push("Develop the answer further so you can demonstrate judgement in enough depth.");
  }
  if (avgSentenceLength > 32) {
    improvements.push("Shorten some sentences so the answer sounds sharper under interview pressure.");
  }

  const limitedImprovements = improvements.slice(0, 4);

  let feedback = "";

  if (scores.overall < 2.6) {
    feedback =
      "This answer shows an initial direction, but it is still underdeveloped. It needs a clearer position, stronger reasoning, and a more practical plan. Focus on making your judgement explicit, then explain the reason behind it and finish with a realistic next step.";
  } else if (scores.overall < 3.4) {
    feedback =
      "This is a reasonable foundation. You are engaging with the scenario, but the response needs more depth and sharper structure to become convincing. Push the answer further by balancing different considerations, showing empathy clearly, and ending with a practical professional action.";
  } else if (scores.overall < 4.3) {
    feedback =
      "This is a strong response. It is thoughtful, reasonably balanced, and shows a good level of maturity. To move into the top band, make the trade-offs even more explicit, tighten the structure, and make your final action especially concrete and professional.";
  } else {
    feedback =
      "This is a very strong answer. It is clear, balanced, and professionally grounded. You show solid judgement and a good awareness of stakeholders. The next step is refinement: make the answer slightly more concise and precise so it sounds polished under real interview timing.";
  }

  if (strengths.length > 0) {
    feedback += ` Strengths: ${strengths.slice(0, 2).join(" ")}`;
  }

  return {
    mode: mode || null,
    title: title || null,
    prompt: prompt || null,
    wordCount,
    scores,
    feedback,
    improvements: limitedImprovements,
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
  } catch (error) {
    console.error("Failed to evaluate response:", error);
    return NextResponse.json(
      { error: "Failed to evaluate response" },
      { status: 500 }
    );
  }
}