import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const HOSPITALS = [
  { id: 'boston-memorial', name: 'Boston Memorial Hospital' },
  { id: 'saint-marys', name: 'Saint Mary\'s Hospital' },
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
    <div className="screen">
      <header className="header header--top">
        <div className="brand">
          <span className="brand-mark star" />
          <span className="brand-text">Patienttalkback.com</span>
        </div>
        <div className="header-actions">
          <div className="avatar-circle" />
        </div>
      </header>

      <main className="panel panel--wide super-admin-dashboard">
        <div className="dashboard-header">
          <div className="star-icon-large">★</div>
          <h1 className="panel-title">List of Hospitals</h1>
        </div>

        <div className="search-section">
          <input
            type="text"
            className="input search-input"
            placeholder="Search by Name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="hospitals-list">
          {filteredHospitals.map((hospital) => (
            <div key={hospital.id} className="hospital-entry">
              <div className="hospital-name">{hospital.name}</div>
              <div className="hospital-actions">
                <button
                  type="button"
                  className="btn btn--secondary hospital-action-btn"
                  onClick={() => navigate(`/super-admin/hospital/${hospital.id}/feedbacks`)}
                >
                  View All Feedbacks
                </button>
                <button
                  type="button"
                  className="btn btn--secondary hospital-action-btn"
                  onClick={() => navigate(`/super-admin/hospital/${hospital.id}/complaints`)}
                >
                  All Feedbacks Forms
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

