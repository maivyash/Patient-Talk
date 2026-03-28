import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const BACKENDURL = import.meta.env.VITE_BACKENDURL;

export default function SuperAdminComplaintList() {
    const navigate = useNavigate();
    const { hospitalId, formId } = useParams();
    const [formData, setFormData] = useState(null);
    const [feedbacks, setFeedbacks] = useState([]);
    const [selectedResponse, setSelectedResponse] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFormAndResponses = async () => {
            try {
                setLoading(true);
                // Fetch Form details
                const formRes = await fetch(`${BACKENDURL}/api/superadmin/feedbacks/${formId}`, { credentials: 'include' });
                const formDataPayload = await formRes.json();
                if (formDataPayload.success) {
                    setFormData(formDataPayload.data);
                } else {
                    if (formRes.status === 412) return navigate("/login");
                }

                // Fetch Responses
                const responsesRes = await fetch(`${BACKENDURL}/api/superadmin/feedbacks/${formId}/responses`, { credentials: 'include' });
                const responsesPayload = await responsesRes.json();
                if (responsesPayload.success) {
                    setFeedbacks(responsesPayload.data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchFormAndResponses();
    }, [formId, navigate]);

    const handleViewComplaint = (response) => {
        setSelectedResponse(response);
    };

    return (
        <div className="screen" style={{ background: '#9ed6df', minHeight: '100vh', padding: '20px' }}>
            <header className="header header--top" style={{ padding: '20px', display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                <div className="brand" style={{ textAlign: 'center' }}>
                    <span className="brand-text" style={{ fontSize: '24px', fontWeight: 'bold' }}>Patienttalkback.com</span>
                    <div style={{ color: '#ffeb3b', fontSize: '30px', marginTop: '10px' }}>★</div>
                </div>
            </header>

            {/* Form Details Header */}
            {formData && (
                <div style={{ maxWidth: '1000px', margin: '0 auto 20px', background: 'rgba(255,255,255,0.8)', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
                    <h2 style={{
                        margin: '0 0 10px 0',
                        color: formData.isDeleted ? 'red' : '#1c6e73'
                    }}>
                        FORM: {formData.feedback_name}
                        {formData.isDeleted && (
                            <span style={{ marginLeft: '10px', fontSize: '14px' }}>
                                (DELETED)
                            </span>
                        )}
                    </h2>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
                        {formData.questions?.map((q, idx) => (
                            <div key={q._id || idx} style={{ background: '#7baeb5', padding: '5px 10px', borderRadius: '4px', fontSize: '12px', color: '#fff' }}>
                                Q{idx + 1}: {q.text}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <main className="panel panel--wide split-view-container" style={{ background: 'transparent', boxShadow: 'none' }}>
                <div className="split-view" style={{ display: 'flex', gap: '30px', maxWidth: '1000px', margin: '0 auto' }}>

                    {/* Left Panel - Feedback List */}
                    <div className="complaint-list-panel" style={{ flex: 1 }}>
                        <div className="hospital-name-box" style={{ background: '#7baeb5', padding: '10px 20px', fontWeight: 'bold', marginBottom: '30px', textAlign: 'center', color: '#fff' }}>
                            RESPONSES FOR THIS FORM
                        </div>
                        {loading ? <p>Loading...</p> : (
                            <div className="complaints-list-view" style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxHeight: '600px', overflowY: 'auto', paddingRight: '10px' }}>
                                {feedbacks.length === 0 ? <p style={{ background: 'rgba(255,255,255,0.6)', padding: '15px', borderRadius: '8px' }}>No feedbacks available for this form.</p> : null}
                                {feedbacks.map((f, i) => (
                                    <div key={f._id} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                        <div style={{ background: selectedResponse?._id === f._id ? '#455a64' : '#7baeb5', padding: '15px', flex: 1, borderRadius: '4px', color: '#fff', transition: '0.3s', color: f.isDeleted ? '#f44336' : '#04ff00ff' }}>
                                            {f.isDeleted ? " COMPLAINT (deleted)" : "COMPLAINT"} {i + 1}
                                            <div style={{ fontSize: '11px', marginTop: '5px' }}>{new Date(f.createdAt).toLocaleString()}</div>
                                        </div>
                                        <button
                                            type="button"
                                            style={{ background: '#54878a', color: 'white', border: 'none', padding: '15px 25px', borderRadius: '4px', cursor: 'pointer' }}
                                            onClick={() => handleViewComplaint(f)}
                                        >
                                            View
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right Panel - Feedback Details */}
                    <div className="feedback-form-panel" style={{ flex: 1, paddingLeft: '30px' }}>
                        <div className="hospital-name-box-small" style={{ background: '#7baeb5', padding: '10px 20px', fontWeight: 'bold', marginBottom: '30px', textAlign: 'center', color: '#fff' }}>
                            DETAILS
                        </div>

                        {selectedResponse ? (
                            <div className="complaint-view-body" style={{ background: 'rgba(255,255,255,0.8)', padding: '20px', borderRadius: '8px', maxHeight: '600px', overflowY: 'auto' }}>
                                {selectedResponse.responses && selectedResponse.responses.map((r, i) => {
                                    // Find the corresponding question in the form to display the question text above the answer
                                    const questionData = formData?.questions?.find(q => String(q._id) === String(r.questionId));
                                    const questionText = questionData?.text || r.questionText || `Question ${i + 1}`;

                                    return (
                                        <div key={i} className="complaint-view-question" style={{ marginBottom: '20px', borderBottom: '1px solid #ccc', paddingBottom: '15px' }}>
                                            <p style={{ margin: '0 0 10px 0', fontSize: '15px', color: '#1c6e73', fontWeight: 'bold' }}>
                                                {questionText}
                                            </p>
                                            {r.answerType === 'text' && (
                                                <div className="answer-box" style={{ background: 'white', padding: '15px', minHeight: '60px', borderRadius: '4px' }}>
                                                    {r.answerText || 'No text provided'}
                                                </div>
                                            )}
                                            {r.answerType === 'voice' && (
                                                <div className="audio-bar" style={{ display: 'flex', alignItems: 'center', background: '#f5f5f5', padding: '10px 15px', borderRadius: '30px', gap: '10px' }}>
                                                    <div style={{ flex: 1, height: '4px', background: '#ccc', borderRadius: '2px' }} />
                                                    <span style={{ fontSize: '20px', cursor: 'pointer' }}>▶</span>
                                                    {r.mediaUrl ? (
                                                        <a href={BACKENDURL + r.mediaUrl} target="_blank" rel="noreferrer" style={{ fontSize: '12px', background: '#1c6e73', color: 'white', padding: '4px 8px', borderRadius: '4px', textDecoration: 'none' }}>Play Audio Response</a>
                                                    ) : 'No Audio'}
                                                </div>
                                            )}
                                            {r.answerType === 'rating' && (
                                                <div className="answer-box" style={{ background: 'white', padding: '15px', borderRadius: '4px', fontSize: '20px' }}>
                                                    ⭐ {r.ratingValue}/5
                                                </div>
                                            )}
                                            {r.answerType === 'emoji' && (
                                                <div className="answer-box" style={{ background: 'white', padding: '15px', borderRadius: '4px', fontSize: '20px' }}>
                                                    Emoji Score: {r.ratingValue}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div style={{ padding: '40px 20px', background: 'rgba(255,255,255,0.4)', textAlign: 'center', borderRadius: '8px' }}>
                                Select a complaint to view feedback details
                            </div>
                        )}

                        {/* Back button */}
                        <div style={{ marginTop: '20px', textAlign: 'center' }}>
                            <button
                                onClick={() => navigate(`/super-admin/hospital/${hospitalId}/complaints`, { replace: true })}
                                style={{ background: '#333', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', marginRight: '10px' }}
                            >Back to Forms list</button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
