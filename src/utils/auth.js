export const getUsername = () => {
  try {
    return localStorage.getItem("username");
  } catch {
    return null;
  }
};

export const setToken = (token) => {
  try {
    localStorage.setItem("token", token);
  } catch (err) {
    console.warn("Failed to set token in localStorage", err);
  }
};

export const getToken = () => {
  try {
    return localStorage.getItem("token");
  } catch {
    return null;
  }
};

export const removeToken = () => {
  try {
    localStorage.removeItem("token");
  } catch {}
};

// Check login by presence of token or username (your choice)
export const isLoggedIn = () => {
  return !!getToken() || !!getUsername();
};

export const setUsername = (username) => {
  localStorage.setItem("username", username);
};

export const removeUsername = () => {
  localStorage.removeItem("username");
};

// Clear all auth info from localStorage
export const logout = () => {
  removeToken();
  removeUsername();
};
