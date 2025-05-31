import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { setUsername } from "../utils/auth"; // <-- fix import here

const Login = ({ setUsername: setParentUsername }) => {
  const [f_username, setFUsername] = useState("");
  const [f_password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "https://adminpanaltest.onrender.com/api/auth/login",
        { f_username, f_passward: f_password },
        { withCredentials: true }
      );

      setParentUsername(res.data.f_username);
      setUsername(res.data.f_username); // <-- use setUsername here
      navigate("/admin");
    } catch (err) {
      setError(err.response?.data?.msg || "Login failed");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto", padding: "1rem" }}>
      <h2>Admin Login</h2>
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: "1rem" }}>
          <input
            type="text"
            value={f_username}
            onChange={(e) => setFUsername(e.target.value)}
            placeholder="Username"
            required
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <input
            type="password"
            value={f_password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </div>
        <button type="submit" style={{ width: "100%", padding: "0.5rem" }}>
          Login
        </button>
        {error && <p style={{ color: "red", marginTop: "0.5rem" }}>{error}</p>}
      </form>
    </div>
  );
};

export default Login;
