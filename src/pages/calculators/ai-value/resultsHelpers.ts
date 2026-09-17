import mascotAmbivalent from "../assets/algo-ambivalent.png";
import mascotHappy from "../assets/algo-happy.png";
import mascotSad from "../assets/algo-sad.png";
import mascotVeryHappy from "../assets/algo-veryhappy.png";
import { AI_FEATURES } from "./featureLibrary";
import type { FeatureAdoption } from "../types";
import { resolveAdoptPct } from "../types";

/** Compact number formatter: 1,234,567 -> "1.2M", matching the original fmt(). */
export function fmt(n: number | null | undefined): string {
  if (n == null || Number.isNaN(n)) return "—";
  const rounded = Math.round(n);
  if (rounded >= 1000000) return (rounded / 1000000).toFixed(1) + "M";
  if (rounded >= 1000) return (rounded / 1000).toFixed(1) + "K";
  return rounded.toLocaleString();
}

/** "£1,234" / "£1.2K", matching the original moneyShort(). */
export function moneyShort(n: number): string {
  n = Math.round(n || 0);
  if (n >= 1000000) return "£" + (n / 1000000).toFixed(2) + "M";
  if (n >= 1000) return "£" + (n / 1000).toFixed(1) + "K";
  return "£" + n.toLocaleString();
}

/** Wraps a long label into multiple lines (<= maxLen chars each) for chart axis ticks. */
export function wrapLabel(label: string, maxLen: number): string[] {
  const words = String(label).split(" ");
  const lines: string[] = [];
  let line = "";
  words.forEach((w) => {
    if ((line + " " + w).trim().length > maxLen && line) {
      lines.push(line);
      line = w;
    } else {
      line = (line + " " + w).trim();
    }
  });
  if (line) lines.push(line);
  return lines;
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
 * Mascot mood based on how many of the full feature library are already at
 * 100% adoption. Ported 1:1 from the mascot mood block in renderResults()
 * (note: thresholds/wording differ from the Data Strength Calculator's
 * average-adoption-based mood — this one counts against the total library
 * size, not just answered features).
 */
export function computeMascotMood(featureAdoption: Record<string, FeatureAdoption>): MascotMood {
  const totalFeatureCount = AI_FEATURES.length;
  const enabledCount = AI_FEATURES.filter((f) => resolveAdoptPct(featureAdoption[f.key]) === 100).length;
  const enabledRatio = totalFeatureCount ? enabledCount / totalFeatureCount : 0;

  if (enabledRatio >= 0.6) {
    return {
      image: MASCOT.veryhappy,
      line: `Your Algo is buzzing, ${enabledCount} of ${totalFeatureCount} AI ingredients are already in the bowl.`,
    };
  }
  if (enabledRatio >= 0.3) {
    return {
      image: MASCOT.happy,
      line: `Your Algo's doing well on ${enabledCount} of ${totalFeatureCount} AI ingredients, with more still to add.`,
    };
  }
  if (enabledRatio > 0) {
    return {
      image: MASCOT.ambivalent,
      line: `Your Algo has ${enabledCount} of ${totalFeatureCount} AI ingredients so far, there's a lot of opportunity left on the table.`,
    };
  }
  return {
    image: MASCOT.sad,
    line: "Your Algo hasn't been fed any AI features yet. Every opportunity below is on the table.",
  };
}
