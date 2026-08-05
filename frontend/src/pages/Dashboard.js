import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";
import "./Dashboard.css";


function Dashboard() {
    const [profile, setProfile] = useState(null);
    const [account, setAccount] = useState(null);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const profileRes = await api.get("/profile/");
                const accountRes = await api.get("/account/");
                setProfile(profileRes.data);
                setAccount(accountRes.data);
            } catch (err) {
                setError("Failed to load dashboard data");
            }
        };

        fetchData();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        navigate("/login");
    };

    if (error) return <div className="dash-error">{error}</div>;
    if (!profile || !account) return <div className="dash-loading">Loading...</div>;

    const acc = account.account_number || "";
    const maskedNumber = acc.length > 4 ? "•••• •••• " + acc.slice(-4) : acc;

    return (
        <div className="dash-page">
            <nav className="dash-nav">
                <div className="dash-nav-brand">
                    <div className="auth-brand-mark">₹</div>
                    <span className="auth-brand-name">NovaBank</span>
                </div>
                <button className="dash-logout" onClick={handleLogout}>Log out</button>
            </nav>

            <main className="dash-main">
                <p className="dash-greeting">Welcome back, <strong>{profile.user}</strong></p>

                <div className="balance-card">
                    <div className="balance-card-top">
                        <div>
                            <p className="balance-card-label">Available balance</p>
                            <p className="balance-card-amount">₹{account.balance}</p>
                        </div>
                        <div className="balance-card-chip"></div>
                    </div>
                    <div className="balance-card-bottom">
                        <span className="balance-card-number">{maskedNumber}</span>
                        <span className="balance-card-name">{profile.user}</span>
                    </div>
                </div>

                <div className="quick-actions">
                    <Link to="/deposit" className="quick-action">
                        <div className="quick-action-icon">↓</div>
                        <span className="quick-action-label">Deposit</span>
                    </Link>
                    <Link to="/withdraw" className="quick-action">
                        <div className="quick-action-icon">↑</div>
                        <span className="quick-action-label">Withdraw</span>
                    </Link>
                    <Link to="/transfer" className="quick-action">
                        <div className="quick-action-icon">⇄</div>
                        <span className="quick-action-label">Transfer</span>
                    </Link>
                    <Link to="/history" className="quick-action">
                        <div className="quick-action-icon">≡</div>
                        <span className="quick-action-label">History</span>
                    </Link>
                </div>

                <h3 className="dash-section-title">Recent activity</h3>
                <div className="dash-empty">No transactions yet — they'll show up here once you make your first deposit.</div>
            </main>
        </div>
    );
}

export default Dashboard;