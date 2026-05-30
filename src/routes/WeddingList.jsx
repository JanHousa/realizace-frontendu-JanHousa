import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { weddingApi } from "../api.js";
import EmptyState from "../components/EmptyState.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import Loading from "../components/Loading.jsx";
import WeddingForm from "../components/WeddingForm.jsx";

export default function WeddingList() {
  const [weddings, setWeddings] = useState([]);
  const [editingWedding, setEditingWedding] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadWeddings() {
    setLoading(true);
    try {
      const data = await weddingApi.list();
      setWeddings(data.itemList || data.weddingList || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadWeddings(); }, []);

  async function saveWedding(form) {
    try {
      if (editingWedding) await weddingApi.update({ ...editingWedding, ...form });
      else await weddingApi.create(form);
      setEditingWedding(null);
      setIsCreating(false);
      await loadWeddings();
    } catch (err) {
      setError(err.message);
    }
  }

  async function deleteWedding(id) {
    if (!confirm("Delete this wedding?")) return;
    try {
      await weddingApi.remove(id);
      await loadWeddings();
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) return <Loading />;

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <span className="eyebrow">Wedding collection</span>
          <h2>Weddings</h2>
          <p>Create, edit and manage wedding details.</p>
        </div>
        <button onClick={() => { setEditingWedding(null); setIsCreating(true); }}>Create wedding</button>
      </div>

      <ErrorMessage message={error} />

      {(isCreating || editingWedding) && (
        <article className="panel form-panel">
          <div className="section-heading">
            <div>
              <span className="eyebrow">{editingWedding ? "Update" : "New record"}</span>
              <h3>{editingWedding ? "Edit wedding" : "Create wedding"}</h3>
            </div>
          </div>
          <WeddingForm initialValue={editingWedding} onSubmit={saveWedding} onCancel={() => { setEditingWedding(null); setIsCreating(false); }} />
        </article>
      )}

      <article className="panel">
        {weddings.length === 0 ? (
          <EmptyState
            title="No weddings created"
            text="Add your first wedding and start organizing tasks around it."
            action={<button onClick={() => setIsCreating(true)}>Create wedding</button>}
          />
        ) : (
          <div className="lux-table-wrap">
            <table className="lux-table">
              <thead><tr><th>Wedding</th><th>Date</th><th>Location</th><th /></tr></thead>
              <tbody>
                {weddings.map((wedding) => (
                  <tr key={wedding.id}>
                    <td>
                      <Link className="entity-link" to={`/wedding/${wedding.id}`}>
                        <span>♡</span>
                        <div>
                          <strong>{wedding.name}</strong>
                          <small>{wedding.description || "Wedding detail"}</small>
                        </div>
                      </Link>
                    </td>
                    <td>{wedding.date}</td>
                    <td>{wedding.location}</td>
                    <td className="row-actions">
                      <button className="secondary" onClick={() => setEditingWedding(wedding)}>Edit</button>
                      <button className="danger" onClick={() => deleteWedding(wedding.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </article>
    </section>
  );
}
