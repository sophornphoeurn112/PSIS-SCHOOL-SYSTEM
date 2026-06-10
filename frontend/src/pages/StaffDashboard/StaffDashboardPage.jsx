import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUser, logout } from "../../services/authService";
import AppLayout from "../../components/layout/AppLayout";
import "./AdminDashboard.css";

function StaffDashboardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUser = getUser();
    if (!currentUser || currentUser.role !== "staff") {
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
    { key: "registration", label: "Student Registration", icon: "🧾" },
    { key: "records", label: "Student Information", icon: "📁" },
    { key: "payments", label: "Tuition Management", icon: "💳" },
    { key: "docs", label: "Documentation", icon: "📄" },
    { key: "reports", label: "Reports", icon: "📊" },
  ];

  const staffFunctions = [
    {
      title: "Student Registration",
      items: [
        "Check student documents",
        "Verify registration",
        "Collect required forms",
        "Process applications",
      ],
    },
    {
      title: "Student Information",
      items: [
        "Enter new student data",
        "Update student information",
        "Manage student records",
        "Process enrollments",
      ],
    },
    {
      title: "Tuition Management",
      items: [
        "Forward payment data",
        "Track tuition payments",
        "Generate payment reports",
        "Manage payment records",
      ],
    },
    {
      title: "Documentation",
      items: [
        "Process documents",
        "Maintain records",
        "Issue certificates",
        "Manage documentation",
      ],
    },
    {
      title: "Reports",
      items: [
        "Generate reports",
        "Export data",
        "View statistics",
        "Track registrations",
      ],
    },
  ];

  return (
    <AppLayout
      user={user}
      title="Staff Dashboard"
      navItems={navItems}
      activeKey={"registration"}
      onNavChange={() => {}}
      onLogout={handleLogout}
    >
      <div className="functions-grid">
        {staffFunctions.map((section, idx) => (
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

export default StaffDashboardPage;
