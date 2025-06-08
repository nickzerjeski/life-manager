
import ApexCharts from "apexcharts";
import { useEffect, useRef } from "react";

const getChartOptions = () => {
  return {
    series: [90, 85, 70],
    colors: ["#1C64F2", "#16BDCA", "#FDBA8C"],
    chart: {
      height: "350px",
      width: "100%",
      type: "radialBar",
      sparkline: {
        enabled: true,
      },
    },
    plotOptions: {
      radialBar: {
        track: {
          background: '#E5E7EB',
        },
        dataLabels: {
          show: false,
        },
        hollow: {
          margin: 0,
          size: "32%",
        }
      },
    },
    grid: {
      show: false,
      strokeDashArray: 4,
      padding: {
        left: 2,
        right: 2,
        top: -23,
        bottom: -20,
      },
    },
    labels: ["Done", "In progress", "To do"],
    legend: {
      show: true,
      position: "bottom",
      fontFamily: "Inter, sans-serif",
    },
    tooltip: {
      enabled: true,
      x: {
        show: false,
      },
    },
    yaxis: {
      show: false,
      labels: {
        formatter: function (value: number) {
          return value + '%';
        }
      }
    }
  }
}

if (document.getElementById("radial-chart") && typeof ApexCharts !== 'undefined') {
  const chart = new ApexCharts(document.querySelector("#radial-chart"), getChartOptions());
  chart.render();
}

const RadialChart = () => {
  const chartRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = new ApexCharts(chartRef.current, getChartOptions());
    chart.render();

    return () => {
      chart.destroy();
    };
  }, []);

  return <div id="radial-chart" ref={chartRef} />;
};

export default RadialChart;
