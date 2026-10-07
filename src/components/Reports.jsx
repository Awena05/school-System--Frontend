import { useEffect, useState } from "react";

function Reports() {
  const [report, setReport] = useState({
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
          throw new Error("Failed to load reports");
        }

        return response.json();
      })
      .then((data) => {
        console.log("REPORT DATA:", data);
        setReport(data);
      })
      .catch((error) => {
        console.error("REPORT ERROR:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <h2>Loading Reports...</h2>;
  }

  return (
    <div>
      <div className="topbar">
        <div>
          <h1>Reports</h1>
          <p>School management system reports</p>
        </div>
      </div>

      <div className="dashboard-cards">

        <div className="card">
          <h3>Students</h3>
          <h2>{report.students}</h2>
        </div>

        <div className="card">
          <h3>Teachers</h3>
          <h2>{report.teachers}</h2>
        </div>

        <div className="card">
          <h3>Classes</h3>
          <h2>{report.classes}</h2>
        </div>

        <div className="card">
          <h3>Subjects</h3>
          <h2>{report.subjects}</h2>
        </div>

        <div className="card">
          <h3>Exams</h3>
          <h2>{report.exams}</h2>
        </div>

        <div className="card">
          <h3>Attendance</h3>
          <h2>{report.attendance}</h2>
        </div>

      </div>
    </div>
  );
}

export default Reports;