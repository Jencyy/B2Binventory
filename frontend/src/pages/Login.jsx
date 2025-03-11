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
      localStorage.setItem("userName", data.name);  // Store user name
      localStorage.setItem("userRole", data.role);
      
      alert("Login Successful");
      window.location.href = "/";  // Redirect to home page
    } catch (error) {
      alert("Invalid Credentials");
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
