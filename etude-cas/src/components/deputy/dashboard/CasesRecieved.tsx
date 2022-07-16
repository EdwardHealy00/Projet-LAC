import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  plugins: {
    title: {
      display: true,
      text: "Études de cas reçues",
      font: {
        size: 20,
        weight: "bold",
      },
    },
    legend: {
      display: false,
    },
    datalabels: {
      display: true,
      color: "black",
      align: "end" as "end",
      anchor: "end" as "end",
    },
  },
  scales: {
    y: {
      display: false,
      grid: {
        display: false,
      },
    },
    x: {
      grid: {
        display: false,
      },
    },
  },
};

const labels = [
  "Au catalogue",
  "En traitement",
  "Rejeté (non-conforme)"
];
const labelData = [36, 9, 10];

const data = {
  labels,
  datasets: [
    {
      data: labelData,
      backgroundColor: [
        "rgba(68, 84, 106, 1)",
        "rgba(192, 0, 0, 1)",
        "rgba(166, 166, 166, 1)",
      ],
    },
  ],
};

export default function App() {
  return <Bar options={options} data={data} plugins={[ChartDataLabels]} />;
}
