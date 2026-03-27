import React, { useEffect, useState } from "react";
import "./EditFeedback.css";
import "./AdminLayout.css";
import { useNavigate, useParams } from "react-router-dom";


const BACKENDURL = import.meta.env.VITE_BACKENDURL;

export default function EditFeedback() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [feedback, setFeedback] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [complaints, setComplaints] = useState([]); // future
  const [loading, setLoading] = useState(true);

  // 🔹 Load feedback
  useEffect(() => {
    fetch(`${BACKENDURL}/api/admin/getfeedbackform/${id}`, {
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setFeedback(data.data);
          setQuestions(data.data.questions || []);
          setIsActive(data.data.isActive);
        }
        setLoading(false);
      });
  }, [id]);

  // 🔹 Stub: complaints (future)
// 🔹 Load complaints (responses)
useEffect(() => {
  const fetchComplaints = async () => {
    try {
      const res = await fetch(
        `${BACKENDURL}/api/admin/feedbackResponces/${id}`,
        { credentials: "include" }
      );

      if (res.status === 401 || res.status === 412) {
        alert("Session expired. Please log in again.");
        navigate("/login", { replace: true });
        return;
      }

      const data = await res.json();
      if (data.success) {
        setComplaints(data.data);
      }
    } catch (err) {
      console.error("Failed to load complaints", err);
    }
  };

  fetchComplaints();
}, [id, navigate]);

