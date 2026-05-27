/**
 * Google Forms — silent submit helper.
 *
 * The site keeps its bespoke styled forms (Lead Gen + Audit Result) and
 * POSTs the answers directly to a Google Form's `formResponse` endpoint
 * in the background. The visitor never sees Google's UI; the response
 * still lands in the form's linked Google Sheet.
 *
 * Why `mode: "no-cors"` ?
 *   Google Forms does not return CORS headers, so a normal fetch would
 *   throw "blocked by CORS". no-cors tells the browser "I don't need to
 *   read the response, just send the request" — which is exactly the
 *   trade we're making. We assume success unless the underlying network
 *   call itself fails (offline, DNS, etc.).
 *
 * ════════════════════════════════════════════════════════════════════
 * 👉 EDIT GOOGLE FORM CONFIG HERE
 * ════════════════════════════════════════════════════════════════════
 * • FORM_ID         — the form's unique id (the `1FAIpQLS…` bit from
 *                     the form's published URL).
 * • FIELDS          — map of our field names → Google's `entry.XXXXX`
 *                     IDs. To find these, open the form, click the
 *                     three-dot menu → "Get pre-filled link", fill in
 *                     placeholder values, click "Get link", and copy
 *                     the `entry.XXX=...` IDs from the resulting URL.
 * Update the values below if the team ever swaps in a new form.
 * ════════════════════════════════════════════════════════════════════
 */

const FORM_ID = "1FAIpQLSf7a1aDMTnSYD-xuVuUbX3T7PexmB4zHGAhIn7gFPIYzS1GrQ";

const FORM_ENDPOINT = `https://docs.google.com/forms/d/e/${FORM_ID}/formResponse`;

/** Field name → Google Forms `entry.XXX` id. */
const FIELDS = {
  name: "entry.2007494822",
  email: "entry.524545264",
  company: "entry.24157932",
  consent: "entry.1525188593",
  collect: "entry.1821665394",
  curate: "entry.2007305558",
  combine: "entry.611220031",
  connect: "entry.464018773",
} as const;

export type CKey = "consent" | "collect" | "curate" | "combine" | "connect";

export interface FormSubmission {
  name: string;
  email: string;
  company: string;
  /** Optional — pass when submitting from the Audit Result modal. */
  scores?: Partial<Record<CKey, number>>;
}

/**
 * Silently submits the visitor's answers to the configured Google Form.
 *
 * Resolves on success (or, more precisely, on "the browser sent the
 * request without a network-layer error" — see no-cors notes above).
 * Rejects only on genuine network failure, which the caller should
 * treat as a chance to surface a friendly fallback to the user.
 */
export async function submitToGoogleForm(payload: FormSubmission): Promise<void> {
  const body = new URLSearchParams();
  body.set(FIELDS.name, payload.name);
  body.set(FIELDS.email, payload.email);
  body.set(FIELDS.company, payload.company);

  if (payload.scores) {
    for (const [c, v] of Object.entries(payload.scores)) {
      if (typeof v === "number") {
        body.set(FIELDS[c as CKey], String(v));
      }
    }
  }

  await fetch(FORM_ENDPOINT, {
    method: "POST",
    mode: "no-cors",
    body,
  });
}
