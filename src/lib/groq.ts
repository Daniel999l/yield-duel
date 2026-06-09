import type { AgentDecision, MarketSignal } from "./types";

const GROQ_MODEL = process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile";

export async function enrichAgentReasoning(
  decision: AgentDecision,
  signals: MarketSignal[]
): Promise<string[]> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return decision.reasoning;

  try {
    const prompt = `You are TreasuryClaw, an RWA treasury agent on Mantle.
Given allocation USDY ${decision.allocation.USDY}%, mETH ${decision.allocation.METH}%, MNT ${decision.allocation.MNT}%,
market signals: ${JSON.stringify(signals)},
write exactly 3 short bullet reasons (one sentence each, no em dashes, plain English).`;

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          { role: "system", content: "Respond with JSON: { \"reasons\": string[] }" },
          { role: "user", content: prompt },
        ],
        temperature: 0.4,
        response_format: { type: "json_object" },
      }),
    });

    if (!res.ok) return decision.reasoning;

    const json = await res.json();
    const content = json.choices?.[0]?.message?.content;
    if (!content) return decision.reasoning;

    const parsed = JSON.parse(content) as { reasons?: string[] };
    if (parsed.reasons?.length) return parsed.reasons.slice(0, 4);
    return decision.reasoning;
  } catch {
    return decision.reasoning;
  }
}