import { useNavigate } from 'react-router-dom'

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="screen screen--centered">
      <header className="header">
        <div className="brand">
          <span className="brand-text">Patienttalkback.com</span>
        </div>
      </header>

      <main className="panel panel--narrow panel--logo">
        <div className="logo-hero">
          <div className="logo-symbol" />
          <div className="logo-hospital-name">BOSTON MEMORIAL HOSPITAL</div>
        </div>

        <div className="button-stack button-stack--spaced">
          <button
            type="button"
            className="btn btn--primary btn--full"
            onClick={() => navigate('/super-admin/login')}
          >
            Super Admin Login
          </button>
          <button
            type="button"
            className="btn btn--secondary btn--full"
            onClick={() => navigate('/admin/login')}
          >
            Admin Login
          </button>
          <button
            type="button"
            className="btn btn--primary-outline btn--full"
            onClick={() => navigate('/hospital/login')}
          >
            Hospital Login
          </button>
          <button
            type="button"
            className="btn btn--secondary btn--full"
            onClick={() => navigate('/user/login')}
          >
            User Login
          </button>
        </div>
      </main>
    </div>
  )
}

