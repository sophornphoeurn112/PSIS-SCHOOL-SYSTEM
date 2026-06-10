import React from "react";
import "./AppLayout.css";

export default function AppLayout({
  user,
  title,
  navItems = [],
  activeKey,
  onNavChange,
  onLogout,
  children,
}) {
  return (
    <div className="app-layout">
      <aside className="app-sidebar">
        <div className="brand">
          <div className="logo">PSIS</div>
          <div className="brand-name">School System</div>
        </div>

        <nav className="app-nav">
          {navItems.map((item) => (
            <button
              key={item.key}
              className={`nav-item ${activeKey === item.key ? "active" : ""}`}
              onClick={() => onNavChange(item.key)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={onLogout}>
            🚪 Logout
          </button>
        </div>
      </aside>

      <div className="app-main">
        <header className="app-topbar">
          <div className="page-title">{title}</div>
          <div className="topbar-right">
            <div className="profile">
              <div className="avatar">{user?.name?.charAt(0) || "U"}</div>
              <div className="profile-info">
                <div className="profile-name">{user?.name}</div>
                <div className="profile-role">{user?.role}</div>
              </div>
            </div>
          </div>
        </header>

        <main className="app-content">{children}</main>
      </div>
    </div>
  );
}
