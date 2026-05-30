import { NavLink, Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">∞</div>
          <div>
            <h1>Wedding Planner</h1>
            <p>Elegant wedding organizer</p>
          </div>
        </div>

        <nav className="main-nav">
          <NavLink to="/" end><span>✦</span>Dashboard</NavLink>
          <NavLink to="/weddings"><span>♡</span>Weddings</NavLink>
          <NavLink to="/tasks"><span>✓</span>Tasks</NavLink>
        </nav>

        <div className="sidebar-card">
          <span className="eyebrow">Today’s focus</span>
          <strong>Plan beautifully, one task at a time.</strong>
        </div>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
