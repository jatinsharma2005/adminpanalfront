import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import axios from "axios";

import Login from "./components/Login";
import Admin from "./components/Admin";
import CreateEmployee from "./components/CreateEmployee";
import EmployeeList from "./components/EmployeeList";
import EditEmployee from "./components/EditEmployee";

import { isLoggedIn, setUsername, removeUsername } from "./utils/auth";

function App() {
  const [username, setUsernameState] = useState(
    localStorage.getItem("username") || ""
  );

  useEffect(() => {
    if (!username) {
      axios
        .get("https://adminpanaltest.onrender.com/api/auth/me", {
          withCredentials: true,
        })
        .then((res) => {
          setUsernameState(res.data.f_username);
          setUsername(res.data.f_username); // <-- use updated function here
        })
        .catch(() => {
          setUsernameState("");
          removeUsername(); // <-- updated function here
        });
    }
  }, [username]);

  const handleSetUsername = (user) => {
    setUsernameState(user);
    setUsername(user);
  };

  const handleLogout = () => {
    setUsernameState("");
    removeUsername();
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login setUsername={handleSetUsername} />} />

        <Route
          path="/admin"
          element={
            isLoggedIn() ? (
              <Admin username={username} setUsername={handleSetUsername} />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/create"
          element={
            isLoggedIn() ? (
              <CreateEmployee username={username} />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/employees"
          element={
            isLoggedIn() ? (
              <EmployeeList username={username} />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/edit/:id"
          element={isLoggedIn() ? <EditEmployee /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
