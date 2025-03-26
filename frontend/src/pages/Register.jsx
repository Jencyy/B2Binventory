import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, TextField, Button, Typography, Paper } from "@mui/material";
import axios from "axios";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/register", { name, email, password });
      alert("Registration Successful. Check Email for Verification.");
    } catch (error) {
      console.log(error);
      alert("Registration Failed");
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2, textAlign: "center", bgcolor: "var(--white)" }}>
        <Typography
          variant="h4"
          sx={{ fontWeight: "bold" }}
          style={{ color: "var(--primary-color)" }} // ✅ Fix for color
        >
          Sign Up
        </Typography>

        <TextField
          fullWidth
          label="Name"
          margin="normal"
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
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

        {/* ✅ Fix: Use `style={{ backgroundColor: "var(--primary-color)" }}` */}
        <Button
          variant="contained"
          fullWidth
          style={{
            backgroundColor: "var(--primary-color)",
            color: "var(--white)",
            fontWeight: "bold",
            marginTop: "16px",
          }}
          onClick={handleRegister}
        >
          Register
        </Button>

        <Typography variant="body2" sx={{ mt: 2 }}>
          Already have an account?{" "}
          <Button
            style={{ color: "var(--primary-color)", fontWeight: "bold", textTransform: "none" }}
            onClick={() => navigate("/login")}
          >
            Login
          </Button>
        </Typography>
      </Paper>
    </Container>
  );
};

export default Register;
