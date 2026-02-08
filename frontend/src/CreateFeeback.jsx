import React, { useState } from "react";
import "./CreateFeedback.css";
import { useNavigate } from "react-router-dom";

const BACKENDURL = import.meta.env.VITE_BACKENDURL;

export default function CreateFeedback() {
  const navigate = useNavigate();

  const [department, setDepartment] = useState("");
  const [image, setImage] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [questionText, setQuestionText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImage = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => setImage(reader.result);
    reader.readAsDataURL(file);
  };

  const addQuestion = () => {
    if (!questionText.trim()) return;
    setQuestions([...questions, { text: questionText }]);
    setQuestionText("");
  };

  const removeQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!department || questions.length === 0 || questions.some(q => !q.text.trim())||!image) {
      alert("Department name, logo and at least one question required");
      return;
    }

    setLoading(true);

    const res = await fetch(`${BACKENDURL}/api/admin/hospital/createFeedback`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        department_name: department,
        logo_png: image,
        questions,
      }),
    });
    if (res.status === 412 ) {
      alert("Session expired. Please log in again.");
      navigate("/login", { replace: true });
      return;
    }
    

    const data = await res.json();
    setLoading(false);
    if (res.status === 401 ) {
          alert(`ERROR:${data.message || "Unauthorized" }`);
          return
        }


    if (data.success) {
      alert("Feedback created");
      navigate("/admin/dashboard");
    } else {
      alert(data.message || "Failed");

    }
  };

  return (
    <div className="create-feedback-page">
      <h2>⭐ Patienttalkback.com</h2>

      <input
        className="input"
        placeholder="Add text label (Department)"
        value={department}
        onChange={(e) => setDepartment(e.target.value)}
      />

      <label className="upload-btn">
        Select Image
        <input type="file" hidden onChange={handleImage} />
      </label>

      <h4>ADD QUESTION</h4>

      <input
        className="input"
        placeholder="Enter Question text"
        value={questionText}
        onChange={(e) => setQuestionText(e.target.value)}
      />

      <button className="btn" onClick={addQuestion}>
        ADD
      </button>

      {questions.map((q, i) => (
        <div key={i} className="question-item">
          {i + 1}. {q.text}
          <span onClick={() => removeQuestion(i)}>❌</span>
        </div>
      ))}

      <button className="submit-btn" onClick={handleSubmit} disabled={loading}>
        {loading ? "Submitting..." : "SUBMIT"}
      </button>
    </div>
  );
}

