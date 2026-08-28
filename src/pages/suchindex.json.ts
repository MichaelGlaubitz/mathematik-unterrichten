import type { APIRoute } from 'astro';
import { baueSuchindex } from '../lib/suchindex';

/** Statischer Suchindex, den /suche im Browser lädt und durchsucht. */
export const GET: APIRoute = async () => {
  const eintraege = await baueSuchindex();
  return new Response(JSON.stringify(eintraege), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
