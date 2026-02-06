import React from "react";
import "./Home.css";
const logo = "../src/assets/qr_imave.png";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  return (
    <div className="role-page">
      <h1 className="brand">Patienttalkback.com</h1>

      <div className="star">★</div>

      <div className="role-card">
        <button className="role-btn" onClick={() => navigate("/admin/login")}>HOSPITAL ADMIN</button>

        <div className="divider">
          <span></span>
          <p>OR</p>
          <span></span>
        </div>

        <button className="role-btn scanner" onClick={()=>{navigate("/use/scanQR")}}>
          <span>SCANNER</span>
          <div className="qr-box"><img src={logo} alt="QR Code" srcset="" /></div>
        </button>
      </div>
    </div>
  );
}
