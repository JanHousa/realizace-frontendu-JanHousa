import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { weddingApi } from "../api.js";
import EmptyState from "../components/EmptyState.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import Loading from "../components/Loading.jsx";
import StatCard from "../components/StatCard.jsx";

function daysUntil(dateString) {
  if (!dateString) return null;
  const today = new Date();
  const target = new Date(dateString);
  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target - today) / (1000 * 60 * 60 * 24));
}

export default function Dashboard() {
  const [weddings, setWeddings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const weddingData = await weddingApi.list();
        setWeddings(weddingData.itemList || weddingData.weddingList || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const upcomingWedding = useMemo(() => {
    return [...weddings]
      .filter((w) => w.date)
      .sort((a, b) => new Date(a.date) - new Date(b.date))[0];
  }, [weddings]);

  if (loading) return <Loading />;

  const days = upcomingWedding ? daysUntil(upcomingWedding.date) : null;

  return (
    <section className="page">
      <div className="hero">
        <div>
          <span className="eyebrow">Wedding planning dashboard</span>
          <h2>Plan the celebration with calm and clarity.</h2>
          <p>Track weddings, organize tasks and keep every important detail in one elegant place.</p>
          <div className="hero-actions">
            <Link className="button" to="/weddings">Manage weddings</Link>
            <Link className="button ghost" to="/tasks">Open tasks</Link>
          </div>
        </div>

        <div className="hero-card">
          <span className="eyebrow">Upcoming wedding</span>
          {upcomingWedding ? (
            <>
              <h3>{upcomingWedding.name}</h3>
              <p>{upcomingWedding.date} · {upcomingWedding.location}</p>
              <div className="countdown">
                <strong>{days !== null ? Math.max(days, 0) : "—"}</strong>
                <span>days remaining</span>
              </div>
            </>
          ) : (
            <>
              <h3>No wedding yet</h3>
              <p>Create your first wedding to start planning.</p>
            </>
          )}
        </div>
      </div>

      <ErrorMessage message={error} />

      <div className="stats-grid">
        <StatCard label="Weddings" value={weddings.length} icon="♡" />
        <StatCard label="Upcoming" value={upcomingWedding ? "1" : "0"} icon="✦" tone="gold" />
        <StatCard label="Planning status" value="Open" icon="✓" tone="sage" />
      </div>

      <article className="panel">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Overview</span>
            <h3>Wedding list</h3>
          </div>
          <Link to="/weddings">View all</Link>
        </div>

        {weddings.length === 0 ? (
          <EmptyState
            title="Start with your first wedding"
            text="Create a wedding record and then add tasks, dates and planning notes."
            action={<Link className="button" to="/weddings">Create wedding</Link>}
          />
        ) : (
          <div className="wedding-cards">
            {weddings.slice(0, 3).map((wedding) => (
              <Link className="wedding-card" key={wedding.id} to={`/wedding/${wedding.id}`}>
                <span className="wedding-monogram">♡</span>
                <div>
                  <h4>{wedding.name}</h4>
                  <p>{wedding.date} · {wedding.location}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </article>
    </section>
  );
}
