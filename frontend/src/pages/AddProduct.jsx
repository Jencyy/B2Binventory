import { Container, TextField, Button, Typography, Select, MenuItem, InputLabel, FormControl } from "@mui/material";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../redux/categorySlice";
import { addProduct } from "../redux/productSlice";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { categories, loading: categoryLoading } = useSelector((state) => state.categories);

  const [product, setProduct] = useState({
    name: "",
    price: "",
    stock: "",
    image: "",
    description: "",
    video: "",
    category: "",
  });

  useEffect(() => {
    dispatch(fetchCategories()); // Fetch categories from Redux
  }, [dispatch]);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(addProduct(product));
    alert("Product added successfully!");
    navigate("/");
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" sx={{ mt: 4, mb: 2 }}>Add Product</Typography>
      <TextField fullWidth label="Product Name" name="name" margin="normal" onChange={handleChange} required />
      <TextField fullWidth label="Price" name="price" margin="normal" type="number" onChange={handleChange} required />
      <TextField fullWidth label="Stock" name="stock" margin="normal" type="number" onChange={handleChange} required />
      <TextField fullWidth label="Image URL" name="image" margin="normal" onChange={handleChange} required />
      <TextField fullWidth label="Description" name="description" margin="normal" onChange={handleChange} required />
      <TextField fullWidth label="Video URL (optional)" name="video" margin="normal" onChange={handleChange} />

      {/* Category Selection */}
      <FormControl fullWidth margin="normal">
        <InputLabel>Category</InputLabel>
        <Select name="category" value={product.category} onChange={handleChange} required>
          {categories.map((cat) => (
            <MenuItem key={cat._id} value={cat._id}>{cat.name}</MenuItem> // ✅ Correct
          ))}
        </Select>

      </FormControl>

      <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleSubmit}>Add Product</Button>
    </Container>
  );
};

export default AddProduct;
