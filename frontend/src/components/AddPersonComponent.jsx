import React, { useState } from "react";

const BACKENDURL = import.meta.env.VITE_BACKENDURL;

export default function AddPersonModal({ onClose, onAdd }) {
  const [form, setForm] = useState({ name: "", mobile: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    if (!form.name.trim()) return alert("Name is required");
    if(!form.mobile.trim() )return alert("Mobile number is required");
    if(!form.email.trim()) return alert("Email is required");
    if(!/^\d{10}$/.test(form.mobile.trim())) return alert("Invalid mobile number");
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) return alert("Invalid email address");

    setLoading(true);
    const res = await fetch(`${BACKENDURL}/api/admin/addFeedbackPerson`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setLoading(false);

    if (!data.success) {
      alert(data.message || "Failed to add person");
      return;
    }

    onAdd(data.data);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <h3>Add Person</h3>

        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          placeholder="Mobile"
          value={form.mobile}
          onChange={(e) => setForm({ ...form, mobile: e.target.value })}
        />
        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <div className="modal-actions">
          <button onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button onClick={submit} disabled={loading} className="btn-primary">
            {loading ? "Adding..." : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}