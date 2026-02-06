import React, { useState } from "react";
import "./Admin_Login.css";
import { useNavigate } from "react-router-dom";

const BACKENDURL = import.meta.env.VITE_BACKENDURL;

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    hospital_email: "",
    hospital_password: "",
    superAdmin: false,
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async () => {
    if (!form.hospital_email || !form.hospital_password) {
      setError("Email and password are required");
      return;
    }
    setError("");
    setLoading(true);


if (!form.superAdmin) {
    try {
      const res = await fetch(`${BACKENDURL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",                                  //allow cookie
        body: JSON.stringify({
          hospital_email: form.hospital_email,
          hospital_password: form.hospital_password,
        }),
      });

      const data = await res.json();
      if (res.status === 401) {
        setError(data.message || "Invalid credentials");
        throw new Error(data.message || "Invalid credentials");
      }
      if (res.status !== 200) {
        throw new Error(data.message || "Login failed");
      }
      if (!data.token) {
        setError("Server ERROR 505");
        throw new Error("No token received");
      }
      if(res.status === 200){
        navigate("/admin/dashboard");
      }
                                                              // ✅ JWT is now stored in HttpOnly cookie
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }else{
    try {
      const res = await fetch(`${BACKENDURL}/api/auth/superadmin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",                                  //allow cookie
        body: JSON.stringify({
          hospital_email: form.hospital_email,
          hospital_password: form.hospital_password,
        }),
      });
      setLoading(false);
      if (res.status === 401) {
        const data = await res.json();
        setError(data.message || "Invalid credentials");
        throw new Error(data.message || "Invalid credentials");
      }
      if (res.status !== 200) {
        const data = await res.json();
        throw new Error(data.message || "Login failed");
      }
      const data = await res.json();
      if (!data.token) {
        setError("Server ERROR 505");
        throw new Error("No token received");
      }
      if(res.status === 200){
        navigate("/superadmin/dashboard");
      }
      
    return;
  } catch (err) {
    setError(err.message);
  } finally {    setLoading(false);}
}
  };

  return (
    <div className="login-page">
      <h1 className="brand">Patienttalkback.com</h1>
      <div className="star">★</div>

      <div className="login-card">
        <label>Email</label>
        <input
          type="email"
          name="hospital_email"
          placeholder="Email"
          value={form.hospital_email}
          onChange={handleChange}
        />

        <label>Password</label>
        <input
          type="password"
          name="hospital_password"
          placeholder="Password"
          value={form.hospital_password}
          onChange={handleChange}
        />

        <div className="options">
          <label className="checkbox">
            <input
              type="checkbox"
              name="superAdmin"
              checked={form.superAdmin}
              onChange={handleChange}
            />
            <span>Super Admin</span>
          </label>

          <span
            className="register"
            onClick={() => navigate("/admin/register")}
          >
            new here? Register
          </span>
        </div>

        {error && <p className="error">{error}</p>}

        <button
          className="login-btn"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>
    </div>
  );
}
