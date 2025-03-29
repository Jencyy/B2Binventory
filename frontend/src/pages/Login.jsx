import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, TextField, Button, Typography, Paper } from "@mui/material";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const { data } = await axios.post("http://localhost:5000/api/auth/login", { email, password });
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("userName", data.name);
      window.location.href = "/";
    } catch (error) {
      alert(error.response?.data?.message || "Login failed!");
    }
  };
  useEffect(() => {
    const expiry = localStorage.getItem("passwordExpiry");
    if (expiry && new Date() > new Date(expiry)) {
      alert("Your password has expired. Contact admin.");
      localStorage.clear();
      navigate("/expired");
    }
  }, []);

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2, textAlign: "center", bgcolor: "var(--white)" }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "var(--primary-color)", mb: 2 }}>
          Login
        </Typography>

        <TextField
          fullWidth
          label="Email"
          margin="normal"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          fullWidth
          label="Password"
          type="password"
          margin="normal"
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button
          variant="contained"
          sx={{ mt: 3, bgcolor: "var(--primary-color)", color: "var(--white)", fontWeight: "bold", "&:hover": { bgcolor: "var(--sea-nymph)" } }}
          onClick={handleLogin}
          fullWidth
        >
          Login
        </Button>
      </Paper>
    </Container>
  );
};

export default Login;