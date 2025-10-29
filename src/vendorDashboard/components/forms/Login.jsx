import React, { useState } from "react";
import { API_URL } from "../../data/apiPath";
import { ThreeCircles } from "react-loader-spinner";

const Login = ({ showWelcomeHandler }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const loginHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // ✅ Send login request
      const response = await fetch(`${API_URL}/vendor/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      // ✅ Handle success case first
      if (response.ok) {
        console.log("Login success response:", data);

        // Show success message only once
        alert("Login successful ✅");

        // Clear inputs
        setEmail("");
        setPassword("");

        // Save token
        localStorage.setItem("loginToken", data.token);

        // Optional: run parent callback
        if (showWelcomeHandler) showWelcomeHandler();

        // ✅ Fetch vendor details if vendorId is returned
        if (data.vendorId) {
          try {
            const vendorResponse = await fetch(
              `${API_URL}/vendor/single-vendor/${data.vendorId}`
            );
            const vendorData = await vendorResponse.json();

            if (vendorResponse.ok) {
              const vendorFirmId = vendorData.vendorFirmId;
              const vendorFirmName = vendorData.vendor?.firm?.[0]?.firmName;

              localStorage.setItem("firmId", vendorFirmId);
              localStorage.setItem("firmName", vendorFirmName);
              window.location.reload()
            } else {
              console.error("Failed to fetch vendor:", vendorData);
            }
          } catch (err) {
            console.error("Error fetching vendor details:", err);
          }
        }

        // ✅ Stop function here — prevents running fail alert
        return;
      }

      // ❌ Handle failure properly
      console.warn("Login failed:", data);
      alert(data.error || "Invalid email or password ❌");
    } catch (error) {
      console.error("Error during login:", error);
      alert("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="loginSection">
      {loading ? (
        <div className="loaderSection">
          <ThreeCircles
            visible={loading}
            height={100}
            width={100}
            color="#4fa94d"
            ariaLabel="three-circles-loading"
          />
          <p>Logging in... Please wait</p>
        </div>
      ) : (
        <form className="authForm" onSubmit={loginHandler} autoComplete="off">
          <h3>Vendor Login</h3>

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
            type={showPassword ? "text" : "password"}
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />

          <span className="showPassword" onClick={handleShowPassword}>
            {showPassword ? "Hide" : "Show"}
          </span>

          <div className="btnSubmit">
            <button type="submit" disabled={loading}>
              Submit
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Login;
