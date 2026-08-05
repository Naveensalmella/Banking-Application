import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "../styles/Transaction.css";

function Transfer() {
    const [recipient, setRecipient] = useState("");
    const [amount, setAmount] = useState("");
    const [notice, setNotice] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setNotice("");
        setLoading(true);

        try {
            const res = await api.post("/transfer/", {
                account_number: recipient,
                amount,
            });
            const newBalance = res.data["Updated balance"];
            setNotice(`Success — new balance: ₹${newBalance}`);
            setTimeout(() => navigate("/dashboard"), 1200);
        } catch (err) {
            const msg = err.response?.data?.error || "Transfer failed";
            setNotice(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="txn-page">
            <nav className="txn-nav">
                <button className="txn-back" onClick={() => navigate("/dashboard")}>←</button>
                <span className="txn-nav-title">Transfer money</span>
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

                        <div className="txn-field">
                            <label className="txn-field-label">Recipient account number</label>
                            <input
                                className="txn-input"
                                type="text"
                                placeholder="Enter account number"
                                value={recipient}
                                onChange={(e) => setRecipient(e.target.value)}
                            />
                        </div>

                        <button className="txn-submit transfer" type="submit" disabled={loading}>
                            {loading ? "Processing..." : "Transfer"}
                        </button>
                        {notice && <div className="txn-notice">{notice}</div>}
                    </form>
                </div>
            </main>
        </div>
    );
}

export default Transfer;