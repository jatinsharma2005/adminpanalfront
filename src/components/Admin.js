import React, { useState, useEffect } from "react";
import axios from "axios";

const CreateEmployee = () => {
  const [username, setUsername] = useState("Admin");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `https://adminpanaltest.onrender.com/api/auth/me`,
          {
            withCredentials: true,
          }
        );
        setUsername(res.data.f_username);
      } catch {
        setUsername("Admin");
      }
    };
    fetchUser();
  }, []);

  return (
    <div
      style={{
        fontFamily: "Segoe UI, sans-serif",
        background: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      {/* Navigation Bar */}
      <header
        style={{
          backgroundColor: "#007bff",
          color: "#fff",
          padding: "10px 20px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <strong>Employee Portal</strong>
          </div>
          <nav>
            <a href="/admin" style={{ color: "#fff", marginRight: 20 }}>
              Home
            </a>
            <a href="/employees" style={{ color: "#fff", marginRight: 20 }}>
              Employee List
            </a>
            <a href="/create" style={{ color: "#fff", fontWeight: "bold" }}>
              Create Employee
            </a>
          </nav>
          <div>
            {username} -{" "}
            <a href="/" style={{ color: "#fff", textDecoration: "underline" }}>
              Logout
            </a>
          </div>
        </div>
      </header>

      {/* Welcome Message */}
      <main
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <h1 style={{ color: "#333" }}>Welcome, {username} 👋</h1>
      </main>
    </div>
  );
};

export default CreateEmployee;
