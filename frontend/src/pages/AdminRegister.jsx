import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function AdminRegister() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    hospitalName: '',
    email: '',
    phone: '',
    password: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: hook up with backend hospital / super admin registration
    navigate('/admin/login')
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
        <h1 className="panel-title">Register</h1>

        <form className="form" onSubmit={handleSubmit}>
          <div className="form-row">
            <label className="form-label">
              Hospital Name
              <input
                required
                type="text"
                name="hospitalName"
                className="input"
                value={form.hospitalName}
                onChange={handleChange}
              />
            </label>
          </div>

          <div className="form-row">
            <label className="form-label">
              Hospital Logo
              <div className="input input--file">
                <span className="input-file-icon">⬆</span>
                <span className="input-file-text">Upload logo</span>
                <input
                  type="file"
                  name="logo"
                  accept="image/*"
                  className="input-file-hidden"
                />
              </div>
            </label>
          </div>

          <div className="form-row">
            <label className="form-label">
              Email
              <input
                required
                type="email"
                name="email"
                className="input"
                value={form.email}
                onChange={handleChange}
              />
            </label>
          </div>

          <div className="form-row">
            <label className="form-label">
              Phone Number
              <input
                required
                type="tel"
                name="phone"
                className="input"
                value={form.phone}
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
                value={form.password}
                onChange={handleChange}
              />
            </label>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn--primary btn--full">
              Register
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}


