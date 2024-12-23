import React from "react";
import { Line } from "react-chartjs-2";

const MonthlyUsageChart = ({ apiData }) => {
    // Get the current month and year
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // JavaScript months are 0-indexed
    const currentYear = currentDate.getFullYear();
  
    // Format data for the chart
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
  
    const labels = apiData.map((item) => `${monthNames[item.month - 1]} ${item.year}`);
    const usageData = apiData.map((item) => {
      // If the data is for a future month, return null to stop the line
      if (item.year > currentYear || (item.year === currentYear && item.month > currentMonth)) {
        return null;
      }
      return parseFloat(item.total_consumption || 0);
    });
  
    // Chart configuration
    const chartData = {
      labels: labels,
      datasets: [
        {
          label: "Monthly Usage (kWh)",
          data: usageData,
          backgroundColor: "rgba(75, 192, 192, 0.2)", // Light blue
          borderColor: "rgba(75, 192, 192, 1)", // Darker blue
          borderWidth: 2,
          pointBackgroundColor: "rgba(75, 192, 192, 1)",
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: "rgba(75, 192, 192, 1)",
        },
      ],
    };
  
    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function (value) {
              // Format Y-axis ticks with 2 decimal places and add 'kW'
              return `${value.toFixed(2)} kW`;
            },
          },
          title: {
            display: true,
            text: "Usage (kW)",
          },
        },
        x: {
          title: {
            display: true,
            text: "Months",
          },
        },
      },
      plugins: {
        legend: {
          display: true,
          position: "top",
        },
      },
    };
  
    return <Line data={chartData} options={chartOptions} />;
  };

export default MonthlyUsageChart;