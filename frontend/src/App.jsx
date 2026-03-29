import React, { useEffect } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import HospitalLanding from './pages/HospitalLanding'
import FeedbackForm from './pages/FeedbackForm'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import AdminResponses from './pages/AdminResponses'
import AdminRegister from './pages/AdminRegister'
import SuperAdminLogin from './pages/SuperAdminLogin'
import HospitalLogin from './pages/HospitalLogin'
import UserLogin from './pages/UserLogin'
import ComplaintBoard from './pages/ComplaintBoard'
import ComplaintBuilder from './pages/ComplaintBuilder'
import ComplaintForm from './pages/ComplaintForm'
import ComplaintView from './pages/ComplaintView'
import ThemeSettings from './pages/ThemeSettings'
import UserFeedbackForm from './pages/UserFeedbackForm'
import SuperAdminDashboard from './pages/SuperAdminDashboard'
import SuperAdminComplaintBoard from './pages/SuperAdminComplaintBoard'
import SuperAdminComplaintList from './pages/SuperAdminComplaintList'
import CreateFeedback from './CreateFeeback'
import EditFeedback from './pages/EditFeedbackForm'
import PublicFeedbackForm from './pages/SubmitFeedbackResponce'
import PublicFeedbackHome from './pages/UserHomeforFeedbackkForm'
import AdminAssignPage from './pages/AdminAssignPerson'
import SecureFeedbackView from './pages/ResponceViewer'
import changeTheme from './pages/changeTheme'
import ChangeTheme from './pages/changeTheme'

const BACKENDURL = import.meta.env.VITE_BACKENDURL;

function App() {
  useEffect(() => {
    // Load theme on app start
    const loadTheme = async () => {
      const hasCookie = document.cookie && document.cookie.length > 0;

      if (!hasCookie) {

        return;
      }
      try {
        const res = await fetch(`${BACKENDURL}/api/admin/hospital/profile`, {
          credentials: "include",
        });
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
      } catch (err) {
        console.log("Theme not loaded (user not authenticated)");
      }
    };
    loadTheme();
  }, []);

  return (
    <div className="app-root">
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/hospital/:hospitalId" element={<HospitalLanding />} />
        <Route path="/hospital/:hospitalId/feedback" element={<FeedbackForm />} />
        <Route path="/super-admin/login" element={<SuperAdminLogin />} /> */}

        <Route path="/super-admin/hospital/:hospitalId/complaints" element={<SuperAdminComplaintBoard />} />
        <Route path="/super-admin/hospital/:hospitalId/form/:formId" element={<SuperAdminComplaintList />} />
        <Route path="/superadmin/dashboard" element={<SuperAdminDashboard />} />
        <Route path="/login" element={<AdminLogin />} />
        {/* <Route path="/hospital/login" element={<HospitalLogin />} /> */}
        {/* <Route path="/user/login" element={<UserLogin />} /> */}
        <Route path="/admin/register" element={<AdminRegister />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/createFeedback" element={<CreateFeedback />} />
        <Route path="/feedback/:id" element={<PublicFeedbackForm />} />
        <Route path="/user/HomeforFeedback/:hospitalId" element={<PublicFeedbackHome />} />
        <Route path='admin/feedback/edit/:id' element={<EditFeedback />} />
        <Route path="/admin/assignperson" element={<AdminAssignPage />} />
        <Route path='mailPerson/getFeedbackResponsesByToken/:token' element={<SecureFeedbackView />} />
        <Route path='/admin/changeHospitaltheme' element={<ChangeTheme />} />
        {/*<Route path="/complaints" element={<ComplaintBoard />} />
        <Route path="/complaints/new" element={<ComplaintBuilder />} />
        <Route path="/complaints/:categoryId" element={<ComplaintForm />} />
        <Route path="/complaints/:categoryId/view/:complaintId" element={<ComplaintView />} />
        <Route path="/user/feedback/:categoryId" element={<UserFeedbackForm />} />
        <Route path="/admin/responses" element={<AdminResponses />} />
        <Route path="/theme" element={<ThemeSettings />} /> */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default App
