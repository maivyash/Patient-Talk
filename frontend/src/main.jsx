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

      document.documentElement.style.setProperty('--primary-color', primary);
      document.documentElement.style.setProperty('--secondary-color', secondary);

      document.body.style.background = secondary;
    }
  } catch (e) {}
};

// 🔥 WAIT BEFORE RENDER
loadThemeEarly().finally(() => {
  createRoot(document.getElementById('root')).render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
});