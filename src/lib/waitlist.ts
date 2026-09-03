/**
 * Waitlist submission — the seam between the form and where sign-ups land.
 *
 * Sends to the Google Apps Script web app deployed from
 * `scripts/waitlist-sheet.gs`, which appends a row to the Sheet. Point
 * VITE_WAITLIST_ENDPOINT at that deployment's URL (see .env.example and the
 * README). With the variable unset, submissions are logged and discarded, so
 * the form stays demonstrable in development without silently pretending to
 * collect anything in production.
 */

import { ATTRIBUTION, type Attribution } from '@/lib/attribution';

export interface WaitlistEntry {
  /**
   * Optional, because the compact form beside the shop asks for an address and
   * nothing else. Someone who has already been offered the shop and still
   * wants the list is doing us a favour, and a second and third field is the
   * fastest way to lose them. The Sheet gets empty cells for those, which is
   * the truth about what was asked.
   */
  firstName?: string;
  lastName?: string;
  email: string;
  lang: string;
  /** Honeypot. Hidden from people, so anything here came from a bot. */
  company?: string;
}

/**
 * What actually goes over the wire: the form fields plus where the visit came
 * from. Attribution rides along with the submission rather than being tracked
 * separately, which is what keeps it cookie-free and adblock-proof.
 */
type WaitlistPayload = WaitlistEntry & Attribution;

export interface WaitlistResult {
  ok: boolean;
}

const ENDPOINT = import.meta.env.VITE_WAITLIST_ENDPOINT as string | undefined;

export async function submitWaitlist(entry: WaitlistEntry): Promise<WaitlistResult> {
  if (!ENDPOINT) {
    console.warn('[waitlist] VITE_WAITLIST_ENDPOINT is not set, nothing was saved:', entry);
    await new Promise((resolve) => setTimeout(resolve, 400));
    return { ok: true };
  }

  try {
    const payload: WaitlistPayload = { ...entry, ...ATTRIBUTION };

    const response = await fetch(ENDPOINT, {
      method: 'POST',
      /*
       * text/plain keeps this a "simple" request. A JSON content type would
       * trigger a CORS preflight, and Apps Script web apps do not answer
       * preflights — the submission would fail before reaching the script.
       */
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
      redirect: 'follow',
    });

    if (!response.ok) return { ok: false };

    const result = (await response.json()) as WaitlistResult;
    return { ok: Boolean(result?.ok) };
  } catch (error) {
    console.error('[waitlist] submission failed:', error);
    return { ok: false };
  }
}
