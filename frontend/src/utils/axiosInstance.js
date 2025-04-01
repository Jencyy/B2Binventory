import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api", // ✅ Change this to match your API base URL
});

// ✅ Add an interceptor to handle token expiry
axiosInstance.interceptors.response.use(
  (response) => response, // Return response if successful
  (error) => {
    if (error.response && error.response.status === 401) {
      // ✅ If token is expired, log out and redirect to login page
      localStorage.removeItem("token"); // Remove expired token
      window.location.href = "/login"; // Redirect user to login page
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
