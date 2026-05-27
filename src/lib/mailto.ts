/**
 * Builds a mailto: link with prefilled subject + body.
 *
 * TODO: replace `LEAD_RECIPIENT` with the real DAAT team mailbox before launch.
 */
export const LEAD_RECIPIENT = "team@feedingalgo.com";

export interface LeadPayload {
  name: string;
  email: string;
  company: string;
  /** Optional context — e.g. audit score band. */
  context?: string;
}

export function buildLeadMailto(p: LeadPayload, kind: "audit" | "lab") {
  const subject =
    kind === "audit"
      ? `Algo Audit result — ${p.name} (${p.company})`
      : `Algo Data StrengthInterest — ${p.name} (${p.company})`;
  const lines = [
    `Hi Algo,`,
    ``,
    `'I'd like to learn more about Strong Data and how it can help my company.`, // <-- main message
    ``,
    `My details:`,
    `Name: ${p.name}`,
    `Email: ${p.email}`,
    `Company: ${p.company}`,
  ];
  if (p.context) lines.push("", p.context);
  const body = lines.join("\n");
  return `mailto:${LEAD_RECIPIENT}?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`;
}

/**
 * Builds a "talk to us about this C" mailto from the 5 Cs modal CTAs.
 * Carries the C name into the subject + body so the DAAT team knows
 * which service the visitor is asking about.
 */
export function buildCInterestMailto(cName: string) {
  const subject = `Strong Data — interested in ${cName}`;
  const body = [
    `Hi Algo,`,
    ``,
    `I'd like to learn more about how Strong Data can help with ${cName}.`,
    ``,
    `My details:`,
    `- Name: `,
    `- Company: `,
    `- Anything specific you'd like to know first: `,
  ].join("\n");
  return `mailto:${LEAD_RECIPIENT}?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`;
}
