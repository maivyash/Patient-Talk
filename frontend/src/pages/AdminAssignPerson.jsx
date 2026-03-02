import React, { useEffect, useState } from "react";
import "./AdminAssignPerson.css";
import { useNavigate } from "react-router-dom";
import AddPersonModal from "../components/AddPersonComponent";
import PersonList from "../components/ViewAssignPerson";

const BACKENDURL = import.meta.env.VITE_BACKENDURL;

export default function AdminAssignPage() {
  const navigate = useNavigate();

  const [persons, setPersons] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [pRes, fRes] = await Promise.all([
          fetch(`${BACKENDURL}/api/admin/getFeedbackPersons`, {
            credentials: "include",
          }),
          fetch(`${BACKENDURL}/api/admin/getFeedbackForms`, {
            credentials: "include",
          }),
        ]);

        if (pRes.status === 412 || fRes.status === 412) {
          navigate("/login", { replace: true });
          return;
        }

        const pData = await pRes.json();
        const fData = await fRes.json();

        if (pData.success) setPersons(pData.data || []);
        if (fData.success) setFeedbacks(fData.data || []);
      } catch (err) {
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [navigate]);

  if (loading) return <p className="center">Loading...</p>;
  if (error) return <p className="center error">{error}</p>;

  return (
    <div className="admin-assign-page">
      <h2 className="page-title">Assign Feedback Responsibility</h2>
<PersonList
  persons={persons}
  feedbacks={feedbacks}
  setFeedbacks={setFeedbacks}
/>

      {/* Floating Add Button */}
      <button
        className="floating-add-btn"
        onClick={() => setShowAddModal(true)}
      >
        ＋
      </button>

      {/* Modal */}
      {showAddModal && (
        <AddPersonModal
          onClose={() => setShowAddModal(false)}
          onAdd={(newPerson) => {
            setPersons((prev) => [newPerson, ...prev]);
            setShowAddModal(false);
          }}
        />
      )}
    </div>
  );
}