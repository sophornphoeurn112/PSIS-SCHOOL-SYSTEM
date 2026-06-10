import React from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/Auth/Login";
import AdminDashboardPage from "./pages/AdminDashboard/AdminDashboardPage";
import TeacherDashboardPage from "./pages/TeacherDashboard/TeacherDashboardPage";
import StudentDashboardPage from "./pages/StudentDashboard/StudentDashboardPage";
import StaffDashboardPage from "./pages/StaffDashboard/StaffDashboardPage";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="/teacher" element={<TeacherDashboardPage />} />
        <Route path="/student" element={<StudentDashboardPage />} />
        <Route path="/staff" element={<StaffDashboardPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
