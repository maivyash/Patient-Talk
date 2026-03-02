import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./SecureFeedbackView.css";

const BACKENDURL = import.meta.env.VITE_BACKENDURL;

export default function SecureFeedbackView() {
  const { token } = useParams();

  const [response, setResponse] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

 useEffect(() => {
  const loadResponse = async () => {
    try {
      const res = await fetch(
        `${BACKENDURL}/api/user/getFeedbackResponsesByToken/${token}`
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || "Link expired or unauthorized");
        return;
      }

      // ✅ SINGLE response document
      setResponse(data.data);
      console.log(response);
      
    } catch (err) {
      console.log(err);
      
      setError("Failed to load feedback");
    } finally {
      setLoading(false);
    }
  };

  loadResponse();
}, [token]);

  if (loading) return <p className="center">Loading feedback...</p>;
  if (error) return <p className="center error">{error}</p>;
  if(!response) return <p>NO RESPONCE FOUND</p>
  return (
   <div className="secure-feedback-page">
    <h2>⭐ Patienttalkback.com</h2>
    <h3>Feedback Response</h3>

    {/* Submitted time */}
    <p className="submitted-at">
      Submitted on: {new Date(response.createdAt).toLocaleString()}
    </p>

    {/* ANSWERS */}
    {response.responses.map((ans, idx) => (
      <div key={idx} className="answer-block">
        <p className="question-label">Q{idx + 1}</p>

        {/* TEXT */}
        {ans.answerType === "text" && (
          <textarea readOnly value={ans.answerText || ""} />
        )}

        {/* RATING */}
        {ans.answerType === "rating" && (
          <div className="rating">
            {[1, 2, 3, 4, 5].map((n) => (
              <span
                key={n}
                className={n <= ans.ratingValue ? "star active" : "star"}
              >
                ⭐
              </span>
            ))}
          </div>
        )}

        {/* IMAGE */}
        {ans.answerType === "image" && ans.mediaUrl && (
          <a
            href={ans.mediaUrl}
            target="_blank"
            rel="noreferrer"
            className="media-link"
          >
            View Image
          </a>
        )}

        {/* AUDIO */}
        {ans.answerType === "audio" && ans.mediaUrl && (
          <audio controls src={ans.mediaUrl} />
        )}

        {/* VIDEO */}
        {ans.answerType === "video" && ans.mediaUrl && (
          <a
            href={ans.mediaUrl}
            target="_blank"
            rel="noreferrer"
            className="media-link"
          >
            View Video
          </a>
        )}
      </div>
    ))}
  </div>
  );
}