import { useEffect, useState } from "react";

function Students() {
  const emptyForm = {
    admissionNo: "",
    fullName: "",
    className: "",
    gender: "",
    dateOfBirth: "",
    phone: "",
    status: "ACTIVE",
  };

  const [students, setStudents] = useState([]);
  const [search,setSearch]=useState("");
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Get all students
  const getStudents = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/students");

      if (!response.ok) {
        throw new Error("Failed to load students");
      }

      const data = await response.json();

      // Make sure we receive an array
      setStudents(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading students:", error);
    }
  };

  useEffect(() => {
    getStudents();
  }, []);

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Add student
  const addStudent = async (e) => {
    e.preventDefault();
if (editingId) {
  try {
    const response = await fetch(
      `http://localhost:8080/api/students/${editingId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update student");
    }

    setForm(emptyForm);
    setEditingId(null);
    await getStudents();

    alert("Student updated successfully!");
  } catch (error) {
    console.error("Update Student Error:", error);
    alert("Failed to update student: " + error.message);
  }

  return;
}
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/api/students", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage || "Failed to add student");
      }
      
      
      

      // Clear form
      setForm(emptyForm);

      // Load students again
      await getStudents();

      alert("Student added successfully!");
    } catch (error) {
      console.error("Add Student Error:", error);
      alert("Failed to add student: " + error.message);
    } finally {
      setLoading(false);
    }
  };
  
const editStudent = (student) => {
  setEditingId(student.id);

  setForm({
    admissionNo: student.admissionNo,
    fullName: student.fullName,
    className: student.className,
    gender: student.gender,
    dateOfBirth: student.dateOfBirth,
    phone: student.phone,
    status: student.status,
  });
};

const deleteStudent = async (id) => {
  if (!window.confirm("Are you sure you want to delete this student?")) {
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:8080/api/students/${id}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to delete student");
    }

    await getStudents();

    alert("Student deleted successfully!");
  } catch (error) {
    console.error("Delete Student Error:", error);
    alert("Failed to delete student: " + error.message);
  }
};
const filteredStudents = students.filter((student) =>
  student.admissionNo.toLowerCase().includes(search.toLowerCase()) ||
  student.fullName.toLowerCase().includes(search.toLowerCase()) ||
  student.className.toLowerCase().includes(search.toLowerCase())
);
  return (
    <div>
      {/* Page Header */}
      <div className="topbar">
        <div>
          <h1>Students</h1>
          <p>Manage all students</p>
        </div>
      </div>

      {/* Add Student Form */}
      <form className="student-form" onSubmit={addStudent}>
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
          name="fullName"
          placeholder="Full Name"
          value={form.fullName}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="className"
          placeholder="Class"
          value={form.className}
          onChange={handleChange}
          required
        />

        <select
          name="gender"
          value={form.gender}
          onChange={handleChange}
          required
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>

        <input
          type="date"
          name="dateOfBirth"
          value={form.dateOfBirth}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="phone"
          placeholder="Phone of Parent"
          value={form.phone}
          onChange={handleChange}
          required
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
  {editingId ? "Update Student" : "Add Student"}
</button>
{editingId && (
  <button
    type="button"
    onClick={() => {
      setForm(emptyForm);
      setEditingId(null);
    }}
  >
    Cancel
  </button>
)}
      </form>
      
      {/* Students Table */}
      <div className="student-table">
        {/* Search Student */}
<div className="search-box">
  <input
    type="text"
    placeholder="Search student..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />
</div>
        <table>
          <thead>
            <tr>
              <th>Admission No</th>
              <th>Full Name</th>
              <th>Class</th>
              <th>Gender</th>
              <th>Date of Birth</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {students.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: "center" }}>
                  No students found
                </td>
              </tr>
            ) : (
              filteredStudents.map((student, index) => (
                <tr key={student.id || index}>
                  <td>{student.admissionNo}</td>
                  <td>{student.fullName}</td>
                  <td>{student.className}</td>
                  <td>{student.gender}</td>
                  <td>{student.dateOfBirth}</td>
                  <td>{student.phone}</td>
                  <td>{student.status}</td>
                  <td>
   <button
                      type="button"
                      onClick={() => editStudent(student)}
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
                      onClick={() => deleteStudent(student.id)}
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

export default Students;
