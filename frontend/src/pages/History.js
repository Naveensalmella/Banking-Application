import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "../styles/Transaction.css";

function History() {
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState([]);
    const [account, setAccount] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const [txnRes, accountRes] = await Promise.all([
                    api.get("/transactions/"),
                    api.get("/account/"),
                ]);
                setTransactions(txnRes.data);
                setAccount(accountRes.data);
            } catch (err) {
                setError("Failed to load transaction history");
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    const getDirection = (t) => {
        if (t.transaction_type === "deposit") return "in";
        if (t.transaction_type === "withdraw") return "out";
        // transfer: direction depends on which side this account is on
        return t.to_account_number === account?.account_number ? "in" : "out";
    };

    const getLabel = (t) => {
        if (t.transaction_type === "deposit") return "Deposit";
        if (t.transaction_type === "withdraw") return "Withdraw";
        return getDirection(t) === "in"
            ? `Received from ${t.from_user || "unknown"}`
            : `Sent to ${t.to_user || "unknown"}`;
    };

    return (
        <div className="txn-page">
            <nav className="txn-nav">
                <button className="txn-back" onClick={() => navigate("/dashboard")}>←</button>
                <span className="txn-nav-title">Transaction history</span>
            </nav>

            <main className="txn-main">
                {loading && <div className="dash-loading">Loading...</div>}
                {error && <div className="txn-notice">{error}</div>}
                {!loading && !error && transactions.length === 0 ? (
                    <div className="dash-empty">No transactions yet — they'll show up here once you make your first deposit.</div>
                ) : (
                    <div className="history-list">
                        {transactions.map((t, i) => {
                            const direction = getDirection(t);
                            return (
                                <div
                                    className="history-row fade-in-up"
                                    key={t.id}
                                    style={{ animationDelay: `${i * 0.04}s` }}
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
                                        {direction === "in" ? "+" : "-"}₹{t.amount}
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

export default History;