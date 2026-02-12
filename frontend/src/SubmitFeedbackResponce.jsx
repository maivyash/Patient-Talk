import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const BACKENDURL = import.meta.env.VITE_BACKENDURL;

export default function PublicFeedbackForm() {
  const { id } = useParams();
  const [feedback, setFeedback] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${BACKENDURL}/api/user/getFeedbackByIdForUser/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setFeedback(data.data);
      });
  }, [id]);

  const submit = async () => {

    const payload = Object.entries(answers).map(([qId, ans]) => ({
      questionId: qId,
      answer: ans,
    }));
    setLoading(true);
    const res = await fetch(
      `${BACKENDURL}/api/user/submitFeedbackForUser/${id}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: payload }),
      }
    );
    if(res.status !== 200){
      alert("Error submitting feedback. Please try again later.");
      setLoading(false);
      return;
    }
    if(res.status === 412){
      alert("Unauthorized. Please check your input and try again.");
      setLoading(false);
      return;
    }
      
    if (res.ok) {
      alert("Thank you for your feedback!");
      setLoading(false);
    }
  };

  if (!feedback) return <p>Loading...</p>;
  if(loading) return <p>Submitting...</p>;

  return (
    <div>
      <h2>{feedback.department_name}</h2>

      {feedback.questions.map(q => (
        <div key={q._id}>
          <p>{q.text}</p>
          <input
            onChange={(e) =>
              setAnswers({ ...answers, [q._id]: e.target.value })
            }
          />
        </div>
      ))}

      <button onClick={submit}>Submit</button>
    </div>
  );
}
