import { useEffect, useState } from "react";

const emptyForm = { weddingId: "", title: "", dueDate: "", description: "" };

export default function TaskForm({ initialValue, weddingList = [], fixedWeddingId, onSubmit, onCancel }) {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    setForm({ ...emptyForm, ...initialValue, weddingId: fixedWeddingId || initialValue?.weddingId || "" });
  }, [initialValue, fixedWeddingId]);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit(form);
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      {!fixedWeddingId && (
        <label>Wedding
          <select name="weddingId" value={form.weddingId} onChange={updateField} required>
            <option value="">Select wedding</option>
            {weddingList.map((wedding) => <option key={wedding.id} value={wedding.id}>{wedding.name}</option>)}
          </select>
        </label>
      )}
      <div className="form-grid">
        <label>Task title<input name="title" value={form.title} onChange={updateField} required placeholder="Book photographer" /></label>
        <label>Due date<input name="dueDate" type="date" value={form.dueDate} onChange={updateField} required /></label>
      </div>
      <label>Description<textarea name="description" value={form.description || ""} onChange={updateField} placeholder="Add details, contact info or notes..." /></label>
      <div className="actions">
        <button type="submit">Save task</button>
        {onCancel && <button type="button" className="secondary" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
}
