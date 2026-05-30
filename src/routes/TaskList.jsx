import { useEffect, useMemo, useState } from "react";
import { taskApi, weddingApi } from "../api.js";
import EmptyState from "../components/EmptyState.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import Loading from "../components/Loading.jsx";
import TaskForm from "../components/TaskForm.jsx";

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [weddings, setWeddings] = useState([]);
  const [selectedWeddingId, setSelectedWeddingId] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const weddingMap = useMemo(() => Object.fromEntries(weddings.map((w) => [w.id, w])), [weddings]);

  async function loadData(weddingId = selectedWeddingId) {
    setLoading(true);
    try {
      const weddingData = await weddingApi.list();
      const weddingList = weddingData.itemList || weddingData.weddingList || [];

      let taskList = [];
      if (weddingId) {
        const taskData = await taskApi.list(weddingId);
        taskList = taskData.itemList || taskData.taskList || [];
      }

      setWeddings(weddingList);
      setTasks(taskList);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadData(); }, []);

  async function changeFilter(event) {
    const weddingId = event.target.value;
    setSelectedWeddingId(weddingId);
    await loadData(weddingId);
  }

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
      else await taskApi.create(form);
      setEditingTask(null);
      setIsCreating(false);
      await loadData();
    } catch (err) {
      setError(err.message);
    }
  }

  async function deleteTask(id) {
    if (!confirm("Delete this task?")) return;
    try {
      await taskApi.remove(id);
      await loadData();
    } catch (err) {
      setError(err.message);
    }
  }

  async function completeTask(id) {
    try {
      await taskApi.complete(id);
      await loadData();
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) return <Loading />;

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <span className="eyebrow">Planning checklist</span>
          <h2>Tasks</h2>
          <p>Select a wedding and manage its planning tasks.</p>
        </div>
        <button onClick={() => { setEditingTask(null); setIsCreating(true); }}>Create task</button>
      </div>

      <ErrorMessage message={error} />

      <article className="panel toolbar">
        <label>Wedding
          <select value={selectedWeddingId} onChange={changeFilter}>
            <option value="">Select wedding</option>
            {weddings.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
          </select>
        </label>
      </article>

      {(isCreating || editingTask) && (
        <article className="panel form-panel">
          <div className="section-heading">
            <div>
              <span className="eyebrow">{editingTask ? "Update task" : "New task"}</span>
              <h3>{editingTask ? "Edit task" : "Create task"}</h3>
            </div>
          </div>
          <TaskForm initialValue={editingTask} weddingList={weddings} onSubmit={saveTask} onCancel={() => { setEditingTask(null); setIsCreating(false); }} />
        </article>
      )}

      <article className="panel">
        {!selectedWeddingId ? (
          <EmptyState title="Choose a wedding" text="Task list is loaded for one selected wedding because your backend requires weddingId." />
        ) : tasks.length === 0 ? (
          <EmptyState
            title="No tasks for this wedding"
            text="Create a task and start planning the next step."
            action={<button onClick={() => setIsCreating(true)}>Create task</button>}
          />
        ) : (
          <div className="lux-table-wrap">
            <table className="lux-table">
              <thead><tr><th>Task</th><th>Wedding</th><th>Due date</th><th>Status</th><th /></tr></thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task.id}>
                    <td>
                      <div className="task-title-cell">
                        <span>{task.status === "completed" ? "✓" : "○"}</span>
                        <div>
                          <strong>{task.title}</strong>
                          <small>{task.description || "No description"}</small>
                        </div>
                      </div>
                    </td>
                    <td>{weddingMap[task.weddingId]?.name || task.weddingId}</td>
                    <td>{task.dueDate}</td>
                    <td><span className={`status ${task.status}`}>{task.status}</span></td>
                    <td className="row-actions">
                      {task.status !== "completed" && <button onClick={() => completeTask(task.id)}>Complete</button>}
                      <button className="secondary" onClick={() => setEditingTask(task)}>Edit</button>
                      <button className="danger" onClick={() => deleteTask(task.id)}>Delete</button>
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