const deleteComplaint = async (responseId) => {
  const confirm = window.confirm("Delete this complaint permanently?");
  if (!confirm) return;

  try {
    const res = await fetch(
      `${BACKENDURL}/api/admin/deletefeedbackresponse/${responseId}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );

    const data = await res.json();

    if (!res.ok) {
      return alert(data.message || "Failed to delete complaint");
    }

    // 🔄 Remove from UI immediately
    setComplaints((prev) =>
      prev.filter((c) => c._id !== responseId)
    );

    alert("Complaint deleted");
  } catch (err) {
    alert("Server error while deleting complaint");
  }
};

  const addQuestion = () => {
    if (!newQuestion.trim()) return alert("Question cannot be empty");

    setQuestions([...questions, { text: newQuestion }]);
    setNewQuestion("");
  };

  const removeQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const saveChanges = async () => {
    if (questions.length === 0) {
      return alert("At least one question is required");
    }

    const res = await fetch(`${BACKENDURL}/api/admin/updatefeedbackform/${id}`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        questions,
        isActive,
      }),
    });
    if (!res.ok) {
const data = await res.json();
return alert(data.message || "Update failed");
navigate("/admin/dashboard",{ replace: true });
    }
    if (res.status === 412) {
const data = await res.json();
return alert(data.message || "Invalid or expired token");
navigate("/login",{ replace: true });
      
    }

    if (res.status === 200) {
      alert("Feedback updated");
      navigate("/admin/dashboard",{ replace: true });

    } else {
      alert("Update failed");
    }
  };

  const deleteFeedback = async () => {
    if (!window.confirm("Delete this feedback permanently?")) return;

    await fetch(`${BACKENDURL}/api/admin/deletefeedbackform/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    navigate("/admin/dashboard");
  };

  const downloadQR = async () => {
  const res = await fetch(
    `${BACKENDURL}/api/admin/feedback/${id}/qr`,
    { credentials: "include" }
  );
  console.log("DOWNLOADED");
  
  
  if(res.status === 412){
    const data = await res.json();
    alert(data.message || "Invalid or expired token");
    return navigate("/login",{ replace: true });
  }

  if (res.status !== 200) {
    const data = await res.json();
    return alert(data.message || "Failed to generate QR code");
  }
  if (!res.ok) {
    const data = await res.json();
    return alert(data.message || "Failed to generate QR code");
  }
  if (res.status === 200) {
      const data = await res.json();

  const link = document.createElement("a");
  link.href = data.qr;
  link.download = "feedback-qr.png";
  link.click();
  }

};


  if (loading) return <p className="center">Loading...</p>;

  return (
    <div className="admin-page">
      {/* Navbar */}
      <nav className="admin-navbar">
        <div className="admin-nav-left">
          <button className="admin-back-btn" onClick={() => navigate('/admin/dashboard')}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
            Dashboard
          </button>
        </div>
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
        <div className="admin-nav-right"></div>
      </nav>

      <div className="admin-content">
        <div className="admin-page-header">
          <div className="admin-header-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            Edit Form
          </div>
          <h1 className="admin-page-title">{feedback?.feedback_name || "Edit Feedback"}</h1>
        </div>

      <div className="form-container">
        {/* EXISTING QUESTIONS */}
        <div className="section">
          <h4>Existing Questions</h4>
          {questions.length === 0 ? (
            <p className="muted">No questions available</p>
          ) : (
            questions.map((q, i) => (
              <div key={i} className="question-row">
                <span>{q.text}</span>
                <button onClick={() => removeQuestion(i)}>Remove</button>
              </div>
            ))
          )}
        </div>

        <div className="divider">OR</div>

        {/* ADD QUESTION */}
        <div className="section add-question-section">
          <h4>Add New Question</h4>
          <input
            placeholder="Enter new question text"
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addQuestion()}
          />
          <button onClick={addQuestion}>Add Question</button>
        </div>

        {/* COMPLAINTS / FEEDBACK RESPONSES */}
        <div className="section complaints-section">
          <h4 className="complaints-title">Complaints / Feedback Responses</h4>
          {complaints.length === 0 ? (
            <p className="muted">No complaints submitted yet</p>
          ) : (
            complaints.map((complaint, idx) => (
              <div key={complaint._id} className="complaint-box">
                <h5 className="complaint-header">Complaint #{idx + 1}</h5>
                {complaint.responses.map((r, qIdx) => (
                  <div key={qIdx} className="complaint-question">
                    <p className="question-text">
                      Q{qIdx + 1}. {questions.find(q => q._id === r.questionId)?.text || "Question"}
                    </p>
                    {/* TEXT */}
                    {r.answerType === "text" && (
                      <div className="text-answer-box">{r.answerText}</div>
                    )}
                    {/* RATING */}
                    {r.answerType === "rating" && (
                      <div className="rating-stars">{"⭐".repeat(r.ratingValue || 0)}</div>
                    )}
                    {/* IMAGE */}
                    {r.answerType === "image" && (
                      <button
                        className="view-btn"
                        onClick={() => window.open(`${BACKENDURL}${r.mediaUrl}`, "_blank")}
                      >
                        View Image
                      </button>
                    )}
                    {/* VIDEO */}
                    {r.answerType === "video" && (
                      <button
                        className="view-btn"
                        onClick={() => window.open(`${BACKENDURL}${r.mediaUrl}`, "_blank")}
                      >
                        View Video
                      </button>
                    )}
                    {/* AUDIO */}
                    {r.answerType === "audio" && (
                      <audio
                        controls
                        className="audio-player"
                        src={`${BACKENDURL}${r.mediaUrl}`}
                      />
                    )}
                  </div>
                ))}
                <button
                  className="delete-complaint-btn"
                  onClick={() => deleteComplaint(complaint._id)}
                  title="Delete complaint"
                >
                  🗑
                </button>
                <p className="created-at">
                  Created at: {new Date(complaint.createdAt).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>

        {/* TOGGLES */}
        <div className="section">
          <div className="toggle-row">
            <span>Close Feedback Temporarily</span>
            <input
              type="checkbox"
              checked={!isActive}
              onChange={() => setIsActive(!isActive)}
            />
          </div>
        </div>

        {/* ACTIONS */}
        <div className="section actions-section">
          <button className="danger" onClick={deleteFeedback}>
            Delete Whole Feedback
          </button>
          <button className="primary" onClick={saveChanges}>
            Save Changes
          </button>
          <button className="secondary" onClick={downloadQR}>
            Download Feedback QR
          </button>
        </div>
        </div>
      </div>

      <footer className="admin-footer">
        <p className="admin-footer-text">Powered by PatientTalkback</p>
      </footer>
    </div>
  );
}
