import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";

const designationOptions = ["HR", "MANAGER", "SALES"];
const courseOptions = ["MCA", "BCA", "BSC"];
const EditEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const backendURL = "https://adminpanaltest.onrender.com";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    designation: "",
    gender: "",
    course: [],
  });

  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const res = await axios.get(`${backendURL}/api/employees/${id}`, {
          withCredentials: true,
        });
        const emp = res.data;

        setFormData({
          name: emp.name,
          email: emp.email,
          mobile: emp.mobile,
          designation: emp.designation,
          gender: emp.gender,
          course: emp.course || [],
        });

        // Handle absolute or relative image path
        const imagePath = emp.image
          ? emp.image.startsWith("http")
            ? emp.image
            : `${backendURL}/uploads/${emp.image}`
          : "";

        setPreviewImage(imagePath);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch employee data");
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "course") {
      const updatedCourses = checked
        ? [...formData.course, value]
        : formData.course.filter((c) => c !== value);
      setFormData((prev) => ({ ...prev, course: updatedCourses }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((item) => data.append(key, item));
        } else {
          data.append(key, value);
        }
      });
      if (imageFile) data.append("image", imageFile);

      await axios.put(`${backendURL}/api/employees/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      alert("Employee updated successfully!");
      navigate("/employees");
    } catch (err) {
      alert("Failed to update employee.");
      console.error(err);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Edit Employee</h2>
      <Link to="/employees" style={styles.backLink}>
        &larr; Back to Employee List
      </Link>
      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        style={styles.form}
      >
        <FormGroup
          label="Name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
        <FormGroup
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
        <FormGroup
          label="Mobile"
          type="text"
          name="mobile"
          value={formData.mobile}
          onChange={handleChange}
        />

        <div style={styles.formGroup}>
          <label style={styles.label}>Designation:</label>
          <select
            name="designation"
            value={formData.designation}
            onChange={handleChange}
            required
            style={styles.select}
          >
            <option value="">-- Select Designation --</option>
            {designationOptions.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Gender:</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
            style={styles.select}
          >
            <option value="">Select gender</option>
            <option value="M">Male</option>
            <option value="F">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Courses:</label>
          <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
            {courseOptions.map((c) => (
              <label
                key={c}
                style={{ display: "flex", alignItems: "center", gap: "5px" }}
              >
                <input
                  type="checkbox"
                  name="course"
                  value={c}
                  checked={formData.course.includes(c)}
                  onChange={handleChange}
                />
                {c}
              </label>
            ))}
          </div>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Profile Image:</label>
          {previewImage && (
            <img
              src={previewImage}
              alt="preview"
              onError={(e) => (e.target.src = "/default-avatar.png")}
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                objectFit: "cover",
                marginBottom: "10px",
                border: "1px solid #ccc",
              }}
            />
          )}
          <label style={styles.fileInputLabel}>
            Upload New Image
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
          </label>
        </div>

        <button type="submit" style={styles.button}>
          Update Employee
        </button>
      </form>
    </div>
  );
};

// Reusable Form Group
const FormGroup = ({ label, type, name, value, onChange }) => (
  <div style={styles.formGroup}>
    <label style={styles.label}>{label}:</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required
      style={styles.input}
    />
  </div>
);

// Style object
const styles = {
  container: {
    maxWidth: "600px",
    margin: "30px auto",
    padding: "20px",
    borderRadius: "8px",
    backgroundColor: "#fff",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    fontFamily: "Segoe UI, sans-serif",
  },
  header: {
    color: "#007bff",
    marginBottom: "10px",
  },
  backLink: {
    display: "inline-block",
    marginBottom: "20px",
    textDecoration: "none",
    color: "#007bff",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    marginBottom: "6px",
    fontWeight: "600",
  },
  input: {
    padding: "8px 10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    fontSize: "1rem",
  },
  select: {
    padding: "8px 10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    fontSize: "1rem",
  },
  button: {
    padding: "10px 15px",
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    fontSize: "1rem",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "600",
  },
  fileInputLabel: {
    display: "inline-block",
    backgroundColor: "#007bff",
    color: "#fff",
    padding: "8px 12px",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "0.9rem",
    textAlign: "center",
  },
};

export default EditEmployee;
