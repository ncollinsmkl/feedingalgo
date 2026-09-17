import { useEffect, useRef } from "react";
import { Chart, type TooltipItem } from "chart.js/auto";
import { fmt } from "./resultsHelpers";
import type { Triple } from "./engine";
import styles from "./DataStrengthCalculator.module.css";

interface ProjectionBarChartProps {
  title: string;
  current: number;
  projected: Triple | null;
  unitLabel: "sessions" | "conversions";
  /** Color triplet [low, mid/projection, high] as rgba strings. */
  colors: [string, string, string];
  borders: [string, string, string];
  midLabel: "Projection" | "Mid";
}

/**
 * A single Chart.js bar chart: "Current" plus, when there's a projection,
 * "Low / Projection / High" bars. Mirrors Chart 1 and Chart 2 from the
 * original renderResults() (#chartSessions / #chartConversions).
 */
export default function ProjectionBarChart({
  title,
  current,
  projected,
  unitLabel,
  colors,
  borders,
  midLabel,
}: ProjectionBarChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const labels = ["Current"];
    const data = [current];
    const bgColors = ["rgba(107,114,128,0.45)"];
    const borderColors = ["rgba(107,114,128,0.8)"];

    if (projected) {
      labels.push("Low", midLabel, "High");
      data.push(projected.lo, projected.avg, projected.hi);
      bgColors.push(...colors);
      borderColors.push(...borders);
    }

    chartRef.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: title,
            data,
            backgroundColor: bgColors,
            borderColor: borderColors,
            borderWidth: 2,
            borderRadius: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: { label: (c: TooltipItem<"bar">) => " " + fmt(c.raw as number) + " " + unitLabel },
          },
        },
        scales: {
          y: {
            min: 0,
            ticks: { callback: (v: string | number) => fmt(Number(v)) },
            grid: { color: "rgba(0,0,0,0.05)" },
          },
          x: { grid: { display: false } },
        },
      },
    });

    return () => {
      chartRef.current?.destroy();
      chartRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, projected, title, unitLabel]);

  return (
    <div>
      <div className={styles.chartTitle}>{title}</div>
      <div className={styles.chartWrap}>
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
}
