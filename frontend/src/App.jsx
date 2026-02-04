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

function App() {
  return (
    <div className="app-root">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/hospital/:hospitalId" element={<HospitalLanding />} />
        <Route path="/hospital/:hospitalId/feedback" element={<FeedbackForm />} />
        <Route path="/super-admin/login" element={<SuperAdminLogin />} />
        <Route path="/super-admin/dashboard" element={<SuperAdminDashboard />} />
        <Route path="/super-admin/hospital/:hospitalId/complaints" element={<SuperAdminComplaintBoard />} />
        <Route path="/super-admin/hospital/:hospitalId/complaints/:categoryId" element={<SuperAdminComplaintList />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/hospital/login" element={<HospitalLogin />} />
        <Route path="/user/login" element={<UserLogin />} />
        <Route path="/admin/register" element={<AdminRegister />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/complaints" element={<ComplaintBoard />} />
        <Route path="/complaints/new" element={<ComplaintBuilder />} />
        <Route path="/complaints/:categoryId" element={<ComplaintForm />} />
        <Route path="/complaints/:categoryId/view/:complaintId" element={<ComplaintView />} />
        <Route path="/user/feedback/:categoryId" element={<UserFeedbackForm />} />
        <Route path="/admin/responses" element={<AdminResponses />} />
        <Route path="/theme" element={<ThemeSettings />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default App
