import { useEffect, useState } from "react";

const emptyForm = { name: "", date: "", location: "", description: "" };

export default function WeddingForm({ initialValue, onSubmit, onCancel }) {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => setForm(initialValue ? { ...emptyForm, ...initialValue } : emptyForm), [initialValue]);

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
      <div className="form-grid">
        <label>Wedding name<input name="name" value={form.name} onChange={updateField} required placeholder="Anna & Jan Wedding" /></label>
        <label>Date<input name="date" type="date" value={form.date} onChange={updateField} required /></label>
      </div>
      <label>Location<input name="location" value={form.location} onChange={updateField} required placeholder="Prague, Czech Republic" /></label>
      <label>Description<textarea name="description" value={form.description || ""} onChange={updateField} placeholder="Short note about the ceremony, venue or celebration..." /></label>
      <div className="actions">
        <button type="submit">Save wedding</button>
        {onCancel && <button type="button" className="secondary" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
}
