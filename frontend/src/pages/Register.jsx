import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, TextField, Button, Typography, Paper, MenuItem } from "@mui/material";
import axios from "axios";

const Register = () => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    whatsapp: "",
    address: "",
    password: "",
    role: "businessman", // Default role is "businessman"
    passwordExpiry: 1440, // Default 1 day (in minutes)
  });

  const navigate = useNavigate();
  const userRole = localStorage.getItem("role"); // Get user role from storage

  useEffect(() => {
    if (userRole !== "admin") {
      alert("Access Denied! Only admins can register users.");
      navigate("/"); // Redirect if not admin
    }
  }, [userRole, navigate]);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    try {
      console.log("Sending data:", userData); // Debugging log
  
      const response = await axios.post("http://localhost:5000/api/auth/register", userData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
  
      console.log("Response:", response.data); // Debugging log
      alert("Registration Successful. User added.");
      navigate("/"); // Redirect after success
    } catch (error) {
      console.error("Registration Failed:", error.response?.data || error.message);
      alert("Registration Failed: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2, textAlign: "center", bgcolor: "var(--white)" }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "var(--primary-color)", mb: 2 }}>
          Admin - Add User
        </Typography>

        <TextField fullWidth label="Name" name="name" value={userData.name} onChange={handleChange} margin="normal" variant="outlined" required />
        <TextField fullWidth label="Email" name="email" type="email" value={userData.email} onChange={handleChange} margin="normal" variant="outlined" required />
        <TextField fullWidth label="Phone Number" name="phone" value={userData.phone} onChange={handleChange} margin="normal" variant="outlined" required />
        <TextField fullWidth label="WhatsApp Number" name="whatsapp" value={userData.whatsapp} onChange={handleChange} margin="normal" variant="outlined" required />
        <TextField fullWidth label="Delivery Address" name="address" value={userData.address} onChange={handleChange} margin="normal" variant="outlined" required multiline rows={2} />
        <TextField fullWidth label="Password" name="password" type="password" value={userData.password} onChange={handleChange} margin="normal" variant="outlined" required />

        {/* Role Selection */}
        <TextField select fullWidth label="Role" name="role" value={userData.role} onChange={handleChange} margin="normal" variant="outlined" required>
          <MenuItem value="businessman">Businessman</MenuItem>
          <MenuItem value="admin">Admin</MenuItem>
        </TextField>

        {/* Password Expiry Selection */}
        <TextField select fullWidth label="Password Expiry" name="passwordExpiry" value={userData.passwordExpiry} onChange={handleChange} margin="normal" variant="outlined" required>
          <MenuItem value={2}>2 Minutes</MenuItem>
          <MenuItem value={240}>4 Hours</MenuItem>
          <MenuItem value={4320}>3 Days</MenuItem>
          <MenuItem value={14400}>10 Days</MenuItem>
          <MenuItem value={0}>Never Expire</MenuItem>
        </TextField>

        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 2, bgcolor: "var(--primary-color)", color: "var(--white)", fontWeight: "bold", "&:hover": { bgcolor: "var(--sea-nymph)" } }}
          onClick={handleRegister}
        >
          Register User
        </Button>
      </Paper>
    </Container>
  );
};

export default Register;
