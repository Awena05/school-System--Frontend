
import { useEffect, useState } from "react";

function Classes() {
  const emptyForm = {
    className: "",
    description: "",
  };

  const [classes, setClasses] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Get all classes
  const getClasses = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/classes");

      if (!response.ok) {
        throw new Error("Failed to load classes");
      }

      const data = await response.json();
      setClasses(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading classes:", error);
    }
  };

  // Load classes when page opens
  useEffect(() => {
    getClasses();
  }, []);

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Edit class
  const editClass = (schoolClass) => {
    setEditingId(schoolClass.id);

    setForm({
      className: schoolClass.className || "",
      description: schoolClass.description || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Add or Update class
  const saveClass = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let url = "http://localhost:8080/api/classes";
      let method = "POST";

      if (editingId !== null) {
        url = "http://localhost:8080/api/classes/" + editingId;
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
        const errorMessage = await response.text();
        throw new Error(
          errorMessage ||
            (editingId !== null
              ? "Failed to update class"
              : "Failed to add class")
        );
      }

      const wasEditing = editingId !== null;

      setForm(emptyForm);
      setEditingId(null);

      await getClasses();

      alert(
        wasEditing
          ? "Class updated successfully!"
          : "Class added successfully!"
      );
    } catch (error) {
      console.error("Save Class Error:", error);
      alert("Failed to save class: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Cancel edit
  const cancelEdit = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  // Delete class
  const deleteClass = async (id) => {
    if (!window.confirm("Are you sure you want to delete this class?")) {
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:8080/api/classes/" + id,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete class");
      }

      await getClasses();

      alert("Class deleted successfully!");
    } catch (error) {
      console.error("Delete Class Error:", error);
      alert("Failed to delete class: " + error.message);
    }
  };

  return (
    <div>
      {/* Page Header */}
      <div className="topbar">
        <div>
          <h1>Classes</h1>
          <p>Manage all school classes</p>
        </div>
      </div>

      {/* Add / Edit Form */}
      <form className="student-form" onSubmit={saveClass}>
        <input
          type="text"
          name="className"
          placeholder="Class Name"
          value={form.className}
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
            ? editingId !== null
              ? "Updating..."
              : "Adding..."
            : editingId !== null
            ? "Update Class"
            : "Add Class"}
        </button>

        {editingId !== null && (
          <button
            type="button"
            onClick={cancelEdit}
            style={{
              marginLeft: "8px",
              padding: "10px 15px",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
        )}
      </form>

      {/* Classes Table */}
      <div className="student-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Class Name</th>
              <th>Description</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {classes.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>
                  No classes found
                </td>
              </tr>
            ) : (
              classes.map((schoolClass) => (
                <tr key={schoolClass.id}>
                  <td>{schoolClass.id}</td>
                  <td>{schoolClass.className}</td>
                  <td>{schoolClass.description}</td>

                  <td>
                    <button
                      type="button"
                      onClick={() => editClass(schoolClass)}
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
                      onClick={() => deleteClass(schoolClass.id)}
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

export default Classes;

