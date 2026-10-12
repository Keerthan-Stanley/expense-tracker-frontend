import { useMemo } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

// Modern vibrant dark-mode palette
const PALETTE = [
    '#6366f1', // Indigo
    '#06b6d4', // Cyan
    '#f43f5e', // Rose
    '#10b981', // Emerald
    '#f59e0b', // Amber
    '#a855f7', // Purple
    '#3b82f6', // Blue
    '#ec4899', // Pink
    '#14b8a6', // Teal
    '#8b5cf6', // Violet
];

const CategoryPieChart = ({ data, isLoading }) => {
    const chartData = useMemo(() => {
        if (!data) return null;

        let labels = [];
        let values = [];

        // Case 1: Backend returns Map/Object: { Food: 150, Travel: 80 }
        if (typeof data === 'object' && !Array.isArray(data)) {
            labels = Object.keys(data);
            values = Object.values(data).map((v) => Number(v) || 0);
        }
        // Case 2: Backend returns Array: [ { category: "Food", amount: 150 } ] or [ { name, total } ]
        else if (Array.isArray(data)) {
            labels = data.map((item) => item.category || item.name || item.label || 'Other');
            values = data.map((item) => Number(item.amount ?? item.total ?? item.value ?? 0));
        }

        if (labels.length === 0 || values.every((v) => v === 0)) {
            return null;
        }

        return {
            labels,
            datasets: [
                {
                    data: values,
                    backgroundColor: PALETTE.slice(0, labels.length),
                    borderColor: '#111726',
                    borderWidth: 2,
                    hoverOffset: 8,
                },
            ],
        };
    }, [data]);

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    color: '#94a3b8',
                    font: {
                        family: "'Plus Jakarta Sans', sans-serif",
                        size: 12,
                    },
                    padding: 16,
                    usePointStyle: true,
                    pointStyle: 'circle',
                },
            },
            tooltip: {
                backgroundColor: '#182238',
                titleColor: '#f8fafc',
                bodyColor: '#cbd5e1',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                borderWidth: 1,
                padding: 12,
                boxPadding: 6,
                usePointStyle: true,
                callbacks: {
                    label: (context) => {
                        const label = context.label || '';
                        const val = context.raw || 0;
                        const formatted = new Intl.NumberFormat('en-IN', {
                            style: 'currency',
                            currency: 'INR',
                        }).format(val);
                        return ` ${label}: ${formatted}`;
                    },
                },
            },
        },
    };

    return (
        <div className="card chart-card">
            <div className="card-header">
                <h2 className="card-title">
                    <span className="card-icon">🍕</span> Expenses by Category
                </h2>
            </div>

            <div className="chart-wrapper">
                {isLoading ? (
                    <div className="chart-empty">
                        <div className="spinner" style={{ margin: '0 auto 12px' }}></div>
                        <p>Loading category stats...</p>
                    </div>
                ) : !chartData ? (
                    <div className="chart-empty">
                        <div className="chart-empty-icon">📊</div>
                        <p>No category expense data available yet</p>
                    </div>
                ) : (
                    <div style={{ position: 'relative', width: '100%', height: '280px' }}>
                        <Pie data={chartData} options={options} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default CategoryPieChart;
