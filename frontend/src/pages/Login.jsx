import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, loginSuccess } from "../../redux/authSlice";
import { Container, TextField, Button, Typography, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleLogin = async () => {
    try {
      const response = await dispatch(loginUser({ email, password })).unwrap();
      console.log("API Response:", response);

      const { id, name, role, token } = response;

      dispatch(loginSuccess({ user: { id, name, role }, token }));
      localStorage.setItem("user", JSON.stringify({ id, name, role }));
      localStorage.setItem("token", token);
      localStorage.setItem("role", role); // ✅ Store role for role-based UI handling

      navigate("/"); // Redirect after successful login
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 2,
          textAlign: "center",
          bgcolor: "var(--white)",
        }}
      >
        <Typography
          variant="h4"
          sx={{ fontWeight: "bold", color: "var(--primary-color)", mb: 2 }}
        >
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

        {error && <Typography color="error">{error}</Typography>}

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
          disabled={loading}
          fullWidth
        >
          {loading ? "Logging in..." : "Login"}
        </Button>
      </Paper>
    </Container>
  );
};

export default Login;
