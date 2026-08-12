import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "./Profile.css";

function Profile() {
    const [profile, setProfile] = useState(null);
    const [account, setAccount] = useState(null);
    const [error, setError] = useState("");
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [notice, setNotice] = useState("");
    const [form, setForm] = useState({ first_name: "", last_name: "", phone: "", address: "" });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    const loadProfile = async () => {
        try {
            const profileRes = await api.get("/profile/");
            const accountRes = await api.get("/account/");
            setProfile(profileRes.data);
            setAccount(accountRes.data);
            setForm({
                first_name: profileRes.data.first_name || "",
                last_name: profileRes.data.last_name || "",
                phone: profileRes.data.phone || "",
                address: profileRes.data.address || "",
            });
        } catch (err) {
            setError("Failed to load profile data");
        }
    };

    useEffect(() => {
        loadProfile();
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleImageClick = () => {
        if (editing) fileInputRef.current?.click();
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setNotice("");

        try {
            const data = new FormData();
            data.append("first_name", form.first_name);
            data.append("last_name", form.last_name);
            data.append("phone", form.phone);
            data.append("address", form.address);
            if (imageFile) data.append("image", imageFile);

            await api.patch("/profile/", data, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            setNotice("Profile updated successfully");
            setEditing(false);
            setImageFile(null);
            await loadProfile();
        } catch (err) {
            setNotice("Failed to update profile");
        } finally {
            setSaving(false);
        }
    };

    if (error) return <div className="dash-error">{error}</div>;
    if (!profile || !account) return <div className="dash-loading">Loading...</div>;

    const fullName = `${profile.first_name} ${profile.last_name}`.trim() || profile.username;
    const initials = fullName
        .split(" ")
        .filter(Boolean)
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

    const avatarSrc = imagePreview || (profile.image || null);

    return (
        <div className="dash-page">
            <nav className="dash-nav">
                <div className="dash-nav-brand">
                    <div className="auth-brand-mark">₹</div>
                    <span className="auth-brand-name">NovaBank</span>
                </div>
                <button className="dash-logout" onClick={() => navigate("/dashboard")}>← Dashboard</button>
            </nav>

            <main className="dash-main fade-in-up">
                <div className="profile-card">
                    <div
                        className={`profile-avatar ${editing ? "profile-avatar-editable" : ""}`}
                        onClick={handleImageClick}
                    >
                        {avatarSrc ? (
                            <img src={avatarSrc} alt="Profile" className="profile-avatar-img" />
                        ) : (
                            initials
                        )}
                        {editing && <div className="profile-avatar-overlay">Change photo</div>}
                    </div>
                    <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        style={{ display: "none" }}
                    />
                    <div>
                        {!editing ? (
                            <>
                                <h2 className="profile-name">{fullName}</h2>
                                <p className="profile-username">@{profile.username}</p>
                            </>
                        ) : (
                            <div className="profile-name-edit">
                                <input
                                    className="profile-edit-input"
                                    name="first_name"
                                    placeholder="First name"
                                    value={form.first_name}
                                    onChange={handleChange}
                                />
                                <input
                                    className="profile-edit-input"
                                    name="last_name"
                                    placeholder="Last name"
                                    value={form.last_name}
                                    onChange={handleChange}
                                />
                            </div>
                        )}
                    </div>

                    <button
                        className="profile-edit-toggle press-scale"
                        onClick={() => (editing ? handleSave() : setEditing(true))}
                        disabled={saving}
                    >
                        {editing ? (saving ? "Saving..." : "Save") : "Edit"}
                    </button>
                </div>

                {notice && <div className="txn-notice">{notice}</div>}

                <h3 className="dash-section-title">Account details</h3>
                <div className="profile-info-card">
                    <div className="profile-info-row">
                        <span className="profile-info-label">Account number</span>
                        <span className="profile-info-value account-number">{account.account_number}</span>
                    </div>
                    <div className="profile-info-row">
                        <span className="profile-info-label">Balance</span>
                        <span className="profile-info-value">₹{account.balance}</span>
                    </div>
                    <div className="profile-info-row">
                        <span className="profile-info-label">Member since</span>
                        <span className="profile-info-value">{new Date(account.created_at).toLocaleDateString()}</span>
                    </div>
                </div>

                <h3 className="dash-section-title">Personal details</h3>
                <div className="profile-info-card">
                    <div className="profile-info-row">
                        <span className="profile-info-label">Email</span>
                        <span className="profile-info-value">{profile.email}</span>
                    </div>
                    <div className="profile-info-row">
                        <span className="profile-info-label">Phone</span>
                        {!editing ? (
                            <span className="profile-info-value">{profile.phone || "—"}</span>
                        ) : (
                            <input
                                className="profile-edit-input inline"
                                name="phone"
                                value={form.phone}
                                onChange={handleChange}
                            />
                        )}
                    </div>
                    <div className="profile-info-row">
                        <span className="profile-info-label">Address</span>
                        {!editing ? (
                            <span className="profile-info-value">{profile.address || "—"}</span>
                        ) : (
                            <input
                                className="profile-edit-input inline"
                                name="address"
                                value={form.address}
                                onChange={handleChange}
                            />
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Profile;