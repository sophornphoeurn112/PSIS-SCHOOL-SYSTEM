import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUser, logout } from "../../services/authService";
import AppLayout from "../../components/layout/AppLayout";
import "./AdminDashboard.css";

function StudentDashboardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUser = getUser();
    if (!currentUser || currentUser.role !== "student") {
      navigate("/");
    } else {
      setUser(currentUser);
    }
  }, [navigate]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (!user) return null;

  const navItems = [
    { key: "overview", label: "Overview", icon: "🏠" },
    { key: "schedule", label: "Class Schedules", icon: "📅" },
    { key: "attendance", label: "Attendance", icon: "📊" },
    { key: "grades", label: "Grades", icon: "📝" },
    { key: "profile", label: "Profile", icon: "👤" },
  ];

  const studentFunctions = [
    {
      title: "System Access",
      items: [
        "Login to the system",
        "Manage account settings",
        "Recover forgotten password",
        "View account information",
      ],
    },
    {
      title: "Class Schedules",
      items: [
        "View class schedules",
        "Check class timings",
        "View teacher information",
        "Get classroom locations",
      ],
    },
    {
      title: "Attendance Records",
      items: [
        "Check attendance records",
        "View attendance percentage",
        "Get attendance reports",
        "Track attendance history",
      ],
    },
    {
      title: "Grades & Performance",
      items: [
        "View grades and marks",
        "Check academic performance",
        "View grade history",
        "Get performance reports",
      ],
    },
    {
      title: "Personal Information",
      items: [
        "Update personal details",
        "Change phone number",
        "Update address",
        "Change password",
      ],
    },
  ];

  return (
    <AppLayout
      user={user}
      title="Student Dashboard"
      navItems={navItems}
      activeKey={"overview"}
      onNavChange={() => {}}
      onLogout={handleLogout}
    >
      <div className="functions-grid">
        {studentFunctions.map((section, idx) => (
          <div key={idx} className="function-card">
            <h3>{section.title}</h3>
            <ul>
              {section.items.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </AppLayout>
  );
}

export default StudentDashboardPage;
