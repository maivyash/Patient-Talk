
import React, { useState } from "react";

const BACKENDURL = import.meta.env.VITE_BACKENDURL;

export default function PersonList({ persons, feedbacks, setFeedbacks }) {
  const [loadingMap, setLoadingMap] = useState({});

  const toggleAssign = async (feedbackId, personId, checked) => {
    setLoadingMap((p) => ({ ...p, [feedbackId + personId]: true }));

    // 🔁 OPTIMISTIC UI UPDATE
    setFeedbacks((prev) =>
      prev.map((fb) =>
        fb._id === feedbackId
          ? {
              ...fb,
              assignedTo: checked
                ? [...(fb.assignedTo || []), personId]
                : fb.assignedTo.filter((id) => id !== personId),
            }
          : fb
      )
    );

    try {
      await fetch(`${BACKENDURL}/api/admin/assignFeedbackPerson`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          feedbackId,
          personId,
          assign: checked,
        }),
      });
    } catch (err) {
      alert("Failed to update assignment");
    } finally {
      setLoadingMap((p) => ({ ...p, [feedbackId + personId]: false }));
    }
  };

  return (
    <div className="assign-list">
      {feedbacks.map((fb) => (
        <div key={fb._id} className="assign-row">
          <div className="dept-name">
            <span style={{ fontWeight: 500, color: "var(--text-muted)", marginRight: "6px" }}>Form Name:</span>
            {fb.feedback_name}
          </div>

          <div className="person-checkboxes">
            {persons.map((p) => {
              const checked = fb.assignedTo?.includes(p._id);
              const loading = loadingMap[fb._id + p._id];

              return (
                <label key={p._id} className="checkbox-row">
                  <input
                    type="checkbox"
                    checked={checked}
                    disabled={loading}
                    onChange={(e) =>
                      toggleAssign(fb._id, p._id, e.target.checked)
                    }
                  />
                  {p.name}
                  {loading && <span className="spinner">⏳</span>}
                </label>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}