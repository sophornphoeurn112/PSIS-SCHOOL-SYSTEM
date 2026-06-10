import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUser, logout } from "../../services/authService";
import TeachingSchedule from "../../components/teacher/TeachingSchedule";
import AttendanceTaking from "../../components/teacher/AttendanceTaking";
import GradeEntry from "../../components/teacher/GradeEntry";
import ProfileSettings from "../../components/teacher/ProfileSettings";
import AppLayout from "../../components/layout/AppLayout";
import "./TeacherDashboard.css";

function TeacherDashboardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("schedule");

  useEffect(() => {
    const currentUser = getUser();
    if (!currentUser || currentUser.role !== "teacher") {
      navigate("/");
    } else {
      setUser(currentUser);
    }
  }, [navigate]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleProfileSave = (updatedUser) => {
    setUser(updatedUser);
  };

  if (!user) return null;

  const navItems = [
    { key: "schedule", label: "Teaching Schedule", icon: "📅" },
    { key: "attendance", label: "Take Attendance", icon: "✅" },
    { key: "grades", label: "Enter Scores", icon: "📝" },
    { key: "profile", label: "Profile & Password", icon: "👤" },
  ];

  return (
    <AppLayout
      user={user}
      title="Teacher Dashboard"
      navItems={navItems}
      activeKey={activeTab}
      onNavChange={setActiveTab}
      onLogout={handleLogout}
    >
      <div className="content-wrapper">
        {activeTab === "schedule" && <TeachingSchedule teacherName={user.name} />}
        {activeTab === "attendance" && (
          <AttendanceTaking teacherName={user.name} />
        )}
        {activeTab === "grades" && <GradeEntry />}
        {activeTab === "profile" && (
          <ProfileSettings user={user} onSave={handleProfileSave} />
        )}
      </div>
    </AppLayout>
  );
}

export default TeacherDashboardPage;
