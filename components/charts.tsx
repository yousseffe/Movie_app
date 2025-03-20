"use client"

import { Bar, Line, Pie } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend)

interface ChartData {
  name: string
  value: number
}

interface ChartProps {
  data: ChartData[]
}

export function LineChart({ data }: ChartProps) {
  const chartData = {
    labels: data.map((item) => item.name),
    datasets: [
      {
        label: "Value",
        data: data.map((item) => item.value),
        borderColor: "hsl(var(--primary))",
        backgroundColor: "hsl(var(--primary) / 0.1)",
        tension: 0.2,
        fill: true,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  }

  return <Line data={chartData} options={options} />
}

export function BarChart({ data }: ChartProps) {
  const chartData = {
    labels: data.map((item) => item.name),
    datasets: [
      {
        label: "Value",
        data: data.map((item) => item.value),
        backgroundColor: "hsl(var(--primary))",
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  }

  return <Bar data={chartData} options={options} />
}

export function PieChart({ data }: ChartProps) {
  const chartData = {
    labels: data.map((item) => item.name),
    datasets: [
      {
        data: data.map((item) => item.value),
        backgroundColor: [
          "hsl(var(--primary))",
          "hsl(var(--primary) / 0.8)",
          "hsl(var(--primary) / 0.6)",
          "hsl(var(--primary) / 0.4)",
          "hsl(var(--primary) / 0.2)",
        ],
        borderColor: "hsl(var(--background))",
        borderWidth: 2,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right" as const,
      },
    },
  }

  return <Pie data={chartData} options={options} />
}

