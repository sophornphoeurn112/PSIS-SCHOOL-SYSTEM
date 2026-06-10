import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUser, logout } from "../../services/authService";
import StudentManagement from "../../components/admin/StudentManagement";
import TeacherManagement from "../../components/admin/TeacherManagement";
import ScheduleManagement from "../../components/admin/ScheduleManagement";
import AttendanceAcademics from "../../components/admin/AttendanceAcademics";
import SystemSecurity from "../../components/admin/SystemSecurity";
import AppLayout from "../../components/layout/AppLayout";
import "./AdminDashboard.css";

function AdminDashboardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("students");

  useEffect(() => {
    const currentUser = getUser();
    if (!currentUser || currentUser.role !== "admin") {
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
    { key: "students", label: "Student Management", icon: "👥" },
    { key: "teachers", label: "Teacher Management", icon: "👨‍🏫" },
    { key: "schedule", label: "Class Schedule", icon: "📅" },
    { key: "attendance", label: "Attendance & Records", icon: "📊" },
    { key: "security", label: "System Security", icon: "🔒" },
  ];

  return (
    <AppLayout
      user={user}
      title="Admin Management"
      navItems={navItems}
      activeKey={activeTab}
      onNavChange={setActiveTab}
      onLogout={handleLogout}
    >
      <div className="content-wrapper">
        {activeTab === "students" && <StudentManagement />}
        {activeTab === "teachers" && <TeacherManagement />}
        {activeTab === "schedule" && <ScheduleManagement />}
        {activeTab === "attendance" && <AttendanceAcademics />}
        {activeTab === "security" && <SystemSecurity />}
      </div>
    </AppLayout>
  );
}

export default AdminDashboardPage;
