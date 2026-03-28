import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminLayout.css';

const BACKENDURL = import.meta.env.VITE_BACKENDURL;

export default function SuperAdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('hospitals'); // 'hospitals' or 'logs'
  const [searchQuery, setSearchQuery] = useState('');
  
  const [hospitals, setHospitals] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHospitals = async () => {
    try {
      const res = await fetch(`${BACKENDURL}/api/superadmin/hospitals`, { credentials: "include" });
      const data = await res.json();
      if (data.success) {
        setHospitals(data.data);
      } else {
        if(res.status === 412) navigate("/login");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchLogs = async () => {
    try {
      const res = await fetch(`${BACKENDURL}/api/superadmin/logs`, { credentials: "include" });
      const data = await res.json();
      if (data.success) setLogs(data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const initFetch = async () => {
      setLoading(true);
      await fetchHospitals();
      await fetchLogs();
      setLoading(false);
    };
    initFetch();
  }, [navigate]);

  const toggleHospitalStatus = async (id, currentStatus) => {
    try {
      const res = await fetch(`${BACKENDURL}/api/superadmin/hospitals/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ isActive: !currentStatus })
      });
      const data = await res.json();
      if (data.success) {
        fetchHospitals(); // refresh
      }
    } catch (err) {
      console.error(err);
    }
  };

  const [selectedHospital, setSelectedHospital] = useState(null);

  const filteredHospitals = hospitals.filter((h) => 
    h.hospital_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    h.location?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="admin-page" style={{ background: '#9ed6df' }}>
      {/* Navbar */}
      <nav className="admin-navbar">
        <div className="admin-nav-left"></div>
        <div className="admin-nav-center">
          <div className="admin-brand">
            <span className="admin-brand-icon-svg" style={{ fontSize: '24px', color: '#ffeb3b', textShadow: '0 0 5px rgba(0,0,0,0.2)' }}>
              ★
            </span>
            <span className="admin-brand-name" style={{ color: '#000', fontWeight: 'bold' }}>Patienttalkback.com</span>
          </div>
        </div>
        <div className="admin-nav-right">
          <button style={{ 
            background: '#333', color: '#fff', border: 'none', padding: '6px 16px', borderRadius: '4px', cursor: 'pointer' 
          }} onClick={() => navigate('/login')}>Logout</button>
        </div>
      </nav>

      <div className="admin-content admin-content--wide" style={{ maxWidth: '800px', margin: '0 auto', paddingTop: '20px' }}>
        
        {/* Tab Selection */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <button 
            style={{ flex: 1, padding: '12px', background: activeTab === 'hospitals' ? '#1c6e73' : 'rgba(255,255,255,0.6)', color: activeTab === 'hospitals' ? '#fff' : '#000', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
            onClick={() => setActiveTab('hospitals')}>
            List of Hospitals
          </button>
          <button 
            style={{ flex: 1, padding: '12px', background: activeTab === 'logs' ? '#1c6e73' : 'rgba(255,255,255,0.6)', color: activeTab === 'logs' ? '#fff' : '#000', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
            onClick={() => setActiveTab('logs')}>
            System Logs
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>Loading...</div>
        ) : (
          <>
            {activeTab === 'hospitals' && (
              <div>
                <input
                  type="text"
                  placeholder="Search by Name or City/Location"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ width: '100%', padding: '12px', marginBottom: '20px', border: 'none', background: 'rgba(255,255,255,0.8)', textAlign: 'center', borderRadius: '4px' }}
                />

                {selectedHospital && (
                  <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', marginBottom: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', position: 'relative' }}>
                    <button 
                      onClick={() => setSelectedHospital(null)} 
                      style={{ position: 'absolute', top: '10px', right: '10px', background: 'transparent', border: 'none', fontSize: '18px', cursor: 'pointer' }}
                    >✖</button>
                    <h3 style={{ marginTop: 0 }}>Hospital Details</h3>
                    <p><strong>Name:</strong> {selectedHospital.hospital_name}</p>
                    <p><strong>Email:</strong> {selectedHospital.hospital_email}</p>
                    <p><strong>Phone:</strong> {selectedHospital.hospital_phno}</p>
                    <p><strong>Location:</strong> {selectedHospital.location}</p>
                    <p><strong>Status:</strong> {selectedHospital.isActive ? 'Active' : 'Deactivated'}</p>
                    <p><strong>Created At:</strong> {new Date(selectedHospital.createdAt).toLocaleString()}</p>
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {filteredHospitals.map(h => (
                    <div key={h._id} style={{ background: 'rgba(255,255,255,0.6)', padding: '15px', display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: h.isActive ? 1 : 0.6, borderRadius: '8px' }}>
                      <h3 
                        style={{ margin: '0 0 10px 0', fontSize: '18px', cursor: 'pointer', textDecoration: 'underline', color: '#1c6e73' }}
                        onClick={() => setSelectedHospital(h)}
                        title="View details"
                      >
                        {h.hospital_name} {h.isActive === false && '(Deactivated)'}
                      </h3>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button 
                          style={{ background: '#455a64', color: 'white', border: 'none', padding: '6px 12px', cursor: 'pointer', fontSize: '12px', borderRadius: '4px' }}
                          onClick={() => navigate(`/super-admin/hospital/${h._id}/complaints`)}
                        >View Feedback Forms</button>
                        <button 
                          style={{ background: h.isActive ? '#d32f2f' : '#388e3c', color: 'white', border: 'none', padding: '6px 12px', cursor: 'pointer', fontSize: '12px', borderRadius: '4px' }}
                          onClick={() => toggleHospitalStatus(h._id, h.isActive)}
                        >{h.isActive ? 'Deactivate' : 'Activate'}</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'logs' && (
              <div style={{ background: 'rgba(255,255,255,0.9)', padding: '20px', borderRadius: '8px' }}>
                <h3 style={{ marginTop: 0 }}>System Logs</h3>
                <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
                  {logs.length === 0 ? <p>No logs found.</p> : null}
                  {logs.map((log, idx) => (
                    <div key={idx} style={{ borderBottom: '1px solid #ccc', padding: '10px 0', fontSize: '14px' }}>
                      <div style={{ fontWeight: 'bold', color: '#1c6e73' }}>
                        {new Date(log.timestamp).toLocaleString()} - [{log.type}]
                      </div>
                      <div style={{ color: '#333' }}>
                        {log.type === 'LOGIN' && `Hospital ${log.hospital_name || log.hospital_email} logged in.`}
                        {log.type === 'REGISTRATION' && `New hospital "${log.hospital_name}" registered.`}
                        {log.type === 'FORM_CREATED' && `Feedback form "${log.department_name}" created.`}
                        {log.type === 'FORM_EDITED' && `Feedback form ${log.feedbackId} edited.`}
                        {log.type === 'FEEDBACK_SUBMISSION' && `Feedback submitted for form ${log.feedbackId}.`}
                        {log.type === 'FEEDBACK_DELETED' && `Feedback form deleted.`}
                        {log.type === 'ERROR' && `Error: ${log.message}`}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
