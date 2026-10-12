const ExpenseTable = ({ expenses, isLoading, onDelete }) => {
    const formatCurrency = (amt) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
        }).format(amt || 0);
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '-';
        try {
            const d = new Date(dateStr);
            if (isNaN(d.getTime())) return dateStr;
            return d.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            });
        } catch {
            return dateStr;
        }
    };

    return (
        <div className="card expense-table-card">
            <div className="card-header">
                <h2 className="card-title">
                    <span className="card-icon">📋</span> Recent Transactions
                </h2>
                <span className="badge-category" style={{ background: 'rgba(255,255,255,0.08)', color: '#e2e8f0', borderColor: 'transparent' }}>
                    {expenses ? expenses.length : 0} Total
                </span>
            </div>

            {isLoading ? (
                <div className="table-empty">
                    <div className="spinner" style={{ margin: '0 auto 12px' }}></div>
                    <p>Loading transactions...</p>
                </div>
            ) : !expenses || expenses.length === 0 ? (
                <div className="table-empty">
                    <div className="empty-icon">💸</div>
                    <h3>No expenses found</h3>
                    <p>Add your first expense using the form to start tracking.</p>
                </div>
            ) : (
                <div className="table-responsive">
                    <table className="expense-table">
                        <thead>
                            <tr>
                                <th>Category</th>
                                <th>Note</th>
                                <th>Date</th>
                                <th style={{ textAlign: 'right' }}>Amount</th>
                                {onDelete && <th style={{ textAlign: 'center', width: '50px' }}>Action</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {expenses.map((item, idx) => (
                                <tr key={item.id || idx}>
                                    <td>
                                        <span className="badge-category">
                                            {item.category || 'General'}
                                        </span>
                                    </td>
                                    <td>
                                        <span className="note-text" title={item.note || ''}>
                                            {item.note || '-'}
                                        </span>
                                    </td>
                                    <td>
                                        <span className="date-text">{formatDate(item.date)}</span>
                                    </td>
                                    <td style={{ textAlign: 'right' }}>
                                        <span className="expense-amount">
                                            -{formatCurrency(item.amount)}
                                        </span>
                                    </td>
                                    {onDelete && (
                                        <td style={{ textAlign: 'center' }}>
                                            <button
                                                className="btn-delete"
                                                onClick={() => onDelete(item.id)}
                                                title="Delete expense"
                                                aria-label="Delete expense"
                                            >
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
                                                    <polyline points="3 6 5 6 21 6"></polyline>
                                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                </svg>
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ExpenseTable;
