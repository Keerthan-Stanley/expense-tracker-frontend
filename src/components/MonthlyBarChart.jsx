import { useMemo } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const MonthlyBarChart = ({ data, isLoading }) => {
    const chartData = useMemo(() => {
        if (!data) return null;

        let labels = [];
        let values = [];

        // Case 1: Backend returns Map/Object: { "2026-01": 350, "2026-02": 520 }
        if (typeof data === 'object' && !Array.isArray(data)) {
            labels = Object.keys(data);
            values = Object.values(data).map((v) => Number(v) || 0);
        }
        // Case 2: Backend returns Array: [ { month: "2026-01", amount: 350 } ]
        else if (Array.isArray(data)) {
            labels = data.map((item) => item.month || item.date || item.label || item.name || 'Period');
            values = data.map((item) => Number(item.amount ?? item.total ?? item.value ?? 0));
        }

        if (labels.length === 0 || values.every((v) => v === 0)) {
            return null;
        }

        return {
            labels,
            datasets: [
                {
                    label: 'Expenses',
                    data: values,
                    backgroundColor: 'rgba(99, 102, 241, 0.75)',
                    hoverBackgroundColor: 'rgba(99, 102, 241, 0.95)',
                    borderColor: '#818cf8',
                    borderWidth: 1,
                    borderRadius: 6,
                    borderSkipped: false,
                },
            ],
        };
    }, [data]);

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                backgroundColor: '#182238',
                titleColor: '#f8fafc',
                bodyColor: '#cbd5e1',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                borderWidth: 1,
                padding: 12,
                callbacks: {
                    label: (context) => {
                        const val = context.raw || 0;
                        const formatted = new Intl.NumberFormat('en-IN', {
                            style: 'currency',
                            currency: 'INR',
                        }).format(val);
                        return ` Total: ${formatted}`;
                    },
                },
            },
        },
        scales: {
            x: {
                grid: {
                    display: false,
                    drawBorder: false,
                },
                ticks: {
                    color: '#94a3b8',
                    font: {
                        family: "'Plus Jakarta Sans', sans-serif",
                        size: 11,
                    },
                },
            },
            y: {
                grid: {
                    color: 'rgba(255, 255, 255, 0.05)',
                    drawBorder: false,
                },
                ticks: {
                    color: '#94a3b8',
                    font: {
                        family: "'Plus Jakarta Sans', sans-serif",
                        size: 11,
                    },
                    callback: (value) => {
                        return new Intl.NumberFormat('en-IN', {
                            style: 'currency',
                            currency: 'INR',
                            maximumFractionDigits: 0, // Keeps the axis clean (e.g., ₹500 instead of ₹500.00)
                        }).format(value);
                    },
                },
            },
        },
    };

    return (
        <div className="card chart-card">
            <div className="card-header">
                <h2 className="card-title">
                    <span className="card-icon">📈</span> Expenses by Month
                </h2>
            </div>

            <div className="chart-wrapper">
                {isLoading ? (
                    <div className="chart-empty">
                        <div className="spinner" style={{ margin: '0 auto 12px' }}></div>
                        <p>Loading monthly stats...</p>
                    </div>
                ) : !chartData ? (
                    <div className="chart-empty">
                        <div className="chart-empty-icon">📊</div>
                        <p>No monthly expense data available yet</p>
                    </div>
                ) : (
                    <div style={{ position: 'relative', width: '100%', height: '280px' }}>
                        <Bar data={chartData} options={options} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default MonthlyBarChart;
