import { useEffect, useState } from "react";

function Exams() {
  const emptyForm = {
    admissionNo: "",
    studentName: "",
    className: "",
    subject: "",
    marks: "",
    grade: "",
    examType: "",
  };

  const [exams, setExams] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const getExams = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/exams"
      );

      if (!response.ok) {
        throw new Error("Failed to load exams");
      }

      const data = await response.json();
      setExams(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading exams:", error);
    }
  };

  useEffect(() => {
    getExams();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const saveExam = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editingId
        ? "http://localhost:8080/api/exams/" + editingId
        : "http://localhost:8080/api/exams";

      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          marks: Number(form.marks),
        }),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(
          errorMessage || "Failed to save exam"
        );
      }

      const wasEditing = editingId !== null;

      setForm(emptyForm);
      setEditingId(null);

      await getExams();

      alert(
        wasEditing
          ? "Exam updated successfully!"
          : "Exam added successfully!"
      );
    } catch (error) {
      console.error("Save Exam Error:", error);
      alert("Failed to save exam: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const editExam = (exam) => {
    setEditingId(exam.id);

    setForm({
      admissionNo: exam.admissionNo || "",
      studentName: exam.studentName || "",
      className: exam.className || "",
      subject: exam.subject || "",
      marks: exam.marks ?? "",
      grade: exam.grade || "",
      examType: exam.examType || "",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const deleteExam = async (id) => {
    if (!window.confirm("Are you sure you want to delete this exam?")) {
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:8080/api/exams/" + id,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete exam");
      }

      await getExams();

      alert("Exam deleted successfully!");
    } catch (error) {
      console.error("Delete Exam Error:", error);
      alert("Failed to delete exam: " + error.message);
    }
  };

  return (
    <div>
      <div className="topbar">
        <div>
          <h1>Exams</h1>
          <p>Manage student examination results</p>
        </div>
      </div>

      <form className="student-form" onSubmit={saveExam}>
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
          type="text"
          name="subject"
          placeholder="Subject"
          value={form.subject}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="marks"
          placeholder="Marks"
          min="0"
          max="100"
          value={form.marks}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="grade"
          placeholder="Grade"
          value={form.grade}
          onChange={handleChange}
          required
        />

        <select
          name="examType"
          value={form.examType}
          onChange={handleChange}
          required
        >
          <option value="">Select Exam Type</option>
          <option value="Midterm">Midterm</option>
          <option value="Terminal">Terminal</option>
          <option value="Annual">Annual</option>
          <option value="Mock">Mock</option>
        </select>

        <button type="submit" disabled={loading}>
          {loading
            ? "Saving..."
            : editingId
            ? "Update Exam"
            : "Add Exam"}
        </button>

        {editingId && (
          <button type="button" onClick={cancelEdit}
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
              <th>Subject</th>
              <th>Marks</th>
              <th>Grade</th>
              <th>Exam Type</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {exams.length === 0 ? (
              <tr>
                <td
                  colSpan="9"
                  style={{ textAlign: "center" }}
                >
                  No exams found
                </td>
              </tr>
            ) : (
              exams.map((exam) => (
                <tr key={exam.id}>
                  <td>{exam.id}</td>
                  <td>{exam.admissionNo}</td>
                  <td>{exam.studentName}</td>
                  <td>{exam.className}</td>
                  <td>{exam.subject}</td>
                  <td>{exam.marks}</td>
                  <td>{exam.grade}</td>
                  <td>{exam.examType}</td>

                  <td>
                    <button
                      type="button"
                      onClick={() => editExam(exam)}
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
                      onClick={() => deleteExam(exam.id)}
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

export default Exams;