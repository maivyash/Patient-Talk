import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./SecureFeedbackView.css";

const BACKENDURL = import.meta.env.VITE_BACKENDURL;

// ─── Answer Type Config ───
const ANSWER_TYPE_CONFIG = {
  text: { icon: "✏️", label: "Text Response", badgeClass: "text-badge" },
  rating: { icon: "⭐", label: "Rating", badgeClass: "rating-badge" },
  image: { icon: "📷", label: "Image", badgeClass: "image-badge" },
  audio: { icon: "🎙️", label: "Audio", badgeClass: "audio-badge" },
  video: { icon: "🎥", label: "Video", badgeClass: "video-badge" },
};

export default function SecureFeedbackView() {
  const { token } = useParams();

  const [response, setResponse] = useState(null);
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

        setResponse(data.data);

        // Apply hospital-specific theme
        if (data.data.hospitalId) {
          const primary = data.data.hospitalId.adminColor || "#1c6e73";
          const secondary = data.data.hospitalId.userColor || "#9ed6df";

          const getContrastColor = (hex) => {
            if (!hex) return "#ffffff";
            const color = hex.replace("#", "");
            const r = parseInt(color.substring(0, 2), 16);
            const g = parseInt(color.substring(2, 4), 16);
            const b = parseInt(color.substring(4, 6), 16);
            const brightness = (r * 299 + g * 587 + b * 114) / 1000;
            return brightness > 128 ? "#0b1c28" : "#ffffff";
          };

          const contrastText = getContrastColor(secondary);
          const btnText = getContrastColor(primary);
          const isDark = contrastText === "#ffffff";

          document.documentElement.style.setProperty("--primary-color", primary);
          document.documentElement.style.setProperty("--secondary-color", secondary);
          document.documentElement.style.setProperty("--text-main", contrastText);
          document.documentElement.style.setProperty("--btn-text", btnText);
          document.documentElement.style.setProperty(
            "--glass-bg",
            isDark ? "rgba(0,0,0,0.25)" : "rgba(255,255,255,0.75)"
          );
          document.documentElement.style.setProperty(
            "--glass-border",
            isDark ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.8)"
          );
          document.body.style.background = secondary;
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load feedback");
      } finally {
        setLoading(false);
      }
    };

    loadResponse();
  }, [token]);

  // ─── Loading State ───
  if (loading) {
    return (
      <div className="sfv-loading-page">
        <nav className="sfv-navbar">
          <div className="sfv-nav-left"></div>
          <div className="sfv-nav-center">
            <div className="sfv-brand">
              <span className="sfv-brand-icon-svg">
                <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                  <polygon points="12,5 14.5,9.5 20,10.5 16,14.5 17.5,20 12,17.5 6.5,20 8,14.5 4,10.5 9.5,9.5" fill="#e00000" />
                  <path d="M12 2 A10 10 0 0 1 21.5 8 L18.5 8 L22.5 13 L23.5 7 L20.5 7 A11.5 11.5 0 0 0 12 0.5 Z" fill="#f09b50" />
                  <path d="M12 22 A10 10 0 0 1 2.5 16 L5.5 16 L1.5 11 L0.5 17 L3.5 17 A11.5 11.5 0 0 0 12 23.5 Z" fill="#f09b50" />
                </svg>
              </span>
              <span className="sfv-brand-name">PatientTalkback</span>
            </div>
          </div>
          <div className="sfv-nav-right"></div>
        </nav>
        <div className="sfv-loading-center">
          <div className="sfv-spinner"></div>
          <p className="sfv-loading-text">Loading feedback responses…</p>
        </div>
      </div>
    );
  }

  // ─── Error State ───
  if (error) {
    return (
      <div className="sfv-error-page">
        <nav className="sfv-navbar">
          <div className="sfv-nav-left"></div>
          <div className="sfv-nav-center">
            <div className="sfv-brand">
              <span className="sfv-brand-icon-svg">
                <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                  <polygon points="12,5 14.5,9.5 20,10.5 16,14.5 17.5,20 12,17.5 6.5,20 8,14.5 4,10.5 9.5,9.5" fill="#e00000" />
                  <path d="M12 2 A10 10 0 0 1 21.5 8 L18.5 8 L22.5 13 L23.5 7 L20.5 7 A11.5 11.5 0 0 0 12 0.5 Z" fill="#f09b50" />
                  <path d="M12 22 A10 10 0 0 1 2.5 16 L5.5 16 L1.5 11 L0.5 17 L3.5 17 A11.5 11.5 0 0 0 12 23.5 Z" fill="#f09b50" />
                </svg>
              </span>
              <span className="sfv-brand-name">PatientTalkback</span>
            </div>
          </div>
          <div className="sfv-nav-right"></div>
        </nav>
        <div className="sfv-error-center">
          <div className="sfv-error-icon">⚠️</div>
          <h2 className="sfv-error-title">Access Denied</h2>
          <p className="sfv-error-message">{error}</p>
        </div>
      </div>
    );
  }

  // ─── No Response ───
  if (!response) {
    return (
      <div className="sfv-error-page">
        <nav className="sfv-navbar">
          <div className="sfv-nav-left"></div>
          <div className="sfv-nav-center">
            <div className="sfv-brand">
              <span className="sfv-brand-icon-svg">
                <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                  <polygon points="12,5 14.5,9.5 20,10.5 16,14.5 17.5,20 12,17.5 6.5,20 8,14.5 4,10.5 9.5,9.5" fill="#e00000" />
                  <path d="M12 2 A10 10 0 0 1 21.5 8 L18.5 8 L22.5 13 L23.5 7 L20.5 7 A11.5 11.5 0 0 0 12 0.5 Z" fill="#f09b50" />
                  <path d="M12 22 A10 10 0 0 1 2.5 16 L5.5 16 L1.5 11 L0.5 17 L3.5 17 A11.5 11.5 0 0 0 12 23.5 Z" fill="#f09b50" />
                </svg>
              </span>
              <span className="sfv-brand-name">PatientTalkback</span>
            </div>
          </div>
          <div className="sfv-nav-right"></div>
        </nav>
        <div className="sfv-error-center">
          <div className="sfv-error-icon">📭</div>
          <h2 className="sfv-error-title">No Response Found</h2>
          <p className="sfv-error-message">
            The feedback response you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  const totalAnswers = response.responses?.length || 0;

  // Build a map of questionId → question text from populated feedback
  const questionMap = {};
  if (response.feedbackId?.questions) {
    response.feedbackId.questions.forEach((q) => {
      questionMap[q._id] = q.text;
    });
  }

  return (
    <div className="sfv-page">
      {/* ─── Navbar ─── */}
      <nav className="sfv-navbar">
        <div className="sfv-nav-left"></div>
        <div className="sfv-nav-center">
          <div className="sfv-brand">
            <span className="sfv-brand-icon-svg">
              <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                <polygon points="12,5 14.5,9.5 20,10.5 16,14.5 17.5,20 12,17.5 6.5,20 8,14.5 4,10.5 9.5,9.5" fill="#e00000" />
                <path d="M12 2 A10 10 0 0 1 21.5 8 L18.5 8 L22.5 13 L23.5 7 L20.5 7 A11.5 11.5 0 0 0 12 0.5 Z" fill="#f09b50" />
                <path d="M12 22 A10 10 0 0 1 2.5 16 L5.5 16 L1.5 11 L0.5 17 L3.5 17 A11.5 11.5 0 0 0 12 23.5 Z" fill="#f09b50" />
              </svg>
            </span>
            <span className="sfv-brand-name">PatientTalkback</span>
          </div>
        </div>
        <div className="sfv-nav-right">
          <div className="sfv-navbar-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            Secure View
          </div>
        </div>
      </nav>

      {/* ─── Content ─── */}
      <div className="sfv-content">
        {/* ─── Header ─── */}
        <div className="sfv-header">
          <div className="sfv-header-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            Feedback Response
          </div>
          <h1 className="sfv-header-title">Patient Feedback Report</h1>
          <p className="sfv-header-subtitle">
            Review the submitted feedback details below
          </p>

          {/* Meta Info */}
          <div className="sfv-meta-bar">
            <div className="sfv-meta-item">
              <span className="sfv-meta-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </span>
              <span>Submitted: </span>
              <span className="sfv-meta-value">
                {new Date(response.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
            <div className="sfv-meta-item">
              <span className="sfv-meta-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                </svg>
              </span>
              <span>Answers: </span>
              <span className="sfv-meta-value">{totalAnswers}</span>
            </div>
          </div>
        </div>

        {/* ─── Summary Card ─── */}
        <div className="sfv-summary-card">
          <div className="sfv-summary-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <div className="sfv-summary-details">
            <p className="sfv-summary-label">Response Overview</p>
            <p className="sfv-summary-value">
              {new Date(response.createdAt).toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })}{" "}
              · {new Date(response.createdAt).toLocaleDateString("en-IN", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
          <div className="sfv-summary-stat">
            <span className="sfv-summary-stat-number">{totalAnswers}</span>
            <span className="sfv-summary-stat-label">Responses</span>
          </div>
        </div>

        {/* ─── Answers ─── */}
        {response.responses.map((ans, idx) => {
          const config = ANSWER_TYPE_CONFIG[ans.answerType] || {
            icon: "📄",
            label: "Response",
            badgeClass: "text-badge",
          };

          return (
            <div key={idx} className="sfv-answer-card">
              {/* Card Header */}
              <div className="sfv-card-header">
                <div className="sfv-question-number">{idx + 1}</div>
                <span className={`sfv-answer-type-badge ${config.badgeClass}`}>
                  {config.icon} {config.label}
                </span>
              </div>

              {/* Question Text */}
              {(questionMap[ans.questionId] || ans.questionText) ? (
                <p className="sfv-question-text">{questionMap[ans.questionId] || ans.questionText}</p>
              ) : (
                <p className="sfv-question-text" style={{ fontStyle: "italic", color: "#888" }}>Unknown Question</p>
              )}

              {/* TEXT */}
              {ans.answerType === "text" && (
                <textarea
                  className="sfv-text-answer"
                  readOnly
                  value={ans.answerText || "No text provided"}
                />
              )}

              {/* RATING */}
              {ans.answerType === "rating" && (
                <div className="sfv-rating-display">
                  <div className="sfv-stars-row">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <span
                        key={n}
                        className={`sfv-star ${n <= ans.ratingValue ? "active" : ""}`}
                      >
                        ⭐
                      </span>
                    ))}
                  </div>
                  <span className="sfv-rating-text">
                    ⭐ {ans.ratingValue} star{ans.ratingValue > 1 ? "s" : ""} given
                  </span>
                </div>
              )}

              {/* IMAGE */}
              {ans.answerType === "image" && ans.mediaUrl && (
                <div className="sfv-image-preview">
                  <img src={ans.mediaUrl} alt={`Response ${idx + 1}`} />
                </div>
              )}

              {/* IMAGE - Link Fallback */}
              {ans.answerType === "image" && ans.mediaUrl && (
                <div style={{ marginTop: "12px" }}>
                  <a
                    href={ans.mediaUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="sfv-media-link"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                    Open Full Image
                  </a>
                </div>
              )}

              {/* AUDIO */}
              {ans.answerType === "audio" && ans.mediaUrl && (
                <div className="sfv-audio-wrapper">
                  <audio controls src={ans.mediaUrl} className="sfv-audio-player" />
                </div>
              )}

              {/* VIDEO */}
              {ans.answerType === "video" && ans.mediaUrl && (
                <>
                  <div className="sfv-video-preview">
                    <video
                      controls
                      src={ans.mediaUrl}
                      playsInline
                      preload="metadata"
                    />
                  </div>
                  <div style={{ marginTop: "12px" }}>
                    <a
                      href={ans.mediaUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="sfv-media-link"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                      Open Full Video
                    </a>
                  </div>
                </>
              )}

              {/* Fallback for media without URL */}
              {["image", "audio", "video"].includes(ans.answerType) && !ans.mediaUrl && (
                <div className="sfv-empty-answer">
                  <span>📭</span>
                  No media attached
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ─── Footer ─── */}
      <footer className="sfv-footer">
        <p className="sfv-footer-text">Powered by PatientTalkback</p>
      </footer>
    </div>
  );
}