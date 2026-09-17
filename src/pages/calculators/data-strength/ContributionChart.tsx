import { useEffect, useRef } from "react";
import { Chart, type TooltipItem } from "chart.js/auto";
import type { FeatureContribution } from "./engine";
import styles from "./DataStrengthCalculator.module.css";

interface ContributionChartProps {
  sessionFeatures: FeatureContribution[];
  convFeatures: FeatureContribution[];
  sessions: number;
  conversions: number;
}

interface ContribRow {
  label: string;
  minVal: number;
  rangeVal: number;
  color: string;
  unit: string;
}

/**
 * Horizontal stacked bar showing each feature's low->high contribution as a
 * % of sessions or conversions. Mirrors Chart 3 (#chartContrib) from the
 * original renderResults().
 */
export default function ContributionChart({
  sessionFeatures,
  convFeatures,
  sessions,
  conversions,
}: ContributionChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  const allFeatures: ContribRow[] = [
    ...sessionFeatures.map((f) => ({
      label: f.label + " (sessions)",
      minVal: (f.lo / (sessions || 1)) * 100,
      rangeVal: ((f.hi - f.lo) / (sessions || 1)) * 100,
      color: f.color,
      unit: "% of sessions",
    })),
    ...convFeatures.map((f) => ({
      label: f.label + " (conversions)",
      minVal: (f.lo / (conversions || 1)) * 100,
      rangeVal: ((f.hi - f.lo) / (conversions || 1)) * 100,
      color: f.color,
      unit: "% of conversions",
    })),
  ];

  useEffect(() => {
    if (allFeatures.length === 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const labels = allFeatures.map((f) => f.label);
    const minVals = allFeatures.map((f) => f.minVal);
    const rangeVals = allFeatures.map((f) => f.rangeVal);
    const colors = allFeatures.map((f) => f.color);

    chartRef.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Typical estimate",
            data: minVals,
            backgroundColor: colors.map((c) => c + "CC"),
            borderColor: colors,
            borderWidth: 2,
            borderRadius: 4,
            borderSkipped: false,
          },
          {
            label: "Potential higher estimate",
            data: rangeVals,
            backgroundColor: colors.map((c) => c + "44"),
            borderColor: colors.map((c) => c + "88"),
            borderWidth: 1,
            borderRadius: 4,
            borderSkipped: "bottom",
          },
        ],
      },
      options: {
        indexAxis: "y",
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: "bottom",
            labels: { font: { size: 11 }, padding: 14, usePointStyle: true },
          },
          tooltip: {
            callbacks: {
              label: (c: TooltipItem<"bar">) =>
                c.datasetIndex === 0
                  ? ` Low: +${(c.raw as number).toFixed(1)}%`
                  : ` Up to high: +${(c.raw as number).toFixed(1)}% more`,
              afterLabel: (c: TooltipItem<"bar">) => ` (${allFeatures[c.dataIndex].unit})`,
            },
          },
        },
        scales: {
          x: {
            stacked: true,
            ticks: { callback: (v: string | number) => "+" + Number(v).toFixed(0) + "%" },
            grid: { color: "rgba(0,0,0,0.05)" },
          },
          y: { stacked: true, grid: { display: false } },
        },
      },
    });

    return () => {
      chartRef.current?.destroy();
      chartRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionFeatures, convFeatures, sessions, conversions]);

  if (allFeatures.length === 0) {
    return (
      <div style={{ textAlign: "center", color: "var(--muted)", padding: "2.5rem", fontSize: "0.85rem" }}>
        Mark one or more features as "No" in Step 1 to see the contribution breakdown.
      </div>
    );
  }

  return (
    <div className={styles.chartWrapContrib}>
      <canvas ref={canvasRef} />
    </div>
  );
}
