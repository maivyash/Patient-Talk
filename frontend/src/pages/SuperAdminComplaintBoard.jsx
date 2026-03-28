import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const BACKENDURL = import.meta.env.VITE_BACKENDURL;

export default function SuperAdminComplaintBoard() {
    const navigate = useNavigate();
    const { hospitalId } = useParams();
    const [forms, setForms] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchForms = async () => {
            try {
                const res = await fetch(`${BACKENDURL}/api/superadmin/hospitals/${hospitalId}/feedbacks`, {
                    credentials: 'include'
                });
                const data = await res.json();
                if (data.success) {
                    setForms(data.data);
                } else {
                    if (res.status === 412) navigate("/login");
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchForms();
    }, [hospitalId, navigate]);

    return (
        <div className="screen" style={{ background: '#9ed6df', minHeight: '100vh', padding: '20px' }}>
            <header className="header header--top" style={{ padding: '20px', display: 'flex', justifyContent: 'center', marginBottom: '40px' }}>
                <div className="brand" style={{ textAlign: 'center' }}>
                    <span className="brand-text" style={{ fontSize: '24px', fontWeight: 'bold' }}>Patienttalkback.com</span>
                    <div style={{ color: '#ffeb3b', fontSize: '30px', marginTop: '10px' }}>★</div>
                </div>
            </header>

            <main className="panel panel--wide complaint-board" style={{ maxWidth: '800px', margin: '0 auto', background: 'rgba(255,255,255,0.8)', padding: '40px', borderRadius: '12px' }}>
                <div className="complaint-header-row" style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <div className="hospital-name-box" style={{ background: '#7baeb5', padding: '10px 20px', fontWeight: 'bold', display: 'inline-block', borderRadius: '4px' }}>
                        ALL EXISTING FEEDBACK FORMS
                    </div>
                </div>

                {loading ? <p style={{ textAlign: 'center' }}>Loading forms...</p> : (
                    <div className="complaint-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        {forms.map((form) => (
                            <div
                                key={form._id}
                                className="complaint-card"
                                onClick={() => navigate(`/super-admin/hospital/${hospitalId}/form/${form._id}`)}
                                style={{ background: form.isActive ? '#fff' : '#e0e0e0', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}
                            >
                                {form.logo_png ? (
                                    <img src={form.logo_png} alt={form.feedback_name} style={{ width: '80px', height: '80px', objectFit: 'contain', marginBottom: '15px' }} />
                                ) : (
                                    <div style={{ width: '80px', height: '80px', background: '#ccc', marginBottom: '15px', borderRadius: '50%' }} />
                                )}
                                <span
                                    className="complaint-label"
                                    style={{
                                        fontWeight: 'bold',
                                        fontSize: '18px',
                                        color: form.isDeleted ? 'red' : '#000',
                                        textDecoration: form.isDeleted ? 'line-through' : 'none',
                                        opacity: form.isDeleted ? 0.7 : 1
                                    }}
                                >
                                    {form.feedback_name}
                                    {form.isDeleted && (
                                        <span style={{ fontSize: '12px', marginLeft: '6px' }}>
                                            (DELETED)
                                        </span>
                                    )}
                                </span>
                                <span style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>Questions: {form.questions?.length || 0}</span>
                                <span style={{ fontSize: '12px', color: form.isActive ? '#4caf50' : '#f44336', marginTop: '5px' }}>Status: {form.isActive ? 'Active' : 'Archived'}</span>
                            </div>
                        ))}
                        {forms.length === 0 && <p style={{ gridColumn: '1 / -1', textAlign: 'center' }}>No feedback forms have been created yet by this hospital.</p>}
                    </div>
                )}

                <div style={{ marginTop: '40px', textAlign: 'center' }}>
                    <button
                        onClick={() => navigate('/superadmin/dashboard', { replace: true })}
                        style={{ background: '#333', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer' }}
                    >Back to Dashboard</button>
                </div>
            </main>
        </div>
    )
}
