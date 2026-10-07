import { useState } from "react";

function Settings() {
  // =========================
  // SCHOOL INFORMATION
  // =========================

  const [school, setSchool] = useState({
    schoolName: "",
    address: "",
    phone: "",
    email: "",
  });

  // =========================
  // ACADEMIC SETTINGS
  // =========================

  const [academic, setAcademic] = useState({
    academicYear: "",
    term: "",
    startDate: "",
    endDate: "",
  });

  // =========================
  // ACCOUNT SETTINGS
  // =========================

  const [account, setAccount] = useState({
    username: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // =========================
  // SYSTEM SETTINGS
  // =========================

  const [system, setSystem] = useState({
    language: "",
    dateFormat: "",
    notifications: true,
  });

  // =========================
  // USER MANAGEMENT
  // =========================

  const [userForm, setUserForm] = useState({
    employeeNumber: "",
    fullName: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  const [userMessage, setUserMessage] = useState("");
  const [userError, setUserError] = useState("");
  const [creatingUser, setCreatingUser] = useState(false);

  // =========================
  // HANDLERS
  // =========================

  const handleSchoolChange = (e) => {
    setSchool({
      ...school,
      [e.target.name]: e.target.value,
    });
  };

  const handleAcademicChange = (e) => {
    setAcademic({
      ...academic,
      [e.target.name]: e.target.value,
    });
  };

  const handleAccountChange = (e) => {
    setAccount({
      ...account,
      [e.target.name]: e.target.value,
    });
  };

  const handleSystemChange = (e) => {
    const { name, value, type, checked } = e.target;

    setSystem({
      ...system,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleUserChange = (e) => {
    setUserForm({
      ...userForm,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // SAVE SCHOOL
  // =========================

  const saveSchoolSettings = (e) => {
    e.preventDefault();

    if (!school.schoolName.trim()) {
      alert("Please enter school name.");
      return;
    }

    if (!school.address.trim()) {
      alert("Please enter school address.");
      return;
    }

    if (!school.phone.trim()) {
      alert("Please enter phone number.");
      return;
    }

    if (!school.email.trim()) {
      alert("Please enter school email.");
      return;
    }

    alert("School information saved successfully!");
  };

  // =========================
  // SAVE ACADEMIC
  // =========================

  const saveAcademicSettings = (e) => {
    e.preventDefault();

    if (!academic.academicYear.trim()) {
      alert("Please enter academic year.");
      return;
    }

    if (!academic.term) {
      alert("Please select a term.");
      return;
    }

    if (!academic.startDate) {
      alert("Please select start date.");
      return;
    }

    if (!academic.endDate) {
      alert("Please select end date.");
      return;
    }

    if (academic.startDate > academic.endDate) {
      alert("Start date cannot be after end date.");
      return;
    }

    alert("Academic settings saved successfully!");
  };

  // =========================
  // SAVE ACCOUNT
  // =========================

  const saveAccountSettings = (e) => {
    e.preventDefault();

    if (!account.username.trim()) {
      alert("Please enter username.");
      return;
    }

    if (!account.currentPassword) {
      alert("Please enter current password.");
      return;
    }

    if (!account.newPassword) {
      alert("Please enter new password.");
      return;
    }

    if (!account.confirmPassword) {
      alert("Please confirm new password.");
      return;
    }

    if (account.newPassword !== account.confirmPassword) {
      alert("New password and confirm password do not match!");
      return;
    }

    if (account.newPassword.length < 6) {
      alert("New password must be at least 6 characters.");
      return;
    }

    alert("Account settings saved successfully!");
  };

  // =========================
  // SAVE SYSTEM
  // =========================

  const saveSystemSettings = (e) => {
    e.preventDefault();

    if (!system.language) {
      alert("Please select a language.");
      return;
    }

    if (!system.dateFormat) {
      alert("Please select a date format.");
      return;
    }

    alert("System settings saved successfully!");
  };

  // =========================
  // CREATE USER
  // =========================

  const createUser = async (e) => {
    e.preventDefault();

    setUserMessage("");
    setUserError("");

    if (!userForm.employeeNumber.trim()) {
      setUserError("Employee Number is required.");
      return;
    }

    if (!userForm.fullName.trim()) {
      setUserError("Full Name is required.");
      return;
    }

    if (!userForm.password) {
      setUserError("Password is required.");
      return;
    }

    if (!userForm.confirmPassword) {
      setUserError("Please confirm password.");
      return;
    }

    if (userForm.password !== userForm.confirmPassword) {
      setUserError("Passwords do not match.");
      return;
    }

    if (userForm.password.length < 6) {
      setUserError("Password must be at least 6 characters.");
      return;
    }

    if (!userForm.role) {
      setUserError("Please select a role.");
      return;
    }

    setCreatingUser(true);

    try {
      const response = await fetch(
        "http://localhost:8080/api/users",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            employeeNumber: userForm.employeeNumber.trim(),
            fullName: userForm.fullName.trim(),
            password: userForm.password,
            role: userForm.role,
          }),
        }
      );

      const data = await response.text();

      if (!response.ok) {
        throw new Error(data);
      }

      setUserMessage("User account created successfully!");

      setUserForm({
        employeeNumber: "",
        fullName: "",
        password: "",
        confirmPassword: "",
        role: "",
      });

    } catch (error) {
      setUserError(
        error.message || "Failed to create user."
      );
    } finally {
      setCreatingUser(false);
    }
  };

  return (
    <div className="settings-page">

      {/* TOPBAR */}

      <div className="topbar">
        <div>
          <h1>Settings</h1>
          <p>Manage school management system settings</p>
        </div>
      </div>

      <div className="settings-grid">

        {/* =========================
            SCHOOL INFORMATION
        ========================= */}

        <div className="settings-section">

          <div className="settings-header">
            <h2>🏫 School Information</h2>
            <p>Manage your school details</p>
          </div>

          <form
            className="settings-form"
            onSubmit={saveSchoolSettings}
          >

            <div className="form-group">
              <label>School Name</label>

              <input
                type="text"
                name="schoolName"
                value={school.schoolName}
                onChange={handleSchoolChange}
                placeholder="Enter school name"
              />
            </div>

            <div className="form-group">
              <label>Address</label>

              <input
                type="text"
                name="address"
                value={school.address}
                onChange={handleSchoolChange}
                placeholder="Enter school address"
              />
            </div>

            <div className="form-row">

              <div className="form-group">
                <label>Phone Number</label>

                <input
                  type="text"
                  name="phone"
                  value={school.phone}
                  onChange={handleSchoolChange}
                  placeholder="Enter phone number"
                />
              </div>

              <div className="form-group">
                <label>Email</label>

                <input
                  type="email"
                  name="email"
                  value={school.email}
                  onChange={handleSchoolChange}
                  placeholder="Enter school email"
                />
              </div>

            </div>

            <button
              type="submit"
              className="save-btn"
            >
              Save School Information
            </button>

          </form>
        </div>


        {/* =========================
            ACADEMIC SETTINGS
        ========================= */}

        <div className="settings-section">

          <div className="settings-header">
            <h2>📅 Academic Settings</h2>
            <p>Manage academic year and term</p>
          </div>

          <form
            className="settings-form"
            onSubmit={saveAcademicSettings}
          >

            <div className="form-row">

              <div className="form-group">
                <label>Academic Year</label>

                <input
                  type="text"
                  name="academicYear"
                  value={academic.academicYear}
                  onChange={handleAcademicChange}
                  placeholder="Example: 2026"
                />
              </div>

              <div className="form-group">
                <label>Term</label>

                <select
                  name="term"
                  value={academic.term}
                  onChange={handleAcademicChange}
                >
                  <option value="">Select Term</option>
                  <option value="Term 1">Term 1</option>
                  <option value="Term 2">Term 2</option>
                  <option value="Term 3">Term 3</option>
                </select>
              </div>

            </div>

            <div className="form-row">

              <div className="form-group">
                <label>Start Date</label>

                <input
                  type="date"
                  name="startDate"
                  value={academic.startDate}
                  onChange={handleAcademicChange}
                />
              </div>

              <div className="form-group">
                <label>End Date</label>

                <input
                  type="date"
                  name="endDate"
                  value={academic.endDate}
                  onChange={handleAcademicChange}
                />
              </div>

            </div>

            <button
              type="submit"
              className="save-btn"
            >
              Save Academic Settings
            </button>

          </form>
        </div>


        {/* =========================
            ACCOUNT SETTINGS
        ========================= */}

        <div className="settings-section">

          <div className="settings-header">
            <h2>👤 Account Settings</h2>
            <p>Manage administrator account</p>
          </div>

          <form
            className="settings-form"
            onSubmit={saveAccountSettings}
          >

            <div className="form-group">
              <label>Username</label>

              <input
                type="text"
                name="username"
                value={account.username}
                onChange={handleAccountChange}
                placeholder="Enter username"
              />
            </div>

            <div className="form-group">
              <label>Current Password</label>

              <input
                type="password"
                name="currentPassword"
                value={account.currentPassword}
                onChange={handleAccountChange}
                placeholder="Enter current password"
                style={{
                  color: "#000000",
                  backgroundColor: "#ffffff",
                  WebkitTextFillColor: "#000000",
                }}
              />
            </div>

            <div className="form-row">

              <div className="form-group">
                <label>New Password</label>

                <input
                  type="password"
                  name="newPassword"
                  value={account.newPassword}
                  onChange={handleAccountChange}
                  placeholder="Enter new password"
                  style={{
                    color: "#000000",
                    backgroundColor: "#ffffff",
                    WebkitTextFillColor: "#000000",
                  }}
                />
              </div>

              <div className="form-group">
                <label>Confirm Password</label>

                <input
                  type="password"
                  name="confirmPassword"
                  value={account.confirmPassword}
                  onChange={handleAccountChange}
                  placeholder="Confirm password"
                  style={{
                    color: "#000000",
                    backgroundColor: "#ffffff",
                    WebkitTextFillColor: "#000000",
                  }}
                />
              </div>

            </div>

            <button
              type="submit"
              className="save-btn"
            >
              Save Account Settings
            </button>

          </form>
        </div>


        {/* =========================
            SYSTEM SETTINGS
        ========================= */}

        <div className="settings-section">

          <div className="settings-header">
            <h2>🔔 System Settings</h2>
            <p>Manage system preferences</p>
          </div>

          <form
            className="settings-form"
            onSubmit={saveSystemSettings}
          >

            <div className="form-group">
              <label>Language</label>

              <select
                name="language"
                value={system.language}
                onChange={handleSystemChange}
              >
                <option value="">Select Language</option>
                <option value="English">English</option>
                <option value="Swahili">Swahili</option>
              </select>
            </div>

            <div className="form-group">
              <label>Date Format</label>

              <select
                name="dateFormat"
                value={system.dateFormat}
                onChange={handleSystemChange}
              >
                <option value="">Select Date Format</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>

            <div className="checkbox-group">
              <label>

                <input
                  type="checkbox"
                  name="notifications"
                  checked={system.notifications}
                  onChange={handleSystemChange}
                />

                Enable system notifications

              </label>
            </div>

            <button
              type="submit"
              className="save-btn"
            >
              Save System Settings
            </button>

          </form>
        </div>


        {/* =========================
            USER MANAGEMENT
        ========================= */}

        <div className="settings-section">

          <div className="settings-header">
            <h2>👥 User Management</h2>
            <p>Create employee accounts for system access</p>
          </div>

          <form
            className="settings-form"
            onSubmit={createUser}
          >

            <div className="form-group">
              <label>Employee Number</label>

              <input
                type="text"
                name="employeeNumber"
                value={userForm.employeeNumber}
                onChange={handleUserChange}
                placeholder="Example: EMP001"
              />
            </div>

            <div className="form-group">
              <label>Full Name</label>

              <input
                type="text"
                name="fullName"
                value={userForm.fullName}
                onChange={handleUserChange}
                placeholder="Enter employee full name"
              />
            </div>

            <div className="form-row">

              <div className="form-group">
                <label>Password</label>

                <input
                  type="password"
                  name="password"
                  value={userForm.password}
                  onChange={handleUserChange}
                  placeholder="Enter password"
                  style={{
                    color: "#000000",
                    backgroundColor: "#ffffff",
                    WebkitTextFillColor: "#000000",
                  }}
                />
              </div>

              <div className="form-group">
                <label>Confirm Password</label>

                <input
                  type="password"
                  name="confirmPassword"
                  value={userForm.confirmPassword}
                  onChange={handleUserChange}
                  placeholder="Confirm password"
                  style={{
                    color: "#000000",
                    backgroundColor: "#ffffff",
                    WebkitTextFillColor: "#000000",
                  }}
                />
              </div>

            </div>

            <div className="form-group">
              <label>Role</label>

              <select
                name="role"
                value={userForm.role}
                onChange={handleUserChange}
              >
                <option value="">Select Role</option>
                <option value="ADMIN">Admin</option>
                <option value="TEACHER">Teacher</option>
                <option value="ACCOUNTANT">Accountant</option>
                <option value="STAFF">Staff</option>
              </select>
            </div>

            {userError && (
              <p className="login-error">
                {userError}
              </p>
            )}

            {userMessage && (
              <p className="success-message">
                {userMessage}
              </p>
            )}

            <button
              type="submit"
              className="save-btn"
              disabled={creatingUser}
            >
              {creatingUser
                ? "Creating User..."
                : "Create User Account"}
            </button>

          </form>
        </div>

      </div>
    </div>
  );
}

export default Settings;