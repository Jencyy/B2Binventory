import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, TextField, Button, Typography, Box, Paper } from "@mui/material";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const { data } = await axios.post("http://localhost:5000/api/auth/login", { email, password });

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role); // ✅ Store role

      window.location.href = "/"; // Redirect after login
    } catch (error) {
      alert("Login failed: " + (error.response?.data?.message || error.message));
    }
  };

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
          sx={{
            mt: 3,
            bgcolor: "var(--primary-color)",
            color: "var(--white)",
            fontWeight: "bold",
            "&:hover": { bgcolor: "var(--sea-nymph)" },
          }}
          onClick={handleLogin}
          fullWidth
        >
          Login
        </Button>

        {/* ✅ Sign Up Link */}
        <Typography variant="body2" sx={{ mt: 2 }}>
          Don't have an account?{" "}
          <Button
            sx={{ color: "var(--primary-color)", fontWeight: "bold", textTransform: "none" }}
            onClick={() => navigate("/register")}
          >
            Sign Up
          </Button>
        </Typography>
      </Paper>
    </Container>
  );
};

export default Login;
