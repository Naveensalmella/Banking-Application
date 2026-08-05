import { useNavigate } from "react-router-dom";
import "../styles/Transaction.css";

function History() {
    const navigate = useNavigate();

    // TODO: replace with real api.get("/transactions/") once backend is ready
    const transactions = [];

    return (
        <div className="txn-page">
            <nav className="txn-nav">
                <button className="txn-back" onClick={() => navigate("/dashboard")}>←</button>
                <span className="txn-nav-title">Transaction history</span>
            </nav>

            <main className="txn-main">
                {transactions.length === 0 ? (
                    <div className="dash-empty">No transactions yet — they'll show up here once your backend is connected.</div>
                ) : (
                    <div className="history-list">
                        {transactions.map((t) => (
                            <div className="history-row" key={t.id}>
                                <div className="history-left">
                                    <div className="history-icon">{t.type === "deposit" ? "↓" : "↑"}</div>
                                    <div>
                                        <div className="history-type">{t.type}</div>
                                        <div className="history-date">{t.date}</div>
                                    </div>
                                </div>
                                <div className={`history-amount ${t.type === "deposit" ? "in" : "out"}`}>
                                    {t.type === "deposit" ? "+" : "-"}₹{t.amount}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}

export default History;