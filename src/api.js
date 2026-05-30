const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8888";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}/${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options
  });

  if (!response.ok) {
    let message = "Request failed";
    try {
      const data = await response.json();
      message = data.message || data.error || message;
    } catch {
      message = await response.text();
    }
    throw new Error(message);
  }

  const text = await response.text();
  return text ? JSON.parse(text) : {};
}

export const weddingApi = {
  list: () => request("wedding/list"),
  get: (id) => request(`wedding/get?id=${encodeURIComponent(id)}`),
  create: (data) => request("wedding/create", { method: "POST", body: JSON.stringify(data) }),
  update: (data) => request("wedding/update", { method: "PUT", body: JSON.stringify(data) }),
  remove: (id) => request("wedding/delete", { method: "DELETE", body: JSON.stringify({ id }) })
};

export const taskApi = {
  list: (weddingId) => request(`task/list?weddingId=${encodeURIComponent(weddingId)}`),
  create: (data) => request("task/create", { method: "POST", body: JSON.stringify(data) }),
  update: (data) => request("task/update", { method: "PUT", body: JSON.stringify(data) }),
  remove: (id) => request("task/delete", { method: "DELETE", body: JSON.stringify({ id }) }),
  complete: (id) => request("task/complete", { method: "PUT", body: JSON.stringify({ id }) })
};
