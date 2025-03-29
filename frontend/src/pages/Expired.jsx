const Expired = () => (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2, textAlign: "center", bgcolor: "var(--white)" }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "var(--primary-color)", mb: 2 }}>
          Password Expired
        </Typography>
        <Typography color="error" variant="h6">
          Your password has expired. Contact the admin to reset it.
        </Typography>
      </Paper>
    </Container>
  );
  export default Expired;
  