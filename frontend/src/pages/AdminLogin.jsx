import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
    isSuperAdmin: false,
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setCredentials((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: hook with backend auth route
    navigate('/complaints')
  }

  return (
    <div className="screen screen--centered">
      <header className="header">
        <div className="brand">
          <span className="brand-mark" />
          <span className="brand-text">Patienttalkback.com</span>
        </div>
      </header>

      <main className="panel panel--narrow">
        <h1 className="panel-title">Admin</h1>

        <form className="form" onSubmit={handleSubmit}>
          <div className="form-row">
            <label className="form-label">
              Email
              <input
                required
                type="email"
                name="email"
                className="input"
                value={credentials.email}
                onChange={handleChange}
              />
            </label>
          </div>
          <div className="form-row">
            <label className="form-label">
              Password
              <input
                required
                type="password"
                name="password"
                className="input"
                value={credentials.password}
                onChange={handleChange}
              />
            </label>
          </div>

          <div className="form-row form-row--inline">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="isSuperAdmin"
                checked={credentials.isSuperAdmin}
                onChange={handleChange}
              />
              <span>Super Admin</span>
            </label>
          </div>

          <div className="form-row form-row--inline form-row--space-between">
            <button
              type="button"
              className="link-button"
              onClick={() => navigate('/admin/register')}
            >
              new here? Register
            </button>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn--primary btn--full">
              Login
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}


