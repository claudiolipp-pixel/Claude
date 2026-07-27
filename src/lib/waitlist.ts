/**
 * Waitlist submission — the single seam between this front end and your
 * existing Lovable/Supabase backend.
 *
 * Right now it resolves optimistically without sending anything anywhere, so
 * the form is demonstrable but NOT yet collecting sign-ups. Replace the body
 * of `submitWaitlist` with a real call before launch. With Supabase that is:
 *
 *   import { supabase } from '@/lib/supabase';
 *   const { error } = await supabase.from('waitlist').insert(entry);
 *   return { ok: !error };
 *
 * Your table needs columns for first_name, last_name and email. Whatever the
 * target, keep the `{ ok: boolean }` shape — the form only cares about that.
 */

export interface WaitlistEntry {
  firstName: string;
  lastName: string;
  email: string;
}

export interface WaitlistResult {
  ok: boolean;
}

const SIMULATED_LATENCY_MS = 600;

export async function submitWaitlist(entry: WaitlistEntry): Promise<WaitlistResult> {
  if (import.meta.env.DEV) {
    console.info('[waitlist] stub — not persisted:', entry);
  }

  await new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));
  return { ok: true };
}
