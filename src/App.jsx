import { useState } from "react";
import "./App.css";

import {
  LayoutDashboard,
  GraduationCap,
  Users,
  School,
  BookOpen,
  ClipboardCheck,
  FileText,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";

import Login from "./components/Login";
import Register from "./components/Register";

import Dashboard from "./components/Dashboard";
import Students from "./components/Students";
import Teachers from "./components/Teachers";
import Classes from "./components/Classes";
import Subjects from "./components/Subjects";
import Attendance from "./components/Attendance";
import Exams from "./components/Exams";
import Reports from "./components/Reports";
import SettingsPage from "./components/Settings";

function App() {
  const [user, setUser] = useState(() => {
    const localUser = localStorage.getItem("user");
    const sessionUser = sessionStorage.getItem("user");

    try {
      if (localUser) {
        return JSON.parse(localUser);
      }

      if (sessionUser) {
        return JSON.parse(sessionUser);
      }

      return null;
    } catch {
      localStorage.removeItem("user");
      sessionStorage.removeItem("user");
      return null;
    }
  });

  const [authPage, setAuthPage] = useState("login");
  const [page, setPage] = useState("dashboard");

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);
    setPage("dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");
    setUser(null);
    setAuthPage("login");
    setPage("dashboard");
  };

  const handleRegister = () => {
    setAuthPage("login");
  };

  if (!user) {
    if (authPage === "register") {
      return (
        <Register
          onRegister={handleRegister}
          onLogin={() => setAuthPage("login")}
        />
      );
    }

    return (
      <Login
        onLogin={handleLogin}
        onRegister={() => setAuthPage("register")}
      />
    );
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <School size={28} />
          </div>

          <h2>School MS</h2>
        </div>

        <div className="sidebar-user">
          <strong>{user.fullName}</strong>
          <span>{user.employeeNumber}</span>
          <small>{user.role}</small>
        </div>

        <nav>
          <a
            className={page === "dashboard" ? "active" : ""}
            onClick={() => setPage("dashboard")}
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </a>

          <a
            className={page === "students" ? "active" : ""}
            onClick={() => setPage("students")}
          >
            <GraduationCap size={20} />
            <span>Students</span>
          </a>

          <a
            className={page === "teachers" ? "active" : ""}
            onClick={() => setPage("teachers")}
          >
            <Users size={20} />
            <span>Teachers</span>
          </a>

          <a
            className={page === "classes" ? "active" : ""}
            onClick={() => setPage("classes")}
          >
            <School size={20} />
            <span>Classes</span>
          </a>

          <a
            className={page === "subjects" ? "active" : ""}
            onClick={() => setPage("subjects")}
          >
            <BookOpen size={20} />
            <span>Subjects</span>
          </a>

          <a
            className={page === "attendance" ? "active" : ""}
            onClick={() => setPage("attendance")}
          >
            <ClipboardCheck size={20} />
            <span>Attendance</span>
          </a>

          <a
            className={page === "exams" ? "active" : ""}
            onClick={() => setPage("exams")}
          >
            <FileText size={20} />
            <span>Exams</span>
          </a>

          <a
            className={page === "reports" ? "active" : ""}
            onClick={() => setPage("reports")}
          >
            <BarChart3 size={20} />
            <span>Reports</span>
          </a>

          <a
            className={page === "settings" ? "active" : ""}
            onClick={() => setPage("settings")}
          >
            <Settings size={20} />
            <span>Settings</span>
          </a>

          <a
            className="logout-link"
            onClick={handleLogout}
          >
            <LogOut size={20} />
            <span>Logout</span>
          </a>
        </nav>
      </aside>

      <main className="main-content">
        {page === "dashboard" && <Dashboard />}
        {page === "students" && <Students />}
        {page === "teachers" && <Teachers />}
        {page === "classes" && <Classes />}
        {page === "subjects" && <Subjects />}
        {page === "attendance" && <Attendance />}
        {page === "exams" && <Exams />}
        {page === "reports" && <Reports />}
        {page === "settings" && <SettingsPage />}
      </main>
    </div>
  );
}

export default App;