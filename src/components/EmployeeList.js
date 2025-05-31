import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);

  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const backendURL = "https://adminpanaltest.onrender.com";

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

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${backendURL}/api/me`, {
          withCredentials: true,
        });
        setUsername(res.data.f_username); // Fixed field
      } catch {
        setUsername("Admin");
      }
    };

    const fetchEmployees = async () => {
      try {
        const res = await axios.get(`${backendURL}/api/employees`, {
          withCredentials: true,
        });
        setEmployees(res.data);
      } catch (err) {
        console.error("Failed to fetch employees", err);
      }
    };

    fetchUser();
    fetchEmployees();
  }, []);

  const filteredEmployees = employees.filter((emp) =>
    emp.course.some((c) =>
      c.toLowerCase().includes(search.trim().toLowerCase())
    )
  );

  const handleEdit = (id) => {
    navigate(`/edit/${id}`);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?"))
      return;
    try {
      await axios.delete(`${backendURL}/api/employees/${id}`, {
        withCredentials: true,
      });
      setEmployees((prev) => prev.filter((emp) => emp._id !== id));
      alert("Employee deleted successfully");
    } catch (err) {
      alert("Failed to delete employee");
      console.error(err);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        `${backendURL}/api/auth/logout`,
        {},
        { withCredentials: true }
      );
      navigate("/");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

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
            <Link
              to="/admin"
              style={{ color: "#fff", marginRight: 20, textDecoration: "none" }}
            >
              Home
            </Link>
            <Link
              to="/employees"
              style={{
                color: "#fff",
                marginRight: 20,
                fontWeight: "bold",
                textDecoration: "none",
              }}
            >
              Employee List
            </Link>
            <Link
              to="/create"
              style={{ color: "#fff", textDecoration: "none" }}
            >
              Create Employee
            </Link>
          </nav>
          <div>
            {username} -{" "}
            <button
              onClick={handleLogout}
              style={{
                color: "#fff",
                background: "none",
                border: "none",
                textDecoration: "underline",
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ padding: 20 }}>
        <h2 style={{ marginTop: 20, color: "#007bff" }}>Employee List</h2>

        {/* Search and Count */}
        <div
          style={{
            marginBottom: 10,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ fontWeight: "600" }}>
            Total Count: {filteredEmployees.length}
          </div>
          <input
            type="text"
            placeholder="Search by Course"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              padding: "6px 10px",
              borderRadius: "4px",
              border: "1.5px solid #ccc",
              width: "200px",
              fontSize: "1rem",
              outline: "none",
              transition: "border-color 0.3s ease",
            }}
          />
        </div>

        {/* Table */}
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              backgroundColor: "white",
              boxShadow: "0 1px 5px rgba(0,0,0,0.1)",
              borderRadius: "6px",
              overflow: "hidden",
            }}
          >
            <thead
              style={{
                backgroundColor: "#007bff",
                color: "white",
              }}
            >
              <tr>
                <th>#</th>
                <th>Image</th>
                <th>Name</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Designation</th>
                <th>Gender</th>
                <th>Course</th>
                <th>Create Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((emp, index) => (
                <tr
                  key={emp._id}
                  style={{
                    backgroundColor: index % 2 === 0 ? "#f3faff" : "white",
                    borderBottom: "1px solid #ddd",
                  }}
                >
                  <td style={{ padding: 8, textAlign: "center" }}>
                    {index + 1}
                  </td>
                  <td style={{ padding: 8, textAlign: "center" }}>
                    <img
                      src={
                        emp.image?.startsWith("http")
                          ? emp.image
                          : emp.image
                          ? `${backendURL}/uploads/${emp.image}`
                          : "/default-avatar.png"
                      }
                      alt="profile"
                      width="40"
                      height="40"
                      style={{ borderRadius: "50%", objectFit: "cover" }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/default-avatar.png";
                      }}
                    />
                  </td>
                  <td style={{ padding: 8 }}>{emp.name}</td>
                  <td style={{ padding: 8 }}>
                    <a
                      href={`mailto:${emp.email}`}
                      style={{ color: "#007bff", textDecoration: "none" }}
                    >
                      {emp.email}
                    </a>
                  </td>
                  <td style={{ padding: 8 }}>{emp.mobile}</td>
                  <td style={{ padding: 8 }}>{emp.designation}</td>
                  <td style={{ padding: 8 }}>
                    {emp.gender === "M"
                      ? "Male"
                      : emp.gender === "F"
                      ? "Female"
                      : emp.gender}
                  </td>
                  <td style={{ padding: 8 }}>{emp.course.join(", ")}</td>
                  <td style={{ padding: 8 }}>
                    {emp.createdAt
                      ? new Date(emp.createdAt).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                      : "N/A"}
                  </td>
                  <td style={{ padding: 8 }}>
                    <button
                      onClick={() => handleEdit(emp._id)}
                      style={{
                        marginRight: 6,
                        backgroundColor: "#4caf50",
                        border: "none",
                        color: "white",
                        padding: "6px 12px",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontWeight: "600",
                        fontSize: "0.9rem",
                        transition: "background-color 0.3s ease",
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(emp._id)}
                      style={{
                        backgroundColor: "#e53935",
                        border: "none",
                        color: "white",
                        padding: "6px 12px",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontWeight: "600",
                        fontSize: "0.9rem",
                        transition: "background-color 0.3s ease",
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {filteredEmployees.length === 0 && (
                <tr>
                  <td
                    colSpan={10}
                    style={{ textAlign: "center", padding: "15px" }}
                  >
                    No employees found matching the course filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default EmployeeList;
