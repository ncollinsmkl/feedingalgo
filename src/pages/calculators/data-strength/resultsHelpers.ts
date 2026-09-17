import type { AdoptPct } from "../types";
import mascotAmbivalent from "../assets/algo-ambivalent.png";
import mascotHappy from "../assets/algo-happy.png";
import mascotSad from "../assets/algo-sad.png";
import mascotVeryHappy from "../assets/algo-veryhappy.png";

/** Compact number formatter: 1,234,567 -> "1.2M", matching the original fmt(). */
export function fmt(n: number | null | undefined): string {
  if (n == null || Number.isNaN(n)) return "—";
  const rounded = Math.round(n);
  if (rounded >= 1000000) return (rounded / 1000000).toFixed(1) + "M";
  if (rounded >= 1000) return (rounded / 1000).toFixed(1) + "K";
  return rounded.toLocaleString();
}

/** "£1,234" or "£1.2K", matching the original moneyShort(). */
export function moneyShort(n: number): string {
  return n >= 1000 ? "£" + (n / 1000).toFixed(1) + "K" : "£" + Math.round(n).toLocaleString();
}

/** "+18%" or "+18–31%", matching the original pctStr(). */
export function pctStr(min: number, max: number): string {
  if (min === max) return "+" + (min * 100).toFixed(0) + "%";
  return "+" + (min * 100).toFixed(0) + "–" + (max * 100).toFixed(0) + "%";
}

/** "+18% (10–30%)" as {avg, range} pieces, matching the original upliftStr(). */
export function upliftStr(loFrac: number, avgFrac: number, hiFrac: number): {
  avg: string;
  range: string | null;
} {
  const r = (f: number) => (f * 100).toFixed(0);
  if (loFrac === hiFrac) return { avg: "+" + r(avgFrac) + "%", range: null };
  return { avg: "+" + r(avgFrac) + "%", range: `(${r(loFrac)}–${r(hiFrac)}%)` };
}

export interface FeatureTag {
  name: string;
  val: AdoptPct | null;
}

export const MASCOT = {
  sad: mascotSad,
  ambivalent: mascotAmbivalent,
  happy: mascotHappy,
  veryhappy: mascotVeryHappy,
};

export interface MascotMood {
  image: string;
  line: string;
}

/**
 * Mascot mood based on average adoption level across all answered features.
 * Ported 1:1 from the mascot mood block in renderResults().
 */
export function computeMascotMood(features: FeatureTag[]): MascotMood {
  const answered = features.filter((f) => f.val !== null) as { name: string; val: AdoptPct }[];
  const knownCount = answered.length;
  const avgAdoption = knownCount ? answered.reduce((a, f) => a + f.val, 0) / knownCount : 0;
  const enabledRatio = avgAdoption / 100;

  if (knownCount === 0) {
    return {
      image: MASCOT.ambivalent,
      line: "Tell your Algo what's in the bowl, set each feature's adoption level in Step 1 to see how it's feeling.",
    };
  }
  if (enabledRatio >= 0.75) {
    return {
      image: MASCOT.veryhappy,
      line: `Your Algo is thriving, averaging ${Math.round(avgAdoption)}% adoption across ${knownCount} data ingredients.`,
    };
  }
  if (enabledRatio >= 0.5) {
    return {
      image: MASCOT.happy,
      line: `Your Algo's doing well, averaging ${Math.round(avgAdoption)}% adoption across ${knownCount} data ingredients.`,
    };
  }
  if (enabledRatio > 0) {
    return {
      image: MASCOT.ambivalent,
      line: `Your Algo has ${Math.round(avgAdoption)}% average adoption so far, there's a stronger bowl waiting.`,
    };
  }
  return {
    image: MASCOT.sad,
    line: "Your Algo's bowl is empty. Every feature below is an opportunity to feed it something stronger.",
  };
}
