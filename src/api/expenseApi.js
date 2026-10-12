import api from './axios';

export const expenseApi = {
    // Get all expenses
    getExpenses: async () => {
        const response = await api.get('/api/expenses');
        return response.data;
    },

    // Create a new expense
    createExpense: async (expenseData) => {
        const response = await api.post('/api/expenses', expenseData);
        return response.data;
    },

    // Delete an expense
    deleteExpense: async (id) => {
        const response = await api.delete(`/api/expenses/${id}`);
        return response.data;
    },

    // Get expenses aggregated by category for Pie Chart
    getCategoryStats: async () => {
        const response = await api.get('/api/expenses/stats/by-category');
        return response.data;
    },

    // Get expenses aggregated by month for Bar Chart
    getMonthStats: async () => {
        const response = await api.get('/api/expenses/stats/by-month');
        return response.data;
    },
};
