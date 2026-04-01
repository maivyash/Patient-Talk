import React, { useState, useEffect } from "react";
import "./AdminThemeSettings.css";
import "./AdminLayout.css";
import { applyTheme } from "../themeUtils";

const BACKENDURL = import.meta.env.VITE_BACKENDURL;

const PRESET_THEMES = [
  { name: "Ocean Teal (Default)", primary: "#1c6e73", secondary: "#f0f9fb" },
  { name: "Royal Blue", primary: "#2563eb", secondary: "#eff6ff" },
  { name: "Emerald Green", primary: "#059669", secondary: "#ecfdf5" },
  { name: "Soft Purple", primary: "#7c3aed", secondary: "#f5f3ff" },
  { name: "Sunset Orange", primary: "#ea580c", secondary: "#fff7ed" },
  { name: "Charcoal Slate", primary: "#334155", secondary: "#f8fafc" },
];

export default function ChangeTheme() {
  const [colors, setColors] = useState({
    primaryColor: "#1c6e73",
    secondaryColor: "#9ed6df",
  });
  const [themeMode, setThemeMode] = useState("preset");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Load current theme from backend
    const loadCurrentTheme = async () => {
      try {
        const res = await fetch(`${BACKENDURL}/api/admin/hospital/profile`, {
          credentials: "include",
        });
        const data = await res.json();
        console.log("DATA:", data);
        if (data.success) {
          setColors({
            primaryColor: data.data.adminColor || "#1c6e73",
            secondaryColor: data.data.userColor || "#9ed6df",
          });
          console.log("PRIMARY:", data.data.adminColor);
          console.log("SECONDARY:", data.data.userColor);
          // Apply current theme to the page
          applyTheme(data.data.adminColor || "#1c6e73", data.data.userColor || "#9ed6df");
        }
      } catch (err) {
        console.error("Failed to load theme:", err);
      } finally {
        setLoading(false);
      }
    };
    loadCurrentTheme();
  }, []);

  const handleChange = (key, value) => {
    const newColors = {
      ...colors,
      [key]: value,
    };
    setColors(newColors);
    // Apply changes immediately for preview
    applyTheme(newColors.primaryColor, newColors.secondaryColor);
  };
  const saveTheme = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${BACKENDURL}/api/admin/changeTheme`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          primaryColor: colors.primaryColor,
          secondaryColor: colors.secondaryColor,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        alert(data.message || "Failed to save theme");
        return;
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      // Apply the saved theme
      applyTheme(colors.primaryColor, colors.secondaryColor);
    } catch (err) {
      alert("Server error");
    } finally {
      setSaving(false);
    }
  };

  const resetToDefault = () => {
    const defaultColors = {
      primaryColor: "#1c6e73",
      secondaryColor: "#9ed6df",
    };
    setColors(defaultColors);
    setSuccess(false);
    applyTheme(defaultColors.primaryColor, defaultColors.secondaryColor);
  };

  if (loading) {
    return (
      <div className="theme-page">
        <div className="loading">
          <div>Loading theme settings...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      {/* Navbar */}
      <nav className="admin-navbar">
        <div className="admin-nav-left">
          <button className="admin-back-btn" onClick={() => window.history.back()}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
            Back
          </button>
        </div>
        <div className="admin-nav-center">
          <div className="admin-brand">
            <span className="admin-brand-icon-svg">
              <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                <polygon points="12,5 14.5,9.5 20,10.5 16,14.5 17.5,20 12,17.5 6.5,20 8,14.5 4,10.5 9.5,9.5" fill="#e00000" />
                <path d="M12 2 A10 10 0 0 1 21.5 8 L18.5 8 L22.5 13 L23.5 7 L20.5 7 A11.5 11.5 0 0 0 12 0.5 Z" fill="#f09b50" />
                <path d="M12 22 A10 10 0 0 1 2.5 16 L5.5 16 L1.5 11 L0.5 17 L3.5 17 A11.5 11.5 0 0 0 12 23.5 Z" fill="#f09b50" />
              </svg>
            </span>
            <span className="admin-brand-name">PatientTalkback</span>
          </div>
        </div>
        {/* <div className="admin-nav-right">
          <div className="admin-hospital-avatar-placeholder">H</div>
        </div> */}
      </nav>

      <div className="admin-content">
        <div className="admin-page-header">
          <div className="admin-header-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 2a10 10 0 0 0 0 20" /><path d="M2 12h20" /></svg>
            Customization
          </div>
          <h1 className="admin-page-title">🎨 Theme Settings</h1>
          <p className="admin-page-subtitle">Customize the colors for your hospital&apos;s interfaces</p>
        </div>

        <div className="theme-mode-tabs">
          <button className={`theme-tab ${themeMode === 'preset' ? 'active' : ''}`} onClick={() => setThemeMode('preset')}>
            ✨ Preset Themes
          </button>
          <button className={`theme-tab ${themeMode === 'custom' ? 'active' : ''}`} onClick={() => setThemeMode('custom')}>
            🎨 Custom Colors
          </button>
        </div>

        <div className="theme-content">
          <div className="color-customizer">
            {themeMode === 'preset' ? (
              <>
                <h3>Choose a Theme Options</h3>
                <div className="preset-grid">
                  {PRESET_THEMES.map((preset, idx) => (
                    <div
                      key={idx}
                      className={`preset-card ${colors.primaryColor === preset.primary && colors.secondaryColor === preset.secondary ? 'active' : ''}`}
                      onClick={() => {
                        setColors({ primaryColor: preset.primary, secondaryColor: preset.secondary });
                        applyTheme(preset.primary, preset.secondary);
                      }}
                    >
                      <div className="preset-preview" style={{ background: preset.secondary }}>
                        <div className="preset-preview-inner" style={{ background: preset.primary }}></div>
                      </div>
                      <span className="preset-name">{preset.name}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                <h3>Color Customization</h3>
                <ColorRow
                  label="Admin Primary Color"
                  value={colors.primaryColor}
                  onChange={(v) => handleChange("primaryColor", v)}
                  description="Used for buttons, headers, and primary elements"
                  delay={0.1}
                />
                <ColorRow
                  label="User Background Color"
                  value={colors.secondaryColor}
                  onChange={(v) => handleChange("secondaryColor", v)}
                  description="Used for backgrounds and secondary elements"
                  delay={0.2}
                />
              </>
            )}
          </div>

          <div className="preview-section">
            <h3>Live Preview</h3>
            <div className="preview-card">
              <button className="preview-btn primary">Primary Button</button>
              <button className="preview-btn secondary">Secondary Button</button>
              <div className="preview-brand">Hospital Name</div>
            </div>
          </div>
        </div>

        <div className="button-row">
          <button className="reset-btn" onClick={resetToDefault} disabled={loading || saving}>Set Default Colors</button>
          <button className="save-btn" onClick={saveTheme} disabled={loading || saving}>
            {saving ? "💾 Saving..." : success ? "✅ Saved!" : "💾 Save Theme"}
          </button>
        </div>
      </div>

      <footer className="admin-footer">
        <p className="admin-footer-text">Powered by PatientTalkback</p>
      </footer>
    </div>
  );
}

function ColorRow({ label, value, onChange, description, delay = 0 }) {
  return (
    <div className="color-row" style={{ animationDelay: `${delay}s` }}>
      <div className="color-info">
        <span className="color-label">{label}</span>
        {description && <small className="color-description">{description}</small>}
      </div>
      <div className="color-controls">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="color-picker"
          title={`Choose ${label.toLowerCase()}`}
        />
        <code className="color-code" title="Hex color code">{value.toUpperCase()}</code>
      </div>
    </div>
  );
}