import React, { useState } from "react";
import "./AdminThemeSettings.css";

const BACKENDURL = import.meta.env.VITE_BACKENDURL;

export default function ChangeTheme() {
  const [colors, setColors] = useState({
    primaryColor: "#FFFFFF",
    secondaryColor: "#FFFFFF",
    accentColor: "#FFFFFF",
    backgroundColor: "#FFFFFF",
  });

  const handleChange = (key, value) => {
    setColors((prev) => ({
      ...prev,
      [key]: value,
    }));
    
  };

  const saveTheme = async () => {
    try {
      const res = await fetch(`${BACKENDURL}/api/admin/changeTheme`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  credentials: "include",
  body: JSON.stringify({
    primaryColor: colors.primaryColor,    // adminColor
    secondaryColor: colors.secondaryColor,  // userColor
  }),
});

      const data = await res.json();
      if (!res.ok || !data.success) {
        alert(data.message || "Failed to save theme");
        return;
      }

      alert("Theme settings saved & broadcasted!");
    } catch (err) {
      alert("Server error");
    }
  };

  return (
    <div className="theme-page">
      <h2>🎨 Theme Settings</h2>

      <ColorRow
        label="Primary Color"
        value={colors.primaryColor}
        onChange={(v) => handleChange("primaryColor", v)}
      />

      <ColorRow
        label="Secondary Color"
        value={colors.secondaryColor}
        onChange={(v) => handleChange("secondaryColor", v)}
      />

      <ColorRow
        label="Accent Color"
        value={colors.accentColor}
        onChange={(v) => handleChange("accentColor", v)}
      />

      <ColorRow
        label="Background Color"
        value={colors.backgroundColor}
        onChange={(v) => handleChange("backgroundColor", v)}
      />

      <button className="save-btn" onClick={saveTheme}>
        Save Theme
      </button>
    </div>
  );
}

function ColorRow({ label, value, onChange }) {
  return (
    <div className="color-row">
      <span>{label}</span>
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <code>{value}</code>
    </div>
  );
}