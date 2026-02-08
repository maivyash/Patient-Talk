import React, { useEffect, useState } from "react";
import "./AdminFeedback.css";
import { useNavigate } from "react-router-dom";
const editIcon = "../src/assets/editIcon.png";
const placeholder="../src/assets/placeholder.jpg";

const BACKENDURL = import.meta.env.VITE_BACKENDURL;

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [hospitalName, setHospitalName] = useState("");
  const [hospitalLogo, setHospitalLogo] = useState("");
  const [editingName, setEditingName] = useState(false);

  // 🔹 Load hospital header info
  useEffect(() => {
    fetch(`${BACKENDURL}/api/admin/hospital/profile`, {
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setHospitalName(data.data.hospital_name);
          setHospitalLogo(data.data.hospital_logo);
        }
      });
  }, []);

  // 🔹 Load feedback forms
useEffect(() => {
  const fetchFeedbacks = async () => {
    try {
      const res = await fetch(`${BACKENDURL}/api/admin/getFeedbackForms`, {
        credentials: "include",
      });
      if (res.status === 314) {
        return;
      }
      if (res.status === 412 || res.status === 401) {
        alert("Session expired. Please log in again.");
        navigate("/login", { replace: true });
        return;
      }

      const data = await res.json();

      if (data.success) {
        setFeedbacks(data.data);
      }
    } catch (err) {
      console.error("Failed to load feedbacks", err);
    } finally {
      setLoading(false);
    }
  };

  fetchFeedbacks();
}, [navigate]);


  async function saveHospitalName() {
    const res = await fetch(`${BACKENDURL}/api/admin/hospital/changeHospitalName`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ newHospital_name: hospitalName }),

    });
    if (res.status === 412 || res.status === 401) {
      alert("Session expired. Please log in again.");
      navigate("/login", { replace: true });
      return;
    }
    if (res.status === 200) {
      setEditingName(false);
    } else {
      alert("Failed to update hospital name");
    }
  };

  if (loading) return <p className="center">Loading...</p>;

  return (
    <div className="admin-feedback-page">
      {/* TOP BAR */}
      <header className="top-bar">
        <span className="menu-icon">☰</span>

        <div className="brand">
          <span className="star">★</span>
          <span>Patienttalkback.com</span>
        </div>

        <div className="hospital-logo">
          {hospitalLogo ? (
            <img src={hospitalLogo} alt="Hospital Logo" />
          ) : (
            <div className="logo-placeholder" />
          )}
        </div>
      </header>

      {/* HOSPITAL NAME */}
      <div className="hospital-name-row">
        {editingName ? (
          <>
            <input
              value={hospitalName}
              onChange={(e) => setHospitalName(e.target.value)}
            />
            <button onClick={saveHospitalName}>Save</button>
          </>
        ) : (
          <>
            <h3>{hospitalName}</h3>
            <img src={editIcon} className="edit-icon" onClick={() => setEditingName(true)} alt="Edit Hospital Name" />
              
            
          </>
        )}
      </div>

      <p className="subtitle">AVAILABLE COMPLAINT OPENED</p>

      {/* FEEDBACK GRID */}
      {feedbacks.length === 0 ? (
        <p className="center">No feedback form available</p>
      ) : (
        <div className="feedback-grid">
          {feedbacks.map((item) => (
            <div
              key={item._id}
              className="feedback-card"
              onClick={() => navigate(`/admin/feedback/edit/${item._id}`)}
            >
              <img 
              className="feedbackimage"
                src={item.logo_png || placeholder}
                  
                alt={item.feedback_name||"Feedback Logo"}
              />
              <p>{item.feedback_name || "Unnamed Feedback Form"}</p>

              <span><img src={editIcon} className="edit-icon"  alt="Edit Feedback Form" onClick={() => navigate(`/admin/feedback/edit/${item._id}`)}/></span>
            </div>
          ))}
        </div>
      )}

      {/* ADD BUTTON */}
      <button
        className="add-btn"
        onClick={() => navigate("/admin/createFeedback")}
      >
        +
      </button>
    </div>
  );
}
