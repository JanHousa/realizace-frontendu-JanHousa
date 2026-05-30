import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { taskApi, weddingApi } from "../api.js";
import EmptyState from "../components/EmptyState.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import Loading from "../components/Loading.jsx";
import StatCard from "../components/StatCard.jsx";
import TaskForm from "../components/TaskForm.jsx";

export default function WeddingDetail() {
  const { id } = useParams();
  const [wedding, setWedding] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadData() {
    setLoading(true);
    try {
      const weddingData = await weddingApi.get(id);
      const taskData = await taskApi.list(id);
      setWedding(weddingData);
      setTasks(taskData.itemList || taskData.taskList || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadData(); }, [id]);

  async function saveTask(form) {
    try {
      if (editingTask) {
  const dtoIn = {
    id: editingTask.id,
    title: form.title,
    dueDate: form.dueDate,
    status: form.status,
    description: form.description
  };

  await taskApi.update(dtoIn);
}
      else await taskApi.create({ ...form, weddingId: id });
      setEditingTask(null);
      setIsCreatingTask(false);
      await loadData();
    } catch (err) {
      setError(err.message);
    }
  }

  async function completeTask(taskId) {
    try {
      await taskApi.complete(taskId);
      await loadData();
    } catch (err) {
      setError(err.message);
    }
  }

  async function deleteTask(taskId) {
    if (!confirm("Delete this task?")) return;
    try {
      await taskApi.remove(taskId);
      await loadData();
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) return <Loading />;

  const completed = tasks.filter((task) => task.status === "completed").length;

  return (
    <section className="page">
      <div className="detail-hero">
        <div>
          <Link className="back-link" to="/weddings">← Back to weddings</Link>
          <span className="eyebrow">Wedding detail</span>
          <h2>{wedding?.name || "Wedding detail"}</h2>
          <p>{wedding?.description || "Manage tasks and details for this wedding."}</p>
          <div className="detail-meta">
            <span>📅 {wedding?.date}</span>
            <span>📍 {wedding?.location}</span>
          </div>
        </div>
        <button onClick={() => { setEditingTask(null); setIsCreatingTask(true); }}>Create task</button>
      </div>

      <ErrorMessage message={error} />

      <div className="stats-grid">
        <StatCard label="Tasks" value={tasks.length} icon="✓" />
        <StatCard label="Completed" value={completed} icon="✦" tone="sage" />
        <StatCard label="Pending" value={tasks.length - completed} icon="…" tone="gold" />
      </div>

      {(isCreatingTask || editingTask) && (
        <article className="panel form-panel">
          <div className="section-heading">
            <div>
              <span className="eyebrow">{editingTask ? "Update task" : "New task"}</span>
              <h3>{editingTask ? "Edit task" : "Create task"}</h3>
            </div>
          </div>
          <TaskForm initialValue={editingTask} fixedWeddingId={id} onSubmit={saveTask} onCancel={() => { setEditingTask(null); setIsCreatingTask(false); }} />
        </article>
      )}

      <article className="panel">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Planning checklist</span>
            <h3>Tasks</h3>
          </div>
        </div>

        {tasks.length === 0 ? (
          <EmptyState
            title="No tasks yet"
            text="Create the first planning task for this wedding."
            action={<button onClick={() => setIsCreatingTask(true)}>Create task</button>}
          />
        ) : (
          <div className="task-list">
            {tasks.map((task) => (
              <div className={`task-item ${task.status}`} key={task.id}>
                <div className="task-check">{task.status === "completed" ? "✓" : "○"}</div>
                <div className="task-main">
                  <strong>{task.title}</strong>
                  <span>{task.dueDate || "No due date"} · {task.description || "No description"}</span>
                </div>
                <span className={`status ${task.status}`}>{task.status}</span>
                <div className="row-actions">
                  {task.status !== "completed" && <button onClick={() => completeTask(task.id)}>Complete</button>}
                  <button className="secondary" onClick={() => setEditingTask(task)}>Edit</button>
                  <button className="danger" onClick={() => deleteTask(task.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </article>
    </section>
  );
}
