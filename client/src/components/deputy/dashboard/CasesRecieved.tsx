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

export interface CaseReceivedGraphProps {
  caseReceivedData: number[];
}

export default function App(caseReceivedGraphProps: CaseReceivedGraphProps) {

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
  ];
  
  const data = {
    labels,
    datasets: [
      {
        data: caseReceivedGraphProps.caseReceivedData,
        backgroundColor: [
          "rgba(68, 84, 106, 1)",
          "rgba(192, 0, 0, 1)",
        ],
      },
    ],
  };

  return <Bar options={options} data={data} plugins={[ChartDataLabels]} />;
}
