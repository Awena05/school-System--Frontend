import { useState } from "react";

function Login({ onLogin, onRegister }) {
  const [zanzibarId, setZanzibarId] = useState("");
  const [employeeNumber, setEmployeeNumber] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    if (zanzibarId.length !== 9) {
      setError("Zanzibar ID must contain exactly 9 digits.");
      return;
    }

    if (employeeNumber.length !== 5) {
      setError("Employee Number must contain exactly 5 digits.");
      return;
    }

    if (!password) {
      setError("Password is required.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8080/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            zanzibarId,
            employeeNumber,
            password
          })
        }
      );

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        setError(
          typeof data === "string"
            ? data
            : data?.message || "Login failed."
        );
        return;
      }

      if (data?.success === true) {
        localStorage.removeItem("user");
        sessionStorage.removeItem("user");

        const storage = rememberMe
          ? localStorage
          : sessionStorage;

        storage.setItem("user", JSON.stringify(data));

        onLogin(data);
      } else {
        setError("Login failed.");
      }
    } catch {
      setError("Unable to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  const handleZanzibarIdChange = (e) => {
    setZanzibarId(
      e.target.value.replace(/\D/g, "").slice(0, 9)
    );
  };

  const handleEmployeeNumberChange = (e) => {
    setEmployeeNumber(
      e.target.value.replace(/\D/g, "").slice(0, 5)
    );
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <div className="login-header">
          <div className="login-icon">
            <span>SM</span>
          </div>

          <h1>School MS</h1>
          <p>School Management System</p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="login-field">
            <label>Zanzibar ID</label>

            <input
              type="text"
              value={zanzibarId}
              onChange={handleZanzibarIdChange}
              placeholder="Enter 9 digit Zanzibar ID"
              maxLength={9}
              inputMode="numeric"
              required
            />
          </div>

          <div className="login-field">
            <label>Employee Number</label>

            <input
              type="text"
              value={employeeNumber}
              onChange={handleEmployeeNumberChange}
              placeholder="Enter 5 digit Employee Number"
              maxLength={5}
              inputMode="numeric"
              required
            />
          </div>

          <div className="login-field">
            <label>Password</label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </div>

          <label className="remember-me">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <span>Remember me</span>
          </label>

          {error && (
            <div className="login-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
          >
            {loading ? "Please wait..." : "Login"}
          </button>
        </form>

        <div className="register-login">
          <span>Don't have an account?</span>

          <button
            type="button"
            onClick={onRegister}
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;