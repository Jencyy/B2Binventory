import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Typography, Button } from "@mui/material";

const Expired = () => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.clear(); // ✅ Ensures no old tokens remain
  }, []);

  return (
    <Container maxWidth="sm" sx={{ textAlign: "center", mt: 8 }}>
      <Typography variant="h5" color="error">Your password has expired!</Typography>
      <Typography variant="body1" sx={{ mt: 2 }}>Please contact the admin to reset your password.</Typography>
      <Button 
        variant="contained" 
        sx={{ mt: 3 }} 
        onClick={() => navigate("/login")}
      >
        Go to Login
      </Button>
    </Container>
  );
};

export default Expired;
