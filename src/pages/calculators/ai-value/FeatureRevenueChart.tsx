import { useEffect, useRef } from "react";
import { Chart, type TooltipItem } from "chart.js/auto";
import { moneyShort, wrapLabel } from "./resultsHelpers";
import type { Opportunity } from "./engine";
import styles from "./AiValueCalculator.module.css";

interface FeatureRevenueChartProps {
  numericOpportunities: Opportunity[];
}

/**
 * Two-tone horizontal stacked bar: solid segment is the conservative (low)
 * estimate, lighter segment is the upside to the high estimate. Mirrors the
 * #chartFeatures chart in the original renderResults().
 */
export default function FeatureRevenueChart({ numericOpportunities }: FeatureRevenueChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  const sorted = [...numericOpportunities].sort((a, b) => {
    const midA = ((a.revLo || 0) + (a.revHi || 0)) / 2;
    const midB = ((b.revLo || 0) + (b.revHi || 0)) / 2;
    return midB - midA;
  });

  useEffect(() => {
    if (sorted.length === 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Grow the chart container so every feature row stays legible (~46px per bar + room for legend/axis)
    if (wrapRef.current) {
      wrapRef.current.style.height = Math.max(300, sorted.length * 46 + 96) + "px";
    }

    chartRef.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: sorted.map((o) => o.name),
        datasets: [
          {
            label: "Typical range",
            data: sorted.map((o) => o.revLo || 0),
            backgroundColor: "rgba(155,101,201,0.85)",
            borderColor: "rgba(155,101,201,1)",
            borderWidth: 1,
            borderRadius: 4,
          },
          {
            label: "Potential additional uplift",
            data: sorted.map((o) => Math.max(0, (o.revHi || 0) - (o.revLo || 0))),
            backgroundColor: "rgba(155,101,201,0.32)",
            borderColor: "rgba(155,101,201,0.5)",
            borderWidth: 1,
            borderRadius: 4,
          },
        ],
      },
      options: {
        indexAxis: "y",
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: true, position: "bottom", labels: { boxWidth: 12, font: { size: 11 } } },
          tooltip: {
            callbacks: {
              label: (c: TooltipItem<"bar">) => {
                const o = sorted[c.dataIndex];
                return ` ${moneyShort(o.revLo || 0)} – ${moneyShort(o.revHi || 0)} / month`;
              },
            },
          },
        },
        scales: {
          x: {
            stacked: true,
            min: 0,
            ticks: { callback: (v: string | number) => moneyShort(Number(v)) },
            grid: { color: "rgba(0,0,0,0.05)" },
          },
          y: {
            stacked: true,
            grid: { display: false },
            ticks: {
              font: { size: 11 },
              autoSkip: false,
              callback: function (this: { getLabelForValue: (v: number) => string }, v: string | number) {
                return wrapLabel(this.getLabelForValue(Number(v)), 22);
              },
            },
          },
        },
      },
    });

    return () => {
      chartRef.current?.destroy();
      chartRef.current = null;
    };
  }, [sorted]);

  if (sorted.length === 0) return null;

  return (
    <div className={styles.chartWrapContrib} ref={wrapRef}>
      <canvas ref={canvasRef} />
    </div>
  );
}
