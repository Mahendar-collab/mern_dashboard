import React, { useState } from "react";
import { API_URL } from "../../data/apiPath";

const Register = ({ showLoginHandler }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/vendor/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Vendor registered successfully ✅");

        // Clear form inputs
        setUsername("");
        setEmail("");
        setPassword("");

        // Redirect to login page (parent handler)
        if (showLoginHandler) showLoginHandler();
      } else {
        setError(data.error || "Registration failed ❌");
      }
    } catch (error) {
      console.error("Registration failed:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="registerSection">
      <form className="authForm" onSubmit={handleSubmit} autoComplete="off">
        <h3>Vendor Register</h3>

        {error && <p className="errorMsg">{error}</p>}

        <label>Username</label>
        <input
          type="text"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your name"
          required
        />

        <label>Email</label>
        <input
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />

        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          name="password"
          placeholder="Enter your password"
          required
        />

        <div className="btnSubmit">
          <button type="submit" disabled={loading}>
            {loading ? "Registering..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Register;
