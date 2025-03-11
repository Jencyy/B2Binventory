import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Typography, CircularProgress, Alert, Button } from "@mui/material";

const VerifyEmail = () => {
  const { token } = useParams(); // Get token from URL
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/auth/verify-email/${token}`);
        setMessage(response.data.message);
      } catch (err) {
        setError(true);
        setMessage(err.response?.data?.error || "Invalid or expired token.");
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <Container maxWidth="sm" sx={{ mt: 5, textAlign: "center" }}>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Alert severity="error">{message}</Alert>
      ) : (
        <>
          <Alert severity="success">{message}</Alert>
          <Button variant="contained" color="primary" sx={{ mt: 3 }} onClick={() => navigate("/login")}>
            Go to Login
          </Button>
        </>
      )}
    </Container>
  );
};

export default VerifyEmail;
