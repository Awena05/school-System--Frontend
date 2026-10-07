import { useEffect, useState } from "react";
import {
  GraduationCap,
  Users,
  School,
  BookOpen,
  FileText,
  ClipboardCheck,
} from "lucide-react";

function Dashboard() {
  const [stats, setStats] = useState({
    students: 0,
    teachers: 0,
    classes: 0,
    subjects: 0,
    exams: 0,
    attendance: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8080/api/reports/summary")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load dashboard data");
        }

        return response.json();
      })
      .then((data) => {
        setStats({
          students: data.students || 0,
          teachers: data.teachers || 0,
          classes: data.classes || 0,
          subjects: data.subjects || 0,
          exams: data.exams || 0,
          attendance: data.attendance || 0,
        });
      })
      .catch((error) => {
        console.error("DASHBOARD ERROR:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading Dashboard...</p>
      </div>
    );
  }

  const dashboardCards = [
    {
      title: "Students",
      value: stats.students,
      icon: <GraduationCap size={28} />,
      className: "students-card",
    },
    {
      title: "Teachers",
      value: stats.teachers,
      icon: <Users size={28} />,
      className: "teachers-card",
    },
    {
      title: "Classes",
      value: stats.classes,
      icon: <School size={28} />,
      className: "classes-card",
    },
    {
      title: "Subjects",
      value: stats.subjects,
      icon: <BookOpen size={28} />,
      className: "subjects-card",
    },
    {
      title: "Exams",
      value: stats.exams,
      icon: <FileText size={28} />,
      className: "exams-card",
    },
    {
      title: "Attendance",
      value: stats.attendance,
      icon: <ClipboardCheck size={28} />,
      className: "attendance-card",
    },
  ];

  return (
    <div className="dashboard-page">

      {/* DASHBOARD HEADER */}
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back 👋</p>
        </div>

        <div className="dashboard-date">
          <span>School Management System</span>
        </div>
      </div>

      {/* STATISTICS CARDS */}
      <div className="dashboard-cards">

        {dashboardCards.map((card) => (
          <div
            className={`dashboard-card ${card.className}`}
            key={card.title}
          >
            <div className="dashboard-card-top">

              <div className="dashboard-icon">
                {card.icon}
              </div>

              <div className="dashboard-card-info">
                <h3>{card.title}</h3>
                <p>{card.value}</p>
              </div>

            </div>
          </div>
        ))}

      </div>

      {/* OVERVIEW SECTION */}
      <div className="dashboard-overview">

        <div className="overview-card">

          <div className="overview-header">
            <div>
              <h2>School Overview</h2>
              <p>Current system statistics</p>
            </div>
          </div>

          <div className="overview-list">

            <div className="overview-item">
              <span>Students</span>
              <strong>{stats.students}</strong>
            </div>

            <div className="overview-item">
              <span>Teachers</span>
              <strong>{stats.teachers}</strong>
            </div>

            <div className="overview-item">
              <span>Classes</span>
              <strong>{stats.classes}</strong>
            </div>

            <div className="overview-item">
              <span>Subjects</span>
              <strong>{stats.subjects}</strong>
            </div>

          </div>

        </div>

        <div className="overview-card">

          <div className="overview-header">
            <div>
              <h2>Academic Activities</h2>
              <p>Exams and attendance</p>
            </div>
          </div>

          <div className="activity-box">

            <div className="activity-row">
              <div className="activity-icon">
                <FileText size={20} />
              </div>

              <div>
                <h4>Exams</h4>
                <p>{stats.exams} recorded exams</p>
              </div>
            </div>

            <div className="activity-row">
              <div className="activity-icon">
                <ClipboardCheck size={20} />
              </div>

              <div>
                <h4>Attendance</h4>
                <p>{stats.attendance} attendance records</p>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;

