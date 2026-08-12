import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";
import "./Dashboard.css";


function Dashboard() {
    const [profile, setProfile] = useState(null);
    const [account, setAccount] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [profileRes, accountRes, txnRes] = await Promise.all([
                    api.get("/profile/"),
                    api.get("/account/"),
                    api.get("/transactions/"),
                ]);
                setProfile(profileRes.data);
                setAccount(accountRes.data);
                setTransactions(txnRes.data.slice(0, 5));
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

    const getDirection = (t) => {
        if (t.transaction_type === "deposit") return "in";
        if (t.transaction_type === "withdraw") return "out";
        return t.to_account_number === account?.account_number ? "in" : "out";
    };

    const getLabel = (t) => {
        if (t.transaction_type === "deposit") return "Deposit";
        if (t.transaction_type === "withdraw") return "Withdraw";
        return getDirection(t) === "in"
            ? `From ${t.from_user || "unknown"}`
            : `To ${t.to_user || "unknown"}`;
    };

    return (
        <div className="dash-page">
            <nav className="dash-nav">
                <div className="dash-nav-brand">
                    <div className="auth-brand-mark">₹</div>
                    <span className="auth-brand-name">NovaBank</span>
                </div>
                <div className="dash-nav-actions">
                    <Link to="/profile" className="dash-profile-link">Profile</Link>
                    <button className="dash-logout" onClick={handleLogout}>Log out</button>
                </div>
            </nav>

            <main className="dash-main fade-in-up">
                <p className="dash-greeting">Welcome back, <strong>{profile.username}</strong></p>

                <div className="balance-card">
                    <div className="balance-card-top">
                        <div>
                            <p className="balance-card-label">Available balance</p>
                            <p className="balance-card-amount">₹{Number(account.balance).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</p>
                        </div>
                        <div className="balance-card-chip"></div>
                    </div>
                    <div className="balance-card-bottom">
                        <span className="balance-card-number">{maskedNumber}</span>
                        <span className="balance-card-name">{profile.first_name} {profile.last_name}</span>
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
                {transactions.length === 0 ? (
                    <div className="dash-empty">No transactions yet — they'll show up here once you make your first deposit.</div>
                ) : (
                    <div className="history-list">
                        {transactions.map((t, i) => {
                            const direction = getDirection(t);
                            return (
                                <div
                                    className="history-row fade-in-up"
                                    key={t.id}
                                    style={{ animationDelay: `${i * 0.05}s` }}
                                >
                                    <div className="history-left">
                                        <div className={`history-icon ${direction}`}>
                                            {direction === "in" ? "↓" : "↑"}
                                        </div>
                                        <div>
                                            <div className="history-type">{getLabel(t)}</div>
                                            <div className="history-date">{new Date(t.created_at).toLocaleString()}</div>
                                        </div>
                                    </div>
                                    <div className={`history-amount ${direction}`}>
                                        {direction === "in" ? "+" : "-"}₹{Number(t.amount).toLocaleString("en-IN")}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>
        </div>
    );
}

export default Dashboard;