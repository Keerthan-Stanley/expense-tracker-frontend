import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout, isAuthenticated } = useAuth();

    if (!isAuthenticated) return null;

    const displayName = user?.username || 'User';
    const initial = displayName.charAt(0).toUpperCase();

    return (
        <header className="navbar">
            <div className="nav-inner">
                <Link to="/dashboard" className="nav-brand">
                    <div className="brand-icon">💎</div>
                    <span className="brand-title">FinanceTracker</span>
                </Link>

                <div className="nav-actions">
                    <div className="user-badge">
                        <span className="user-avatar">{initial}</span>
                        <span className="user-name">{displayName}</span>
                    </div>

                    <button onClick={logout} className="btn-logout" title="Sign out">
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                            <polyline points="16 17 21 12 16 7"></polyline>
                            <line x1="21" y1="12" x2="9" y2="12"></line>
                        </svg>
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
