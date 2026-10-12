import { useState, useEffect, useCallback } from 'react';
import { expenseApi } from '../api/expenseApi';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseTable from '../components/ExpenseTable';
import CategoryPieChart from '../components/CategoryPieChart';
import MonthlyBarChart from '../components/MonthlyBarChart';

const Dashboard = () => {
    const [expenses, setExpenses] = useState([]);
    const [categoryStats, setCategoryStats] = useState(null);
    const [monthStats, setMonthStats] = useState(null);

    const [loadingExpenses, setLoadingExpenses] = useState(true);
    const [loadingCatStats, setLoadingCatStats] = useState(true);
    const [loadingMonthStats, setLoadingMonthStats] = useState(true);

    const [error, setError] = useState('');

    // Fetch all expenses from backend
    const fetchExpenses = useCallback(async () => {
        setLoadingExpenses(true);
        try {
            const data = await expenseApi.getExpenses();
            setExpenses(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Error fetching expenses:', err);
            setError('Could not connect to backend to fetch expenses. Ensure Spring Boot is running on port 8080.');
        } finally {
            setLoadingExpenses(false);
        }
    }, []);

    // Fetch Category Stats from backend
    const fetchCategoryStats = useCallback(async () => {
        setLoadingCatStats(true);
        try {
            const data = await expenseApi.getCategoryStats();
            setCategoryStats(data);
        } catch (err) {
            console.error('Error fetching category stats:', err);
        } finally {
            setLoadingCatStats(false);
        }
    }, []);

    // Fetch Monthly Stats from backend
    const fetchMonthStats = useCallback(async () => {
        setLoadingMonthStats(true);
        try {
            const data = await expenseApi.getMonthStats();
            setMonthStats(data);
        } catch (err) {
            console.error('Error fetching monthly stats:', err);
        } finally {
            setLoadingMonthStats(false);
        }
    }, []);

    // Fetch all data
    const refreshAll = useCallback(() => {
        setError('');
        fetchExpenses();
        fetchCategoryStats();
        fetchMonthStats();
    }, [fetchExpenses, fetchCategoryStats, fetchMonthStats]);

    useEffect(() => {
        refreshAll();
    }, [refreshAll]);

    // Handle Delete
    const handleDeleteExpense = async (id) => {
        if (!window.confirm('Are you sure you want to delete this expense?')) return;
        try {
            await expenseApi.deleteExpense(id);
            refreshAll();
        } catch (err) {
            console.error('Failed to delete expense:', err);
            alert('Failed to delete expense.');
        }
    };

    // Dynamic calculations from fetched data
    const totalSpent = expenses.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
    const totalTransactions = expenses.length;
    const avgExpense = totalTransactions > 0 ? totalSpent / totalTransactions : 0;

    const formatCurrency = (amt) =>
        new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
        }).format(amt);

    return (
        <div className="main-content">
            {/* Dashboard Top Header */}
            <div className="dashboard-header">
                <div>
                    <h1 className="dashboard-title">Financial Dashboard</h1>
                    <p className="dashboard-subtitle">
                        Overview of your personal spending, statistics, and expense tracking
                    </p>
                </div>

                <div className="dashboard-actions">
                    <button onClick={refreshAll} className="btn-refresh" title="Reload data from backend">
                        <svg
                            width="15"
                            height="15"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <polyline points="23 4 23 10 17 10"></polyline>
                            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
                        </svg>
                        <span>Refresh</span>
                    </button>
                </div>
            </div>

            {error && (
                <div className="alert alert-error">
                    <span>⚠️</span>
                    <span>{error}</span>
                </div>
            )}

            {/* Metrics Row */}
            <div className="metrics-grid">
                <div className="metric-card" style={{ '--metric-color': 'rgba(244, 63, 94, 0.4)' }}>
                    <div className="metric-label">Total Spent</div>
                    <div className="metric-value expense">{formatCurrency(totalSpent)}</div>
                    <div className="metric-sub">Across all logged expenses</div>
                </div>

                <div className="metric-card" style={{ '--metric-color': 'rgba(6, 182, 212, 0.4)' }}>
                    <div className="metric-label">Total Records</div>
                    <div className="metric-value count">{totalTransactions}</div>
                    <div className="metric-sub">Recorded transactions</div>
                </div>

                <div className="metric-card" style={{ '--metric-color': 'rgba(99, 102, 241, 0.4)' }}>
                    <div className="metric-label">Average Expense</div>
                    <div className="metric-value">{formatCurrency(avgExpense)}</div>
                    <div className="metric-sub">Per transaction</div>
                </div>
            </div>

            {/* Analytics Charts Row */}
            <div className="charts-grid">
                <CategoryPieChart data={categoryStats} isLoading={loadingCatStats} />
                <MonthlyBarChart data={monthStats} isLoading={loadingMonthStats} />
            </div>

            {/* Action Row: Form + Table */}
            <div className="section-grid">
                <ExpenseForm onExpenseAdded={refreshAll} />
                <ExpenseTable
                    expenses={expenses}
                    isLoading={loadingExpenses}
                    onDelete={handleDeleteExpense}
                />
            </div>
        </div>
    );
};

export default Dashboard;
