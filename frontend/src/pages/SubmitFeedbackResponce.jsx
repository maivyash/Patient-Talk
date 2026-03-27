import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./PublicFeedback.css";

import useImageCapture from "../components/imageCapruturer";
import useAudioRecorder from "../components/AudioRecorder";
import useVideoRecorder from "../components/VideoRecorder";

const BACKENDURL = import.meta.env.VITE_BACKENDURL;

// ─── Answer type options ───
const ANSWER_TYPES = [
  { value: "text", label: "Text", icon: "✏️" },
  { value: "rating", label: "Rating", icon: "⭐" },
  { value: "image", label: "Image", icon: "📷" },
  { value: "audio", label: "Audio", icon: "🎙️" },
  { value: "video", label: "Video", icon: "🎥" },
];

// ─── QuestionAnswer Component ───
function QuestionAnswer({ question, index, onAnswerChange, answer }) {
  const image = useImageCapture();
  const audio = useAudioRecorder();
  const video = useVideoRecorder();

  const [currentType, setCurrentType] = useState(answer?.answerType || "");
  const [capturedImage, setCapturedImage] = useState(null);
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [recordedVideo, setRecordedVideo] = useState(null);

  // Sync with parent answer
  useEffect(() => {
    if (answer?.file) {
      if (answer.answerType === "image") {
        setCapturedImage(URL.createObjectURL(answer.file));
      } else if (answer.answerType === "audio") {
        setRecordedAudio(URL.createObjectURL(answer.file));
      } else if (answer.answerType === "video") {
        setRecordedVideo(URL.createObjectURL(answer.file));
      }
    } else {
      if (!answer) {
        setCapturedImage(null);
        setRecordedAudio(null);
        setRecordedVideo(null);
      }
    }
  }, [answer]);

  // Watch for audio blob changes
  useEffect(() => {
    if (currentType === "audio" && audio.audioBlob && !recordedAudio) {
      const audioUrl = URL.createObjectURL(audio.audioBlob);
      setRecordedAudio(audioUrl);
      onAnswerChange(question._id, {
        answerType: "audio",
        file: audio.audioBlob,
      });
    }
  }, [audio.audioBlob, currentType, recordedAudio, question._id, onAnswerChange]);

  // Watch for video blob changes
  useEffect(() => {
    if (currentType === "video" && video.videoBlob && !recordedVideo && !video.recording) {
      const timer = setTimeout(() => {
        if (video.videoBlob && video.videoBlob.size > 0) {
          const videoUrl = URL.createObjectURL(video.videoBlob);
          setRecordedVideo(videoUrl);
          onAnswerChange(question._id, {
            answerType: "video",
            file: video.videoBlob,
          });
        } else {
          console.error("Video blob is empty or invalid");
          alert("Video recording failed. The recorded video appears to be empty. Please try again.");
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [video.videoBlob, video.recording, currentType, recordedVideo, question._id, onAnswerChange]);

  // Handle answer type change
  const handleTypeChange = (type) => {
    if (type === currentType) return;
    setCurrentType(type);
    if (type !== "image") image.stop?.();
    if (type !== "video") {
      if (video.recording) video.stopRecording();
      video.reset?.();
    }
    if (type !== "audio" && audio.recording) audio.stopAudio?.();

    if (capturedImage) URL.revokeObjectURL(capturedImage);
    if (recordedAudio) URL.revokeObjectURL(recordedAudio);
    if (recordedVideo) URL.revokeObjectURL(recordedVideo);

    setCapturedImage(null);
    setRecordedAudio(null);
    setRecordedVideo(null);
    onAnswerChange(question._id, { answerType: type });
  };

  // Image capture
  const handleImageCapture = async () => {
    try {
      const blob = await image.capture();
      const imageUrl = URL.createObjectURL(blob);
      setCapturedImage(imageUrl);
      image.stop();
      onAnswerChange(question._id, { answerType: "image", file: blob });
    } catch (err) {
      alert("Camera not ready yet. Please open camera first.");
    }
  };

  // Audio stop
  const handleAudioStop = () => audio.stopAudio();

  // Video stop
  const handleVideoStop = () => {
    if (video.recording) video.stopRecording();
  };

  // Retake
  const handleRetake = () => {
    if (capturedImage) URL.revokeObjectURL(capturedImage);
    if (recordedAudio) URL.revokeObjectURL(recordedAudio);
    if (recordedVideo) URL.revokeObjectURL(recordedVideo);
    if (video.recording) video.stopRecording();
    if (audio.recording) audio.stopAudio();
    if (image.videoRef.current?.srcObject) image.stop();

    setCapturedImage(null);
    setRecordedAudio(null);
    setRecordedVideo(null);
    onAnswerChange(question._id, null);
  };

  // Cleanup
  useEffect(() => {
    return () => {
      if (capturedImage) URL.revokeObjectURL(capturedImage);
      if (recordedAudio) URL.revokeObjectURL(recordedAudio);
      if (recordedVideo) URL.revokeObjectURL(recordedVideo);
    };
  }, [capturedImage, recordedAudio, recordedVideo]);

  return (
    <div className="pfb-question-card">
      {/* Question Number + Text */}
      <div className="pfb-question-number">{index + 1}</div>
      <p className="pfb-question-text">{question.text}</p>

      {/* Answer Type Chips */}
      <div className="pfb-type-selector">
        {ANSWER_TYPES.map((t) => (
          <button
            key={t.value}
            className={`pfb-type-chip ${currentType === t.value ? "active" : ""}`}
            onClick={() => handleTypeChange(t.value)}
          >
            <span className="pfb-type-icon">{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── TEXT ── */}
      {currentType === "text" && (
        <textarea
          className="pfb-text-area"
          placeholder="Share your thoughts here..."
          rows="4"
          value={answer?.answerText || ""}
          onChange={(e) =>
            onAnswerChange(question._id, {
              answerType: "text",
              answerText: e.target.value,
            })
          }
        />
      )}

      {/* ── RATING ── */}
      {currentType === "rating" && (
        <div className="pfb-rating">
          <div className="pfb-stars">
            {[1, 2, 3, 4, 5].map((val) => (
              <span
                key={val}
                className={`pfb-star ${answer?.ratingValue >= val ? "active" : ""}`}
                onClick={() =>
                  onAnswerChange(question._id, {
                    answerType: "rating",
                    ratingValue: val,
                  })
                }
              >
                ⭐
              </span>
            ))}
          </div>
          {answer?.ratingValue && (
            <span className="pfb-rating-label">
              ⭐ {answer.ratingValue} star{answer.ratingValue > 1 ? "s" : ""} selected
            </span>
          )}
        </div>
      )}

      {/* ── IMAGE ── */}
      {currentType === "image" && (
        <div className="pfb-media">
          {!capturedImage ? (
            <>
              <div className="pfb-camera-box">
                <video ref={image.videoRef} autoPlay playsInline className="pfb-media-video" />
              </div>
              <div className="pfb-controls">
                <button className="pfb-ctrl-btn primary" onClick={image.start}>
                  📷 Open Camera
                </button>
                <button
                  className="pfb-ctrl-btn primary"
                  onClick={handleImageCapture}
                  disabled={!image.videoRef.current?.srcObject}
                >
                  📸 Capture
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="pfb-captured-box">
                <img src={capturedImage} alt="Captured" className="pfb-captured-img" />
              </div>
              <div className="pfb-controls">
                <button className="pfb-ctrl-btn secondary" onClick={handleRetake}>
                  🔄 Retake
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* ── AUDIO ── */}
      {currentType === "audio" && (
        <div className="pfb-media">
          {!recordedAudio ? (
            <>
              <div className="pfb-rec-status">
                {audio.recording ? (
                  <div className="pfb-rec-indicator">
                    <span className="pfb-rec-dot"></span>
                    Recording…
                  </div>
                ) : (
                  <p>Tap start to begin recording</p>
                )}
              </div>
              <div className="pfb-controls">
                {!audio.recording ? (
                  <button className="pfb-ctrl-btn primary" onClick={audio.startAudio}>
                    🎙️ Start Recording
                  </button>
                ) : (
                  <button className="pfb-ctrl-btn stop" onClick={handleAudioStop}>
                    ⏹️ Stop Recording
                  </button>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="pfb-captured-box" style={{ background: "transparent", boxShadow: "none" }}>
                <audio controls src={recordedAudio} className="pfb-audio-player" />
              </div>
              <div className="pfb-controls">
                <button className="pfb-ctrl-btn secondary" onClick={handleRetake}>
                  🔄 Re-record
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* ── VIDEO ── */}
      {currentType === "video" && (
        <div className="pfb-media">
          {!recordedVideo ? (
            <>
              <div className="pfb-camera-box">
                <video ref={video.videoRef} autoPlay muted className="pfb-media-video" />
              </div>
              <div className="pfb-rec-status">
                {video.recording && (
                  <div className="pfb-rec-indicator">
                    <span className="pfb-rec-dot"></span>
                    Recording…
                  </div>
                )}
              </div>
              <div className="pfb-controls">
                {!video.recording ? (
                  <button className="pfb-ctrl-btn primary" onClick={video.startRecording}>
                    🎥 Start Recording
                  </button>
                ) : (
                  <button className="pfb-ctrl-btn stop" onClick={handleVideoStop}>
                    ⏹️ Stop Recording
                  </button>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="pfb-captured-box">
                <video
                  controls
                  src={recordedVideo}
                  className="pfb-captured-vid"
                  playsInline
                  preload="metadata"
                  onLoadedMetadata={(e) => console.log("Video loaded, duration:", e.target.duration)}
                  onError={(e) => {
                    console.error("Video playback error:", e);
                    alert("Error playing video. The file may be corrupted.");
                  }}
                />
              </div>
              <div className="pfb-controls">
                <button className="pfb-ctrl-btn secondary" onClick={handleRetake}>
                  🔄 Re-record
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main FeedbackResponse Component ───
export default function FeedbackResponse() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [feedback, setFeedback] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);

  // Load feedback form
  useEffect(() => {
    setLoading(true);
    fetch(`${BACKENDURL}/api/user/getFeedbackByIdForUser/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setFeedback(data.data);
        setLoading(false);
      });
    setLoading(false);
  }, [id]);

  // Load hospital-specific theme
  useEffect(() => {
    if (!feedback?.hospitalId) return;
    fetch(`${BACKENDURL}/api/user/getHospitalProfileForUser/${feedback.hospitalId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const primary = data.data.adminColor || "#1c6e73";
          const secondary = data.data.userColor || "#9ed6df";
          document.documentElement.style.setProperty('--primary-color', primary);
          document.documentElement.style.setProperty('--secondary-color', secondary);
        }
      });
  }, [feedback?.hospitalId]);

  // Handle answer change
  const handleAnswerChange = useCallback((qid, answerData) => {
    if (answerData === null) {
      setAnswers((prev) => {
        const newAnswers = { ...prev };
        delete newAnswers[qid];
        return newAnswers;
      });
    } else {
      setAnswers((prev) => ({ ...prev, [qid]: answerData }));
    }
  }, []);

  // Calculate progress
  const answeredCount = feedback
    ? feedback.questions.filter((q) => {
        const a = answers[q._id];
        if (!a) return false;
        if (a.answerType === "text") return !!a.answerText?.trim();
        if (a.answerType === "rating") return !!a.ratingValue;
        if (["image", "audio", "video"].includes(a.answerType)) return !!a.file;
        return false;
      }).length
    : 0;
  const totalQuestions = feedback?.questions?.length || 0;
  const progressPct = totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0;

  // Submit
  const submitFeedback = async () => {
    if (!feedback) return;

    const formData = new FormData();
    const responses = [];

    for (const q of feedback.questions) {
      const ans = answers[q._id];
      if (!ans) continue;
      const item = { questionId: q._id, answerType: ans.answerType };

      if (ans.answerType === "text" && ans.answerText?.trim()) {
        item.answerText = ans.answerText;
      }
      if (ans.answerType === "rating" && ans.ratingValue) {
        item.ratingValue = ans.ratingValue;
      }
      if (["image", "audio", "video"].includes(ans.answerType) && ans.file) {
        const key = `file_${q._id}`;
        formData.append(key, ans.file);
        item.fileKey = key;
      }
      responses.push(item);
    }

    if (responses.length === 0) {
      alert("Please answer at least one question before submitting.");
      return;
    }

    formData.append("responses", JSON.stringify(responses));

    try {
      setLoading(true);
      const response = await fetch(`${BACKENDURL}/api/user/submitFeedbackForUser/${id}`, {
        method: "POST",
        body: formData,
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        alert(result.message || "Submission failed. Please try again.");
        setLoading(false);
        return;
      }

      setAnswers({});
      alert("Thank you for your feedback!");
      navigate(`/user/HomeforFeedback/${feedback.hospitalId}`, { replace: true });
    } catch (err) {
      alert("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ─── Loading State ───
  if (!feedback || loading) {
    return (
      <div className="pfb-loading-page">
        <nav className="pfb-navbar">
          <div className="pfb-nav-left"></div>
          <div className="pfb-nav-center">
            <div className="pfb-brand">
              <span className="pfb-brand-icon-svg">
                <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                  <polygon points="12,5 14.5,9.5 20,10.5 16,14.5 17.5,20 12,17.5 6.5,20 8,14.5 4,10.5 9.5,9.5" fill="#e00000" />
                  <path d="M12 2 A10 10 0 0 1 21.5 8 L18.5 8 L22.5 13 L23.5 7 L20.5 7 A11.5 11.5 0 0 0 12 0.5 Z" fill="#f09b50" />
                  <path d="M12 22 A10 10 0 0 1 2.5 16 L5.5 16 L1.5 11 L0.5 17 L3.5 17 A11.5 11.5 0 0 0 12 23.5 Z" fill="#f09b50" />
                </svg>
              </span>
              <span className="pfb-brand-name">PatientTalkback</span>
            </div>
          </div>
          <div className="pfb-nav-right"></div>
        </nav>
        <div className="pfb-loading-center">
          <div className="pfb-spinner"></div>
          <p className="pfb-loading-text">
            {loading ? "Submitting your feedback…" : "Loading feedback form…"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="pfb-page">
      {/* ─── Navbar ─── */}
      <nav className="pfb-navbar">
        <div className="pfb-nav-left">
          <button
            className="pfb-back-btn"
            onClick={() => navigate(`/user/HomeforFeedback/${feedback.hospitalId}`, { replace: true })}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back
          </button>
        </div>
        <div className="pfb-nav-center">
          <div className="pfb-brand">
            <span className="pfb-brand-icon-svg">
              <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                <polygon points="12,5 14.5,9.5 20,10.5 16,14.5 17.5,20 12,17.5 6.5,20 8,14.5 4,10.5 9.5,9.5" fill="#e00000" />
                <path d="M12 2 A10 10 0 0 1 21.5 8 L18.5 8 L22.5 13 L23.5 7 L20.5 7 A11.5 11.5 0 0 0 12 0.5 Z" fill="#f09b50" />
                <path d="M12 22 A10 10 0 0 1 2.5 16 L5.5 16 L1.5 11 L0.5 17 L3.5 17 A11.5 11.5 0 0 0 12 23.5 Z" fill="#f09b50" />
              </svg>
            </span>
            <span className="pfb-brand-name">PatientTalkback</span>
          </div>
        </div>
        <div className="pfb-nav-right"></div>
      </nav>

      {/* ─── Content ─── */}
      <div className="pfb-content">
        {/* ─── Header ─── */}
        <div className="pfb-header">
          <div className="pfb-header-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            Feedback Form
          </div>
          <h1 className="pfb-header-title">
            {feedback.feedback_name || "Share Your Experience"}
          </h1>
          <p className="pfb-header-subtitle">
            Your feedback helps us improve our services
          </p>

          {/* Progress Bar */}
          <div className="pfb-progress-bar">
            <div className="pfb-progress-track">
              <div className="pfb-progress-fill" style={{ width: `${progressPct}%` }}></div>
            </div>
            <span className="pfb-progress-label">
              {answeredCount}/{totalQuestions}
            </span>
          </div>
        </div>

        {/* ─── Questions ─── */}
        {feedback.questions.map((q, index) => (
          <QuestionAnswer
            key={q._id}
            question={q}
            index={index}
            onAnswerChange={handleAnswerChange}
            answer={answers[q._id]}
          />
        ))}

        {/* ─── Submit ─── */}
        <div className="pfb-submit-area">
          <button className="pfb-submit-btn" onClick={submitFeedback}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
            Submit Feedback
          </button>
        </div>
      </div>

      {/* ─── Footer ─── */}
      <footer className="pfb-footer">
        <p className="pfb-footer-text">Powered by PatientTalkback</p>
      </footer>
    </div>
  );
}
