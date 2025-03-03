import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';


ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const DummyBarGraph: React.FC = () => {
  const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    datasets: [
      {
        id: 1,
        label: 'Total sales',
        data: [5, 6, 7.5, 8, 9, 13, 11, 8, 13, 14, 5, 16],
        backgroundColor: '#9ca3af',
        borderColor: '#9ca3af',
      },
     
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Dummy Car Bar Graph',
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default DummyBarGraph;
