import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, TextField, Button, Typography } from "@mui/material";
import axios from "axios";

const Login = ({ setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const { data } = await axios.post("http://localhost:5000/api/auth/login", { email, password });
      
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role); // ✅ Store role
      
      window.location.reload(); // Refresh to apply role-based UI
      window.location.href = "/"; 
    } catch (error) {
      alert("Login failed: " + error.response?.data?.message || error.message);
    }
  };
  
  return (
    <Container maxWidth="sm">
      <Typography variant="h4" sx={{ mt: 4 }}>
        Login
      </Typography>
      <TextField fullWidth label="Email" margin="normal" onChange={(e) => setEmail(e.target.value)} />
      <TextField fullWidth label="Password" type="password" margin="normal" onChange={(e) => setPassword(e.target.value)} />
      <Button variant="contained" color="primary" onClick={handleLogin} sx={{ mt: 2 }}>
        Login
      </Button>
    </Container>
  );
};

export default Login;
