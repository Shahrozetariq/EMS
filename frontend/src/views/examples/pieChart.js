import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart } from 'chart.js'; // Import Chart.js (for v2)

const ConsumptionPieChart = ({ data }) => {
    // Calculate the total VRF and Non-VRF consumption
    const totalVrf = data.reduce((acc, item) => acc + parseFloat(item.vrfConsumption), 0);
    const totalNonVrf = data.reduce((acc, item) => acc + parseFloat(item.nonVrfConsumption), 0);

    // Data for the pie chart
    const chartData = {
        labels: ['VRF Consumption', 'Non-VRF Consumption'],
        datasets: [
            {
                data: [totalVrf, totalNonVrf],
                backgroundColor: ['#FF5733', '#33B5FF'], // Colors for VRF and Non-VRF
                hoverOffset: 4,
            },
        ],
    };

    // Options for the pie chart
    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                callbacks: {
                    label: (tooltipItem) => `${tooltipItem.label}: ${tooltipItem.raw.toFixed(2)} kWh`, // Format the tooltip
                },
            },
        },
    };

    return (
        <>
            {/* <h4>Total VRF vs Non-VRF Consumption</h4> */}
            <Pie data={chartData} options={chartOptions} />
        </>
    );
};

export default ConsumptionPieChart;
