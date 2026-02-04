import { useNavigate } from 'react-router-dom'

const HOSPITALS = [
  { id: 'boston-memorial', name: 'Boston Memorial Hospital' },
  { id: 'saint-marys', name: 'Saint Mary\'s Hospital' },
  { id: 'city-general', name: 'City General Hospital' },
]

export default function AdminDashboard() {
  const navigate = useNavigate()

  return (
    <div className="screen">
      <header className="header header--top">
        <div className="brand">
          <span className="brand-mark" />
          <span className="brand-text">Patienttalkback.com</span>
        </div>
        <nav className="header-nav">
          <button
            type="button"
            className="link-button"
            onClick={() => navigate('/admin/responses')}
          >
            View Responses
          </button>
          <button
            type="button"
            className="btn btn--ghost"
            onClick={() => navigate('/')}
          >
            Logout
          </button>
        </nav>
      </header>

      <main className="panel panel--wide">
        <h1 className="panel-title">Hospital Forms</h1>
        <p className="panel-subtitle">
          Manage feedback forms, preview hospital pages and add questions.
        </p>

        <div className="card-grid">
          {HOSPITALS.map((h) => (
            <article key={h.id} className="admin-card">
              <h2 className="admin-card-title">{h.name}</h2>
              <p className="admin-card-subtitle">
                Configure feedback form and see how patients experience your page.
              </p>
              <div className="admin-card-actions">
                <button
                  type="button"
                  className="btn btn--secondary"
                  onClick={() => navigate(`/hospital/${h.id}`)}
                >
                  Preview Patient View
                </button>
                <button
                  type="button"
                  className="btn btn--primary-outline"
                  onClick={() => navigate('/admin/responses')}
                >
                  View Responses
                </button>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  )
}


