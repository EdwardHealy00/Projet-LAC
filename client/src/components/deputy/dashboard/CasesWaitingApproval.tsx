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

export interface CaseStatusGraphProps {
  caseStatusData: number[];
}

export default function App(caseReceivedGraphProps: CaseStatusGraphProps) {

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
        text: "Études de cas en traitement",
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
    secondXAxis: {
      axis: "x",
      labels: ["V2", "syntax", "in", "v3"],
      grid: {
        drawOnChartArea: false,
      },
    },
  };
  
  const labels = [
    "À préapprouver",
    "En révision",
    "À ajouter au catalogue",
    "En attente de modifications"
  ];
  const labelData = caseReceivedGraphProps.caseStatusData;
  
  const data = {
    labels,
    datasets: [
      {
        data: labelData,
        backgroundColor: [
          "rgba(68, 84, 106, 1)",
          "rgba(132, 151, 176, 1)",
          "rgba(192, 0, 0, 1)",
          "rgba(248, 150, 31, 1)",
          "rgba(166, 166, 166, 1)",
        ],
      },
    ],
  };

  return <Bar options={options} data={data} plugins={[ChartDataLabels]} />;
}
