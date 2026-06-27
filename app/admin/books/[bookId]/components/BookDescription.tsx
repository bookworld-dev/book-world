"use client";
import { updateBookDescription } from "@/app/lib/api/book.api";
import { useState } from "react";

type BookDescriptionProps = {
  bookId: string;
  initialDescription?: string;
};

const BookDescription = ({ bookId, initialDescription }: BookDescriptionProps) => {
  const [description, setDescription] = useState(initialDescription ?? '');
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(description);
  const [saving, setSaving] = useState(false);

  const handleEdit = () => {
    setDraft(description);
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateBookDescription(bookId, draft);
      setDescription(draft);
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-section">
      <h3>Description</h3>
      {editing ? (
        <>
          <textarea
            className="admin-input"
            value={draft}
            onChange={e => setDraft(e.target.value)}
            rows={4}
            autoFocus
          />
          <div className="admin-actions">
            <button className="admin-btn admin-btn-primary" onClick={handleSave} disabled={saving}>
              Save
            </button>
            <button className="admin-btn" onClick={handleCancel} disabled={saving}>
              Cancel
            </button>
          </div>
        </>
      ) : (
        <div className="admin-description" onClick={handleEdit}>
          {description || <span className="admin-placeholder">Add a description…</span>}
        </div>
      )}
    </div>
  );
};

export default BookDescription;
