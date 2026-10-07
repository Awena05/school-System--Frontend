import { useEffect, useState } from "react";

function Subjects() {
  const emptyForm = {
    subjectCode: "",
    subjectName: "",
    description: "",
  };

  const [subjects, setSubjects] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Get all subjects
  const getSubjects = async () => {
    try {
      const response = await fetch("http://localhost:8080/subjects");

      if (!response.ok) {
        throw new Error("Failed to load subjects");
      }

      const data = await response.json();
      setSubjects(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading subjects:", error);
    }
  };

  // Load subjects when page opens
  useEffect(() => {
    getSubjects();
  }, []);

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Add or update subject
  const saveSubject = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editingId
        ? "http://localhost:8080/subjects/" + editingId
        : "http://localhost:8080/subjects";

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
        throw new Error(errorMessage || "Failed to save subject");
      }

      setForm(emptyForm);
      setEditingId(null);

      await getSubjects();

      alert(
        editingId
          ? "Subject updated successfully!"
          : "Subject added successfully!"
      );
    } catch (error) {
      console.error("Save Subject Error:", error);
      alert("Failed to save subject: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Edit subject
  const editSubject = (subject) => {
    setEditingId(subject.id);

    setForm({
      subjectCode: subject.subjectCode || "",
      subjectName: subject.subjectName || "",
      description: subject.description || "",
    });
  };

  // Cancel edit
  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  // Delete subject
  const deleteSubject = async (id) => {
    if (!window.confirm("Are you sure you want to delete this subject?")) {
      return;
    }

    try {
      const url = "http://localhost:8080/subjects/" + id;

      const response = await fetch(url, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete subject");
      }

      await getSubjects();

      alert("Subject deleted successfully!");
    } catch (error) {
      console.error("Delete Subject Error:", error);
      alert("Failed to delete subject: " + error.message);
    }
  };

  return (
    <div>
      {/* Page Header */}
      <div className="topbar">
        <div>
          <h1>Subjects</h1>
          <p>Manage all school subjects</p>
        </div>
      </div>

      {/* Subject Form */}
      <form className="student-form" onSubmit={saveSubject}>
        <input
          type="text"
          name="subjectCode"
          placeholder="Subject Code"
          value={form.subjectCode}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="subjectName"
          placeholder="Subject Name"
          value={form.subjectName}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
        />

        <button type="submit" disabled={loading}>
          {loading
            ? "Saving..."
            : editingId
            ? "Update Subject"
            : "Add Subject"}
        </button>

        {editingId && (
          <button type="button" onClick={cancelEdit}>
            Cancel
          </button>
        )}
      </form>

      {/* Subjects Table */}
      <div className="student-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Subject Code</th>
              <th>Subject Name</th>
              <th>Description</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {subjects.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  No subjects found
                </td>
              </tr>
            ) : (
              subjects.map((subject) => (
                <tr key={subject.id}>
                  <td>{subject.id}</td>
                  <td>{subject.subjectCode}</td>
                  <td>{subject.subjectName}</td>
                  <td>{subject.description}</td>
                  <td>
                    <button
                      type="button"
                      onClick={() => editSubject(subject)}
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
                      onClick={() => deleteSubject(subject.id)}
                       style={{
                        background: "#dc2626",
                        color: "white",
                        border: "none",
                        padding: "8px 12px",
                        borderRadius: "6px",
                        cursor: "pointer",
                        marginRight: "8px",
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

export default Subjects;