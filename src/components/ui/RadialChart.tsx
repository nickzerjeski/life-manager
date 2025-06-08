import React, { useEffect, useRef } from 'react';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';

Chart.register(ArcElement, Tooltip, Legend);

interface RadialChartProps {
  progress: number;
  totalDays: number;
}

const RadialChart: React.FC<RadialChartProps> = ({ progress, totalDays }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    chartRef.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Progress', 'Remaining'],
        datasets: [
          {
            data: [progress, 100 - progress],
            backgroundColor: ['#2563eb', '#e5e7eb'],
            borderWidth: 0,
          },
        ],
      },
      options: {
        cutout: '80%',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false },
        },
      },
    });
  }, [progress]);

  const daysLeft = Math.max(
    Math.round(totalDays * (1 - progress / 100)),
    0
  );

  return (
    <div className="relative w-32 h-32">
      <canvas ref={canvasRef} className="w-full h-full" />
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-sm font-semibold">{progress.toFixed(1)}%</span>
        <span className="text-xs text-gray-500">{daysLeft}d left</span>
      </div>
    </div>
  );
};

export default RadialChart;
