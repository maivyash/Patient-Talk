import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './AdminLayout.css'

const HOSPITALS = [
  { id: 'boston-memorial', name: 'Boston Memorial Hospital' },
  { id: 'saint-marys', name: "Saint Mary's Hospital" },
  { id: 'city-general', name: 'City General Hospital' },
  { id: 'metro-health', name: 'Metro Health Center' },
  { id: 'community-care', name: 'Community Care Hospital' },
]

export default function SuperAdminDashboard() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')

  const filteredHospitals = HOSPITALS.filter((hospital) =>
    hospital.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="admin-page">
      {/* Navbar */}
      <nav className="admin-navbar">
        <div className="admin-nav-left"></div>
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
        <div className="admin-nav-right">
          <div className="admin-header-badge" style={{ margin: 0 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
            Super Admin
          </div>
        </div>
      </nav>

      <div className="admin-content admin-content--wide">
        <div className="admin-page-header">
          <div className="admin-header-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18"/><path d="M5 21V7l8-4v18"/><path d="M19 21V11l-6-4"/></svg>
            Hospital Directory
          </div>
          <h1 className="admin-page-title">List of Hospitals</h1>
          <p className="admin-page-subtitle">Manage and view all registered hospitals</p>
        </div>

        {/* Search */}
        <div className="admin-glass-card" style={{ padding: '16px 20px', marginBottom: '24px' }}>
          <input
            type="text"
            placeholder="Search by Name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: '12px',
              border: '1px solid rgba(28,110,115,0.12)',
              outline: 'none',
              fontSize: '15px',
              background: 'rgba(255,255,255,0.6)',
              color: 'var(--text-main, #0b1c28)',
              fontFamily: 'inherit'
            }}
          />
        </div>

        {/* Hospital List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredHospitals.map((hospital) => (
            <div key={hospital.id} className="admin-glass-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ fontWeight: 600, fontSize: '16px', color: 'var(--text-main)' }}>{hospital.name}</div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button className="admin-back-btn" style={{ transform: 'none' }}
                  onClick={() => navigate(`/super-admin/hospital/${hospital.id}/feedbacks`)}
                >View Feedbacks</button>
                <button className="admin-back-btn" style={{ transform: 'none' }}
                  onClick={() => navigate(`/super-admin/hospital/${hospital.id}/complaints`)}
                >All Forms</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <footer className="admin-footer">
        <p className="admin-footer-text">Powered by PatientTalkback</p>
      </footer>
    </div>
  )
}
