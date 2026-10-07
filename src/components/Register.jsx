import { useState } from "react";

function Register({ onRegister, onLogin }) {
  const [form, setForm] = useState({
    zanzibarId: "",
    employeeNumber: "",
    fullName: "",
    password: "",
    confirmPassword: "",
    role: "STAFF"
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "zanzibarId") {
      setForm({
        ...form,
        [name]: value.replace(/\D/g, "").slice(0, 9)
      });
      return;
    }

    if (name === "employeeNumber") {
      setForm({
        ...form,
        [name]: value.replace(/\D/g, "").slice(0, 5)
      });
      return;
    }

    setForm({
      ...form,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (form.zanzibarId.length !== 9) {
      setError("Zanzibar ID must contain exactly 9 digits.");
      return;
    }

    if (form.employeeNumber.length !== 5) {
      setError("Employee Number must contain exactly 5 digits.");
      return;
    }

    if (!form.fullName.trim()) {
      setError("Full Name is required.");
      return;
    }

    if (!form.password) {
      setError("Password is required.");
      return;
    }

    if (!form.confirmPassword) {
      setError("Confirm Password is required.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8080/api/users",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(form)
        }
      );

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        setError(
          typeof data === "string"
            ? data
            : data?.message || "Registration failed."
        );
        return;
      }

      setMessage(
        data?.message || "Registration successful."
      );

      setForm({
        zanzibarId: "",
        employeeNumber: "",
        fullName: "",
        password: "",
        confirmPassword: "",
        role: "STAFF"
      });

      if (onRegister) {
        onRegister(data);
      }
    } catch (error) {
      setError("Unable to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-header">
          <h1>Create Account</h1>
          <p>Register for School Management System</p>
        </div>

        {error && (
          <div className="register-error">
            {error}
          </div>
        )}

        {message && (
          <div className="register-success">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Zanzibar ID</label>

            <input
              type="text"
              name="zanzibarId"
              value={form.zanzibarId}
              onChange={handleChange}
              placeholder="Enter 9 digit Zanzibar ID"
              maxLength="9"
              inputMode="numeric"
              required
            />
          </div>

          <div className="form-group">
            <label>Employee Number</label>

            <input
              type="text"
              name="employeeNumber"
              value={form.employeeNumber}
              onChange={handleChange}
              placeholder="Enter 5 digit Employee Number"
              maxLength="5"
              inputMode="numeric"
              required
            />
          </div>

          <div className="form-group">
            <label>Full Name</label>

            <input
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>

            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Create password"
              required
            />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>

            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm password"
              required
            />
          </div>

          <div className="form-group">
            <label>Role</label>

            <select
              name="role"
              value={form.role}
              onChange={handleChange}
            >
              <option value="STAFF">STAFF</option>
              <option value="TEACHER">TEACHER</option>
              <option value="ACCOUNTANT">ACCOUNTANT</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Creating Account..."
              : "Create Account"}
          </button>
        </form>

        <div className="register-login">
          <span>Already have an account?</span>

          <button
            type="button"
            onClick={onLogin}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default Register;