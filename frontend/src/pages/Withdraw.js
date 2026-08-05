import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "../styles/Transaction.css";

function Withdraw() {
    const [amount, setAmount] = useState("");
    const [notice, setNotice] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setNotice("");
        setLoading(true);

        try {
            const res = await api.post("/withdraw/", { amount });
            setNotice(`Success — new balance: ₹${res.data.balance}`);
            setTimeout(() => navigate("/dashboard"), 1200);
        } catch (err) {
            const msg = err.response?.data?.error || "Withdraw failed";
            setNotice(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="txn-page">
            <nav className="txn-nav">
                <button className="txn-back" onClick={() => navigate("/dashboard")}>←</button>
                <span className="txn-nav-title">Withdraw money</span>
            </nav>

            <main className="txn-main">
                <div className="txn-card">
                    <form onSubmit={handleSubmit}>
                        <label className="txn-label">Enter amount</label>
                        <div className="txn-amount-wrap">
                            <span className="txn-amount-prefix">₹</span>
                            <input
                                className="txn-amount-input"
                                type="number"
                                placeholder="0"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                            />
                        </div>

                        <button className="txn-submit withdraw" type="submit" disabled={loading}>
                            {loading ? "Processing..." : "Withdraw"}
                        </button>
                        {notice && <div className="txn-notice">{notice}</div>}
                    </form>
                </div>
            </main>
        </div>
    );
}

export default Withdraw;