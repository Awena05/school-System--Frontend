import { useEffect, useState } from "react";

function Attendance() {
  const emptyForm = {
    admissionNo: "",
    studentName: "",
    className: "",
    date: "",
    status: "Present",
  };

  const [attendance, setAttendance] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const getAttendance = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/attendance"
      );

      if (!response.ok) {
        throw new Error("Failed to load attendance");
      }

      const data = await response.json();
      setAttendance(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading attendance:", error);
    }
  };

  useEffect(() => {
    getAttendance();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const saveAttendance = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editingId
        ? "http://localhost:8080/api/attendance/" + editingId
        : "http://localhost:8080/api/attendance";

      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(
          errorMessage || "Failed to save attendance"
        );
      }

      const wasEditing = editingId !== null;

      setForm(emptyForm);
      setEditingId(null);

      await getAttendance();

      alert(
        wasEditing
          ? "Attendance updated successfully!"
          : "Attendance added successfully!"
      );
    } catch (error) {
      console.error("Save Attendance Error:", error);
      alert("Failed to save attendance: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const editAttendance = (record) => {
    setEditingId(record.id);

    setForm({
      admissionNo: record.admissionNo || "",
      studentName: record.studentName || "",
      className: record.className || "",
      date: record.date || "",
      status: record.status || "Present",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const deleteAttendance = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this attendance?"
      )
    ) {
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:8080/api/attendance/" + id,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete attendance");
      }

      await getAttendance();

      alert("Attendance deleted successfully!");
    } catch (error) {
      console.error("Delete Attendance Error:", error);
      alert("Failed to delete attendance: " + error.message);
    }
  };

  return (
    <div>
      <div className="topbar">
        <div>
          <h1>Attendance</h1>
          <p>Manage student attendance</p>
        </div>
      </div>

      <form
        className="student-form"
        onSubmit={saveAttendance}
      >
        <input
          type="text"
          name="admissionNo"
          placeholder="Admission No"
          value={form.admissionNo}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="studentName"
          placeholder="Student Name"
          value={form.studentName}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="className"
          placeholder="Class Name"
          value={form.className}
          onChange={handleChange}
          required
        />

        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          required
        />

        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          required
        >
          <option value="Present">Present</option>
          <option value="Absent">Absent</option>
          <option value="Late">Late</option>
        </select>

        <button type="submit" disabled={loading}>
          {loading
            ? "Saving..."
            : editingId
            ? "Update Attendance"
            : "Add Attendance"}
        </button>

        {editingId && (
          <button
            type="button"
            onClick={cancelEdit}
          >
            Cancel
          </button>
        )}
      </form>

      <div className="student-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Admission No</th>
              <th>Student Name</th>
              <th>Class Name</th>
              <th>Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {attendance.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  style={{ textAlign: "center" }}
                >
                  No attendance records found
                </td>
              </tr>
            ) : (
              attendance.map((record) => (
                <tr key={record.id}>
                  <td>{record.id}</td>
                  <td>{record.admissionNo}</td>
                  <td>{record.studentName}</td>
                  <td>{record.className}</td>
                  <td>{record.date}</td>
                  <td>{record.status}</td>

                  <td>
                    <button
                      type="button"
                      onClick={() =>
                        editAttendance(record)
                      }
                       style={{
                        background:"#2563eb",
                        color: "white",
                        border: "none",
                        padding: "8px 12px",
                        borderRadius: "6px",
                        cursor: "pointer",
                      }}
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        deleteAttendance(record.id)
                      }
                       style={{
                        background: "#dc2626",
                        color: "white",
                        border: "none",
                        padding: "8px 12px",
                        borderRadius: "6px",
                        cursor: "pointer",
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Attendance;