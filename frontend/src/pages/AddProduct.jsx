import { Container, TextField, Button, Typography } from "@mui/material";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
  const [product, setProduct] = useState({ name: "", price: "", stock: "", image: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/products/add", product, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Product added successfully!");
      navigate("/"); // Redirect to home
    } catch (error) {
      alert("Error adding product");
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" sx={{ mt: 4, mb: 2 }}>Add Product</Typography>
      <TextField fullWidth label="Product Name" name="name" margin="normal" onChange={handleChange} />
      <TextField fullWidth label="Price" name="price" margin="normal" type="number" onChange={handleChange} />
      <TextField fullWidth label="Stock" name="stock" margin="normal" type="number" onChange={handleChange} />
      <TextField fullWidth label="Image URL" name="image" margin="normal" onChange={handleChange} />
      <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleSubmit}>Add Product</Button>
    </Container>
  );
};

export default AddProduct;
