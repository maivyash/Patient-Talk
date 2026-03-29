import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
const BACKENDURL = import.meta.env.VITE_BACKENDURL;

// 🔥 LOAD THEME BEFORE REACT
const loadThemeEarly = async () => {
  const hasCookie = document.cookie && document.cookie.length > 0;

  if (!hasCookie) {

    return;
  }
  try {
    const res = await fetch(`${BACKENDURL}/api/admin/hospital/profile`, {
      credentials: "include",
    });

    if (!res.ok) return;

    const data = await res.json();
    if (data.success) {
      const primary = data.data.adminColor || "#1c6e73";
      const secondary = data.data.userColor || "#9ed6df";

      const getContrastColor = (hex) => {
        if (!hex) return "#ffffff";
        const color = hex.replace("#", "");
        const r = parseInt(color.substring(0, 2), 16);
        const g = parseInt(color.substring(2, 4), 16);
        const b = parseInt(color.substring(4, 6), 16);
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        return brightness > 128 ? "#0b1c28" : "#ffffff";
      };

      const contrastText = getContrastColor(secondary);
      const btnText = getContrastColor(primary);
      const isDark = contrastText === "#ffffff";

      // Apply theme to CSS custom properties
      document.documentElement.style.setProperty("--primary-color", primary);
      document.documentElement.style.setProperty("--secondary-color", secondary);
      document.documentElement.style.setProperty("--text-main", contrastText);
      document.documentElement.style.setProperty("--btn-text", btnText);
      document.documentElement.style.setProperty(
        "--glass-bg",
        isDark ? "rgba(0,0,0,0.25)" : "rgba(255,255,255,0.75)"
      );
      document.documentElement.style.setProperty(
        "--glass-border",
        isDark ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.8)"
      );

      // Update body background
      document.body.style.background = secondary;
    }
  } catch (e) {
    console.error("Early theme load failed:", e);
  }
};

// 🔥 WAIT BEFORE RENDER
loadThemeEarly().finally(() => {
  createRoot(document.getElementById('root')).render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
});