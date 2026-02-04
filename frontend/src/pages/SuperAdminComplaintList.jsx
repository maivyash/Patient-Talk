import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const MOCK_COMPLAINTS = [
  { id: 1, category: 'care-team' },
  { id: 2, category: 'care-team' },
  { id: 3, category: 'care-team' },
]

const CATEGORY_LABELS = {
  'care-team': 'Care Team',
  'waiting-room': 'Waiting Room',
  'patient-room': 'Patient Room',
  'nurse-doctor': 'Nurse / Doctor',
  'lab-work': 'Lab Work',
  'billing': 'Billing',
  'services': 'Services',
  'hygiene': 'Hygiene',
}

const HOSPITAL_NAMES = {
  'boston-memorial': 'BOSTON MEMORIAL HOSPITAL',
  'saint-marys': 'SAINT MARY\'S HOSPITAL',
  'city-general': 'CITY GENERAL HOSPITAL',
  'metro-health': 'METRO HEALTH CENTER',
  'community-care': 'COMMUNITY CARE HOSPITAL',
}

export default function SuperAdminComplaintList() {
  const navigate = useNavigate()
  const { hospitalId, categoryId } = useParams()
  const [selectedComplaintId, setSelectedComplaintId] = useState(null)

  const hospitalName = HOSPITAL_NAMES[hospitalId] || 'HOSPITAL'
  const categoryLabel = CATEGORY_LABELS[categoryId] || 'Category'

  const handleViewComplaint = (complaintId) => {
    setSelectedComplaintId(complaintId)
  }

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

      <main className="panel panel--wide split-view-container">
        <div className="hospital-header-box">
          <div className="hospital-name-box">
            {hospitalName}
          </div>
        </div>

        <div className="split-view">
          {/* Left Panel - Complaint List */}
          <div className="complaint-list-panel">
            <h2 className="panel-title">Complaints</h2>
            <div className="complaints-list-view">
              {MOCK_COMPLAINTS.map((complaint) => (
                <div key={complaint.id} className="complaint-list-item">
                  <div className="complaint-pill">COMPLAINT</div>
                  <button
                    type="button"
                    className="btn btn--secondary complaint-view-btn-small"
                    onClick={() => handleViewComplaint(complaint.id)}
                  >
                    View
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel - Feedback Form */}
          <div className="feedback-form-panel">
            <div className="hospital-name-box-small">
              {hospitalName}
            </div>
            {selectedComplaintId ? (
              <div className="complaint-view-body">
                <div className="complaint-view-question">
                  <p>Question 1</p>
                  <div className="answer-box">Ans</div>
                </div>

                <div className="complaint-view-question">
                  <p>Question 2</p>
                  <div className="audio-bar">
                    <span className="audio-icon">🗑</span>
                    <div className="audio-track" />
                    <button type="button" className="audio-play-btn">▶</button>
                    <span className="audio-icon">🎤</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="no-selection-message">
                Select a complaint to view feedback
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

