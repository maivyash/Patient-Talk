import React, { useEffect, useState } from "react";
import { replace, useNavigate, useParams } from "react-router-dom";
import "./PublicFeedbackHome.css";

const BACKENDURL = import.meta.env.VITE_BACKENDURL;

export default function PublicFeedbackHome() {
  const { hospitalId } = useParams(); // from URL
  const navigate = useNavigate();

  const [hospital, setHospital] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Load hospital info
  useEffect(() => {
    fetch(`${BACKENDURL}/api/user/getHospitalProfileForUser/${hospitalId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setHospital(data.data);
      });
  }, [hospitalId]);

  // 🔹 Load feedback forms
  useEffect(() => {
    fetch(`${BACKENDURL}/api/user/getHospitalFeedbacksFormForUser/${hospitalId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setFeedbacks(data.data);
        setLoading(false);
      });
  }, [hospitalId]);



  const getHospitalLogoSrc = () => {
  if (!hospital?.hospital_logo) return null;

  // Case 1: already base64 string
  if (typeof hospital.hospital_logo === "string") {
    return hospital.hospital_logo.startsWith("data:")
      ? hospital.hospital_logo
      : `data:image/png;base64,${hospital.hospital_logo}`;
  }

  // Case 2: Mongo Buffer
  if (hospital.hospital_logo?.data?.data) {
    const byteArray = new Uint8Array(hospital.hospital_logo.data.data);
    const binaryString = byteArray.reduce(
      (acc, byte) => acc + String.fromCharCode(byte),
      ""
    );
    const base64 = btoa(binaryString);
    return `data:${hospital.hospital_logo.contentType};base64,${base64}`;
  }

  return null;
};

  if (loading) return <p className="center">Loading...</p>;

  return (
    <div className="public-feedback-page">
      {/* HEADER */}
      <header className="header">
        <span className="star">⭐</span>
        <span className="brand">Patienttalkback.com</span>
      </header>

      {/* HOSPITAL NAME */}
      <div className="hospital-header">
  {getHospitalLogoSrc() && (
    <img
      src={getHospitalLogoSrc()}
      alt="Hospital Logo"
      className="hospital-logo"
    />
  )}

  <h2 className="hospital-name">
    {hospital?.hospital_name || "Hospital"}
  </h2>
</div>


      <p className="subtitle">Click an image to provide feedback</p>

      {/* FEEDBACK GRID */}
      {feedbacks.length === 0 ? (
        <p className="center">No feedback forms available</p>
      ) : (
        <div className="feedback-grid">
          {feedbacks.map((f) => (
            <div
              key={f._id}
              className="feedback-card"
              onClick={() => navigate(`/feedback/${f._id}`, { replace: true } )}
            >
              <img
                src={f.logo_png}
                alt={f.feedback_name}
                onError={(e) => {
                  e.target.src = "/placeholder.png";
                }}
              />
              <p>{f.feedback_name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
