import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";
import "../styles/Auth.css";

function Register() {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        first_name: "",
        last_name: "",
        password: "",
    });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            await api.post("/register/", formData);
            navigate("/login");
        } catch (err) {
            setError("Registration failed. Check your details and try again.");
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-brand">
                    <div className="auth-brand-mark">₹</div>
                    <span className="auth-brand-name">NovaBank</span>
                </div>

                <h2 className="auth-title">Create your account</h2>
                <p className="auth-subtitle">Start banking in under a minute</p>

                {error && <div className="auth-error">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="auth-row">
                        <div className="auth-field">
                            <label className="auth-label">First name</label>
                            <input className="auth-input" name="first_name" placeholder="Naveen" onChange={handleChange} />
                        </div>
                        <div className="auth-field">
                            <label className="auth-label">Last name</label>
                            <input className="auth-input" name="last_name" placeholder="Salmella" onChange={handleChange} />
                        </div>
                    </div>

                    <div className="auth-field">
                        <label className="auth-label">Username</label>
                        <input className="auth-input" name="username" placeholder="Choose a username" onChange={handleChange} />
                    </div>

                    <div className="auth-field">
                        <label className="auth-label">Email</label>
                        <input className="auth-input" name="email" type="email" placeholder="you@example.com" onChange={handleChange} />
                    </div>

                    <div className="auth-field">
                        <label className="auth-label">Password</label>
                        <input className="auth-input" name="password" type="password" placeholder="Create a password" onChange={handleChange} />
                    </div>

                    <button className="auth-submit" type="submit">Create account</button>
                </form>

                <p className="auth-footer">
                    Already have an account? <Link to="/login">Log in</Link>
                </p>
            </div>
        </div>
    );
}

export default Register;