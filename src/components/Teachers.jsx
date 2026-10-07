import { useEffect, useState } from "react";

function Teachers() {
  const emptyForm = {
    teacherId: "",
    fullName: "",
    subject: "",
    phone: "",
    email: "",
    status: "ACTIVE",
  };

  const [teachers, setTeachers] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const getTeachers = async () => {
    try {
      const response = await fetch("http://localhost:8080/teachers");

      if (!response.ok) {
        throw new Error("Failed to load teachers");
      }

      const data = await response.json();
      setTeachers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading teachers:", error);
      alert("Failed to load teachers");
    }
  };

  useEffect(() => {
    getTeachers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      let url = "http://localhost:8080/teachers";
      let method = "POST";

      if (editingId !== null) {
        url = "http://localhost:8080/teachers/" + editingId;
        method = "PUT";
      }

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        if (editingId !== null) {
          throw new Error("Failed to update teacher");
        } else {
          throw new Error("Failed to add teacher");
        }
      }

      if (editingId !== null) {
        alert("Teacher updated successfully!");
      } else {
        alert("Teacher added successfully!");
      }

      setForm(emptyForm);
      setEditingId(null);

      await getTeachers();
    } catch (error) {
      console.error("Teacher Error:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const editTeacher = (teacher) => {
    setForm({
      teacherId: teacher.teacherId || "",
      fullName: teacher.fullName || "",
      subject: teacher.subject || "",
      phone: teacher.phone || "",
      email: teacher.email || "",
      status: teacher.status || "ACTIVE",
    });

    setEditingId(teacher.id);
  };

  const deleteTeacher = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this teacher?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:8080/teachers/" + id,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete teacher");
      }

      alert("Teacher deleted successfully!");

      await getTeachers();
    } catch (error) {
      console.error("Delete Teacher Error:", error);
      alert("Failed to delete teacher: " + error.message);
    }
  };

  const cancelEdit = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  return (
    <div>
      <div className="topbar">
        <div>
          <h1>Teachers</h1>
          <p>Manage all teachers</p>
        </div>
      </div>

      <form className="student-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="teacherId"
          placeholder="Teacher ID"
          value={form.teacherId}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={form.fullName}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="subject"
          placeholder="Subject"
          value={form.subject}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />

        <select
          name="status"
          value={form.status}
          onChange={handleChange}
        >
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </select>

        <button type="submit" disabled={loading}>
          {loading
            ? editingId !== null
              ? "Updating..."
              : "Adding..."
            : editingId !== null
            ? "Update Teacher"
            : "Add Teacher"}
        </button>

        {editingId !== null && (
          <button
            type="button"
            onClick={cancelEdit}
            disabled={loading}
            style={{
              background: "#64748b",
              color: "white",
              border: "none",
              padding: "12px",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
        )}
      </form>

      <div className="student-table">
        <table>
          <thead>
            <tr>
              <th>Teacher ID</th>
              <th>Full Name</th>
              <th>Subject</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {teachers.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>
                  No teachers found
                </td>
              </tr>
            ) : (
              teachers.map((teacher, index) => (
                <tr key={teacher.id || index}>
                  <td>{teacher.teacherId}</td>
                  <td>{teacher.fullName}</td>
                  <td>{teacher.subject}</td>
                  <td>{teacher.phone}</td>
                  <td>{teacher.email}</td>
                  <td>{teacher.status}</td>

                  <td>
                    <button
                      type="button"
                      onClick={() => editTeacher(teacher)}
                      style={{
                        background: "#2563eb",
                        color: "white",
                        border: "none",
                        padding: "8px 12px",
                        borderRadius: "6px",
                        cursor: "pointer",
                        marginRight: "8px",
                      }}
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => deleteTeacher(teacher.id)}
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

export default Teachers;