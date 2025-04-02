import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../redux/authSlice";
import { Container, TextField, Button, Typography, Paper, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    whatsapp: "",
    address: "",
    password: "",
    role: "businessman",
    passwordExpiry: 1440,
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    const response = await dispatch(registerUser(userData));
    if (response.meta.requestStatus === "fulfilled") {
      alert("User registered successfully");
      navigate("/");
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
        <TextField fullWidth label="Delivery Address" name="address" value={userData.address} onChange={handleChange} margin="normal" variant="outlined" required />
        <TextField fullWidth label="Password" name="password" type="password" value={userData.password} onChange={handleChange} margin="normal" variant="outlined" required />

        {error && <Typography color="error">{error}</Typography>}

        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 2, bgcolor: "var(--primary-color)", color: "var(--white)", fontWeight: "bold", "&:hover": { bgcolor: "var(--sea-nymph)" } }}
          onClick={handleRegister}
          disabled={loading}
        >
          {loading ? "Registering..." : "Register User"}
        </Button>
      </Paper>
    </Container>
  );
};

export default Register;
