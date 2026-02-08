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
  useEffect(() => {
    // TODO: API later
    setComplaints([]);
  }, []);

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
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        questions,
        isActive,
      }),
    });

    if (res.ok) {
      alert("Feedback updated");
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

  if (loading) return <p className="center">Loading...</p>;

  return (
    <div className="edit-feedback-page">
      <h2>⭐ Patienttalkback.com</h2>
      <h3>{feedback.department_name}</h3>

      {/* EXISTING QUESTIONS */}
      {questions.map((q, i) => (
        <div key={i} className="question-row">
          <span>{`QUESTION ${i + 1} (ALREADY IN FORM)`}</span>
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

      {/* COMPLAINTS (FUTURE) */}
      <h4>COMPLAINTS OR FEEDBACK</h4>
      {complaints.length === 0 ? (
        <p className="muted">No complaints loaded yet</p>
      ) : (
        complaints.map((c, i) => (
          <div key={i} className="complaint-row">
            COMPLAINT <button>View</button>
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

      <button className="secondary">
        DOWNLOAD FEEDBACK QR
      </button>
    </div>
  );
}
