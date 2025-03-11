import { useState } from "react";
import { Container, TextField, Button, Typography } from "@mui/material";
import axios from "axios";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
    <Container maxWidth="sm">
      <Typography variant="h4" sx={{ mt: 4 }}>
        Register
      </Typography>
      <TextField fullWidth label="Name" margin="normal" onChange={(e) => setName(e.target.value)} />
      <TextField fullWidth label="Email" margin="normal" onChange={(e) => setEmail(e.target.value)} />
      <TextField fullWidth label="Password" type="password" margin="normal" onChange={(e) => setPassword(e.target.value)} />
      <Button variant="contained" color="primary" onClick={handleRegister} sx={{ mt: 2 }}>
        Register
      </Button>
    </Container>
  );
};

export default Register;
