import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Dashboard from "./routes/Dashboard.jsx";
import WeddingList from "./routes/WeddingList.jsx";
import WeddingDetail from "./routes/WeddingDetail.jsx";
import TaskList from "./routes/TaskList.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/weddings" element={<WeddingList />} />
        <Route path="/wedding/:id" element={<WeddingDetail />} />
        <Route path="/tasks" element={<TaskList />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
