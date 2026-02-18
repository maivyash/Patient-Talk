import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import "./PublicFeedback.css";

import useImageCapture from "../components/imageCapruturer";
import useAudioRecorder from "../components/AudioRecorder";
import useVideoRecorder from "../components/VideoRecorder";

const BACKENDURL = import.meta.env.VITE_BACKENDURL;

// Separate component for each question to manage its own hooks
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
      // Clear previews when answer is cleared
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
      // Small delay to ensure blob is fully ready
      const timer = setTimeout(() => {
        // Verify blob is not empty
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
    setCurrentType(type);
    // Stop any active streams
    if (type !== "image") {
      image.stop?.();
    }
    if (type !== "video") {
      if (video.recording) {
        video.stopRecording();
      }
      video.reset?.();
    }
    if (type !== "audio" && audio.recording) {
      audio.stopAudio?.();
    }

    // Clear previous answer and revoke URLs
    if (capturedImage) URL.revokeObjectURL(capturedImage);
    if (recordedAudio) URL.revokeObjectURL(recordedAudio);
    if (recordedVideo) URL.revokeObjectURL(recordedVideo);

    setCapturedImage(null);
    setRecordedAudio(null);
    setRecordedVideo(null);
    onAnswerChange(question._id, { answerType: type });
  };

  // Handle image capture
  const handleImageCapture = async () => {
    try {
      const blob = await image.capture();
      const imageUrl = URL.createObjectURL(blob);
      setCapturedImage(imageUrl);
      image.stop();
      onAnswerChange(question._id, {
        answerType: "image",
        file: blob,
      });
    } catch (err) {
      alert("Camera not ready yet. Please open camera first.");
    }
  };

  // Handle audio recording stop
  const handleAudioStop = () => {
    audio.stopAudio();
  };

  // Handle video recording stop
  const handleVideoStop = () => {
    if (video.recording) {
      video.stopRecording();
      // The blob will be set via useEffect when video.videoBlob updates
    }
  };

  // Handle retake
  const handleRetake = () => {
    // Revoke old URLs
    if (capturedImage) URL.revokeObjectURL(capturedImage);
    if (recordedAudio) URL.revokeObjectURL(recordedAudio);
    if (recordedVideo) URL.revokeObjectURL(recordedVideo);

    // Stop any active recordings
    if (video.recording) {
      video.stopRecording();
    }
    if (audio.recording) {
      audio.stopAudio();
    }
    if (image.videoRef.current?.srcObject) {
      image.stop();
    }

    setCapturedImage(null);
    setRecordedAudio(null);
    setRecordedVideo(null);
    onAnswerChange(question._id, null);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (capturedImage) URL.revokeObjectURL(capturedImage);
      if (recordedAudio) URL.revokeObjectURL(recordedAudio);
      if (recordedVideo) URL.revokeObjectURL(recordedVideo);
    };
  }, [capturedImage, recordedAudio, recordedVideo]);

  return (
    <div className="question-card">
      <p className="question-text">
        Q{index + 1}. {question.text}
      </p>

      {/* ANSWER TYPE SELECT */}
      <select
        className="answer-type-select"
        value={currentType}
        onChange={(e) => handleTypeChange(e.target.value)}
      >
        <option value="">Select Answer Type</option>
        <option value="text">Text</option>
        <option value="rating">Rating (5 Stars)</option>
        <option value="image">Image (Camera)</option>
        <option value="audio">Audio (Microphone)</option>
        <option value="video">Video (Camera + Microphone)</option>
      </select>

      {/* TEXT */}
      {currentType === "text" && (
        <div className="text-input-container">
          <textarea
            className="text-answer-input"
            placeholder="Enter your answer here..."
            rows="4"
            value={answer?.answerText || ""}
            onChange={(e) =>
              onAnswerChange(question._id, {
                answerType: "text",
                answerText: e.target.value,
              })
            }
          />
        </div>
      )}

      {/* RATING */}
      {currentType === "rating" && (
        <div className="rating-container">
          <div className="stars">
            {[1, 2, 3, 4, 5].map((val) => (
              <span
                key={val}
                className={`star ${answer?.ratingValue >= val ? "active" : ""}`}
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
            <p className="rating-text">
              You selected {answer.ratingValue} star(s)
            </p>
          )}
        </div>
      )}

      {/* IMAGE */}
      {currentType === "image" && (
        <div className="media-block">
          {!capturedImage ? (
            <>
              <div className="camera-preview">
                <video
                  ref={image.videoRef}
                  autoPlay
                  playsInline
                  className="media-preview"
                />
              </div>
              <div className="media-controls">
                <button
                  className="media-btn primary"
                  onClick={image.start}
                >
                  📷 Open Camera
                </button>
                <button
                  className="media-btn secondary"
                  onClick={handleImageCapture}
                  disabled={!image.videoRef.current?.srcObject}

                >
                  📸 Capture Image
                </button>

              </div>
            </>
          ) : (
            <>
              <div className="captured-preview">
                <img
                  src={capturedImage}
                  alt="Captured"
                  className="captured-image"
                />
              </div>
              <div className="media-controls">
                <button
                  className="media-btn secondary"
                  onClick={handleRetake}
                >
                  🔄 Retake Image
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* AUDIO */}
      {currentType === "audio" && (
        <div className="media-block">
          {!recordedAudio ? (
            <>
              <div className="audio-recording-status">
                {audio.recording ? (
                  <div className="recording-indicator">
                    <span className="pulse-dot"></span>
                    <span>Recording...</span>
                  </div>
                ) : (
                  <p>Click start to begin recording</p>
                )}
              </div>
              <div className="media-controls">
                {!audio.recording ? (
                  <button
                    className="media-btn primary"
                    onClick={audio.startAudio}
                  >
                    🎙️ Start Recording
                  </button>
                ) : (
                  <button
                    className="media-btn stop"
                    onClick={handleAudioStop}
                  >
                    ⏹️ Stop Recording
                  </button>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="captured-preview">
                <audio controls src={recordedAudio} className="audio-player" />
              </div>
              <div className="media-controls">
                <button
                  className="media-btn secondary"
                  onClick={handleRetake}
                >
                  🔄 Re-record Audio
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* VIDEO */}
      {currentType === "video" && (
        <div className="media-block">
          {!recordedVideo ? (
            <>
              <div className="camera-preview">
                <video
                  ref={video.videoRef}
                  autoPlay
                  muted
                  className="media-preview"
                />
              </div>
              <div className="video-recording-status">
                {video.recording && (
                  <div className="recording-indicator">
                    <span className="pulse-dot"></span>
                    <span>Recording...</span>
                  </div>
                )}
              </div>
              <div className="media-controls">
                {!video.recording ? (
                  <button
                    className="media-btn primary"
                    onClick={video.startRecording}
                  >
                    🎥 Start Recording
                  </button>
                ) : (
                  <button
                    className="media-btn stop"
                    onClick={handleVideoStop}
                  >
                    ⏹️ Stop Recording
                  </button>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="captured-preview">
                <video
                  controls
                  src={recordedVideo}
                  className="captured-video"
                  playsInline
                  preload="metadata"
                  onLoadedMetadata={(e) => {
                    console.log("Video loaded, duration:", e.target.duration);
                  }}
                  onError={(e) => {
                    console.error("Video playback error:", e);
                    alert("Error playing video. The file may be corrupted.");
                  }}
                />
              </div>
              <div className="media-controls">
                <button
                  className="media-btn secondary"
                  onClick={handleRetake}
                >
                  🔄 Re-record Video
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default function FeedbackResponse() {
  const { id } = useParams();

  const [feedback, setFeedback] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);

  // 🔹 Load feedback form
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

  // 🔹 Handle answer change
  const handleAnswerChange = (qid, answerData) => {
    if (answerData === null) {
      setAnswers((prev) => {
        const newAnswers = { ...prev };
        delete newAnswers[qid];
        return newAnswers;
      });
    } else {
      setAnswers((prev) => ({
        ...prev,
        [qid]: answerData,
      }));
    }
  };


  // 🔹 Submit
 const submitFeedback = async () => {
  const formData = new FormData();
  const responses = [];

  const validQuestionIds = new Set(
  feedback.questions.map(q => String(q._id))
);

for (const r of responses) {
  if (!validQuestionIds.has(String(r.questionId))) {
    return res.status(400).json({
      success: false,
      message: "Invalid question detected",
    });
  }
}

  for (const q of feedback.questions) {
    const ans = answers[q._id];
    if (!ans) continue;

    const item = {
      questionId: q._id,
      answerType: ans.answerType,
    };

    if (ans.answerType === "text") {
      item.answerText = ans.answerText;
    }

    if (ans.answerType === "rating") {
      item.ratingValue = ans.ratingValue;
    }

    if (["image", "audio", "video"].includes(ans.answerType)) {
      const key = `file_${q._id}`;
      formData.append(key, ans.file);
      item.fileKey = key;
    }

    responses.push(item);
  }

  formData.append("responses", JSON.stringify(responses));
  
  await fetch(`${BACKENDURL}/api/user/submitFeedbackForUser/${id}`, {
    method: "POST",
    body: formData,
  });

  alert("Thank you for your feedback!");
};


  if (!feedback)
    return (
      <div className="loading-container">
        <p>Loading...</p>
      </div>
    );
  if (loading)
    return (
      <div className="loading-container">
        <p>Submitting...</p>
      </div>
    );

  return (
    <div className="feedback-response-page">
      <h2>⭐ Patienttalkback.com</h2>
      <h3>FEEDBACK FORM</h3>
      <p className="subtitle">Describe your problem in detail</p>

      {feedback.questions.map((q, index) => (
        <QuestionAnswer
          key={q._id}
          question={q}
          index={index}
          onAnswerChange={handleAnswerChange}
          answer={answers[q._id]}
        />
      ))}

      <button className="submit-btn" onClick={submitFeedback}>
        Submit Feedback
      </button>
    </div>
  );
}
