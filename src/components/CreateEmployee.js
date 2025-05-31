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

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          "https://adminpanaltest.onrender.com/api/me",
          {
            withCredentials: true,
          }
        );
        setUsername(res.data.name);
      } catch {
        setUsername("Admin");
      }
    };
    fetchUser();
  }, []);

  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    designation: "HR",
    gender: "",
    course: [],
    image: null,
  });

  const [msg, setMsg] = useState("");
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobileRegex = /^[0-9]{10}$/;

    if (!form.name.trim()) errs.name = "Name is required";
    if (!emailRegex.test(form.email)) errs.email = "Invalid email format";
    if (!mobileRegex.test(form.mobile))
      errs.mobile = "Mobile must be 10 digits";
    if (!form.gender) errs.gender = "Gender is required";
    if (form.course.length === 0) errs.course = "Select at least one course";
    if (!form.image) errs.image = "Image is required";
    else if (!["image/jpeg", "image/png"].includes(form.image.type))
      errs.image = "Only JPG/PNG allowed";

    return errs;
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "checkbox") {
      const updatedCourses = checked
        ? [...form.course, value]
        : form.course.filter((c) => c !== value);
      setForm({ ...form, course: updatedCourses });
    } else if (type === "radio") {
      setForm({ ...form, [name]: value });
    } else if (type === "file") {
      setForm({ ...form, image: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (key === "course") {
        value.forEach((v) => data.append("course", v));
      } else {
        data.append(key, value);
      }
    });

    try {
      const res = await axios.post(
        "https://adminpanaltest.onrender.com/api/employees",
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );
      setMsg(res.data.msg);
      setForm({
        name: "",
        email: "",
        mobile: "",
        designation: "HR",
        gender: "",
        course: [],
        image: null,
      });
      setErrors({});
    } catch (err) {
      setMsg(err.response?.data?.msg || "Email already exists / Server error");
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

      {/* Form Container */}
      <main
        style={{
          maxWidth: 600,
          margin: "30px auto",
          backgroundColor: "#fff",
          padding: 20,
          borderRadius: 6,
          boxShadow: "0 0 10px rgba(0,0,0,0.05)",
        }}
      >
        <h2 style={{ marginBottom: 20, color: "#007bff" }}>Create Employee</h2>

        <form onSubmit={handleSubmit} noValidate>
          <InputField
            label="Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            error={errors.name}
            placeholder="Enter full name"
          />

          <InputField
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            error={errors.email}
            placeholder="Enter email"
          />

          <InputField
            label="Mobile No"
            name="mobile"
            value={form.mobile}
            onChange={handleChange}
            error={errors.mobile}
            placeholder="10-digit mobile number"
            maxLength={10}
          />

          <div style={{ marginBottom: 15 }}>
            <label
              style={{ display: "block", marginBottom: 5, fontWeight: "600" }}
            >
              Designation
            </label>
            <select
              name="designation"
              value={form.designation}
              onChange={handleChange}
              style={selectStyle}
            >
              <option value="HR">HR</option>
              <option value="Manager">Manager</option>
              <option value="Sales">Sales</option>
            </select>
          </div>

          <div style={{ marginBottom: 15 }}>
            <label
              style={{ fontWeight: "600", marginBottom: 8, display: "block" }}
            >
              Gender
            </label>
            <label style={radioLabelStyle}>
              <input
                type="radio"
                name="gender"
                value="M"
                checked={form.gender === "M"}
                onChange={handleChange}
                style={{ marginRight: 6 }}
              />
              Male
            </label>
            <label style={radioLabelStyle}>
              <input
                type="radio"
                name="gender"
                value="F"
                checked={form.gender === "F"}
                onChange={handleChange}
                style={{ marginRight: 6 }}
              />
              Female
            </label>
            {errors.gender && <div style={errorStyle}>{errors.gender}</div>}
          </div>

          <div style={{ marginBottom: 15 }}>
            <label
              style={{ fontWeight: "600", marginBottom: 8, display: "block" }}
            >
              Courses
            </label>
            {["MCA", "BCA", "BSC"].map((course) => (
              <label key={course} style={checkboxLabelStyle}>
                <input
                  type="checkbox"
                  value={course}
                  checked={form.course.includes(course)}
                  onChange={handleChange}
                  style={{ marginRight: 6 }}
                />
                {course}
              </label>
            ))}
            {errors.course && <div style={errorStyle}>{errors.course}</div>}
          </div>

          <div style={{ marginBottom: 20 }}>
            <label
              style={{ fontWeight: "600", marginBottom: 6, display: "block" }}
            >
              Profile Image
            </label>
            <input
              type="file"
              name="image"
              accept="image/jpeg, image/png"
              onChange={handleChange}
            />
            {errors.image && <div style={errorStyle}>{errors.image}</div>}
          </div>

          <button type="submit" style={submitBtnStyle}>
            Submit
          </button>

          {msg && (
            <p
              style={{
                marginTop: 15,
                color: msg.includes("success") ? "green" : "red",
              }}
            >
              {msg}
            </p>
          )}
        </form>
      </main>
    </div>
  );
};

const InputField = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  error,
  placeholder,
  maxLength,
}) => (
  <div style={{ marginBottom: 15 }}>
    <label
      htmlFor={name}
      style={{ display: "block", marginBottom: 5, fontWeight: "600" }}
    >
      {label}
    </label>
    <input
      id={name}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      maxLength={maxLength}
      style={{
        width: "100%",
        padding: 8,
        borderRadius: 4,
        border: error ? "1.5px solid #e74c3c" : "1px solid #ccc",
        fontSize: 16,
      }}
    />
    {error && (
      <div style={{ color: "#e74c3c", marginTop: 4, fontSize: 13 }}>
        {error}
      </div>
    )}
  </div>
);

const selectStyle = {
  width: "100%",
  padding: 8,
  borderRadius: 4,
  border: "1px solid #ccc",
  fontSize: 16,
};

const radioLabelStyle = {
  marginRight: 20,
  fontWeight: "500",
  cursor: "pointer",
};

const checkboxLabelStyle = {
  marginRight: 20,
  fontWeight: "500",
  cursor: "pointer",
};

const errorStyle = {
  color: "#e74c3c",
  marginTop: 6,
  fontSize: 13,
};

const submitBtnStyle = {
  backgroundColor: "#007bff",
  color: "#fff",
  padding: "10px 20px",
  borderRadius: 6,
  border: "none",
  fontWeight: "700",
  fontSize: 16,
  cursor: "pointer",
  transition: "background-color 0.3s ease",
};

export default CreateEmployee;
