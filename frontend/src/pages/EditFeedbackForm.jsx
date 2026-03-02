import React, { useEffect, useState } from "react";
import "./EditFeedback.css";
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
    <div className="edit-feedback-page">
      <h2>⭐ Patienttalkback.com</h2>
      <h3>{feedback.department_name}</h3>

      {/* EXISTING QUESTIONS */}
      {questions.map((q, i) => (
        <div key={i} className="question-row">
          <span>{`${q.text} \t \t(ALREADY IN FORM)`}</span>
          <button onClick={() => removeQuestion(i)}>🗑</button>
        </div>
      ))}

      <div className="divider">OR</div>

      {/* ADD QUESTION */}
      <h4>ADD QUESTION</h4>
      <input
        placeholder="Enter Question text"
        value={newQuestion}
        onChange={(e) => setNewQuestion(e.target.value)}
      />
      <button onClick={addQuestion}>ADD</button>

      {/* COMPLAINTS */}
<h4>COMPLAINTS / FEEDBACK RESPONSES</h4>

{/* COMPLAINTS OR FEEDBACK */}
<h4 className="complaints-title">COMPLAINTS OR FEEDBACK</h4>

{complaints.length === 0 ? (
  <p className="muted">No complaints submitted yet</p>
) : (
  complaints.map((complaint, idx) => (
    <div key={complaint._id} className="complaint-box">
      
      <h5 className="complaint-header">
        Complaint #{idx + 1}
      </h5>

      {complaint.responses.map((r, qIdx) => (
        <div key={qIdx} className="complaint-question">
          
          <p className="question-text">
            Q{qIdx + 1}. {questions.find(q => q._id === r.questionId)?.text || "Question"}
          </p>

          {/* TEXT */}
          {r.answerType === "text" && (
            <div className="text-answer-box">
              {r.answerText}
            </div>
          )}

          {/* RATING */}
          {r.answerType === "rating" && (
            <div className="rating-stars">
              {"⭐".repeat(r.ratingValue || 0)}
            </div>
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



      {/* TOGGLES */}
      <div className="toggle-row">
        <span>CLOSE FEEDBACK TEMPORARILY</span>
        <input
          type="checkbox"
          checked={!isActive}
          onChange={() => setIsActive(!isActive)}
        />
      </div>

      {/* ACTIONS */}
      <button className="danger" onClick={deleteFeedback}>
        DELETE WHOLE FEEDBACK
      </button>

      <button className="primary" onClick={saveChanges}>
        SAVE CHANGES
      </button>

      <button className="secondary" onClick={downloadQR}>
        DOWNLOAD FEEDBACK QR
      </button>
    </div>
  );
}
