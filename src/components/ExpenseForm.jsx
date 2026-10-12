import { useState } from 'react';
import { expenseApi } from '../api/expenseApi';

const DEFAULT_CATEGORIES = [
    'Food & Dining',
    'Housing & Rent',
    'Transportation',
    'Utilities',
    'Entertainment',
    'Shopping',
    'Healthcare',
    'Education',
    'Personal',
    'Other',
];

const ExpenseForm = ({ onExpenseAdded }) => {
    const getTodayString = () => new Date().toISOString().split('T')[0];

    const [formData, setFormData] = useState({
        amount: '',
        category: 'Food & Dining',
        date: getTodayString(),
        note: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        if (error) setError('');
    };

    const handleQuickCategory = (cat) => {
        setFormData((prev) => ({ ...prev, category: cat }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.amount || isNaN(formData.amount) || Number(formData.amount) <= 0) {
            setError('Please enter a valid positive amount.');
            return;
        }

        if (!formData.category.trim()) {
            setError('Please select or specify a category.');
            return;
        }

        if (!formData.date) {
            setError('Please choose an expense date.');
            return;
        }

        setIsSubmitting(true);
        setError('');
        setSuccess('');

        try {
            const payload = {
                amount: parseFloat(formData.amount),
                category: formData.category.trim(),
                date: formData.date,
                note: formData.note.trim(),
            };

            await expenseApi.createExpense(payload);

            setSuccess('Expense recorded successfully!');
            setFormData({
                amount: '',
                category: 'Food & Dining',
                date: getTodayString(),
                note: '',
            });

            if (onExpenseAdded) {
                onExpenseAdded();
            }

            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            const msg =
                err.response?.data?.message ||
                err.response?.data?.error ||
                err.message ||
                'Failed to add expense. Please try again.';
            setError(msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="card expense-form-card">
            <div className="card-header">
                <h2 className="card-title">
                    <span className="card-icon">➕</span> Add New Expense
                </h2>
            </div>

            {error && (
                <div className="alert alert-error">
                    <span>⚠️</span>
                    <span>{error}</span>
                </div>
            )}

            {success && (
                <div className="alert alert-success">
                    <span>✅</span>
                    <span>{success}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
                <div className="form-row">
                    <div className="form-group">
                        <label className="form-label" htmlFor="amount">
                            Amount (₹) *
                        </label>
                        <input
                            id="amount"
                            name="amount"
                            type="number"
                            step="0.01"
                            min="0.01"
                            placeholder="0.00"
                            className="form-input"
                            value={formData.amount}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="date">
                            Date *
                        </label>
                        <input
                            id="date"
                            name="date"
                            type="date"
                            className="form-input"
                            value={formData.date}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label" htmlFor="category">
                        Category *
                    </label>
                    <select
                        id="category"
                        name="category"
                        className="form-select"
                        value={formData.category}
                        onChange={handleChange}
                        required
                    >
                        {DEFAULT_CATEGORIES.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>

                    <div className="quick-categories">
                        {DEFAULT_CATEGORIES.slice(0, 5).map((cat) => (
                            <button
                                key={cat}
                                type="button"
                                className={`quick-cat-btn ${formData.category === cat ? 'active' : ''}`}
                                onClick={() => handleQuickCategory(cat)}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label" htmlFor="note">
                        Note / Description
                    </label>
                    <textarea
                        id="note"
                        name="note"
                        rows="2"
                        placeholder="e.g. Grocery trip to Costco"
                        className="form-textarea"
                        value={formData.note}
                        onChange={handleChange}
                    ></textarea>
                </div>

                <button type="submit" className="btn-primary" disabled={isSubmitting}>
                    {isSubmitting ? (
                        <>
                            <span className="spinner spinner-sm"></span>
                            <span>Recording Expense...</span>
                        </>
                    ) : (
                        'Add Expense'
                    )}
                </button>
            </form>
        </div>
    );
};

export default ExpenseForm;
