import {
  Container,
  TextField,
  Button,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Card,
  CardMedia,
  Grid,
  IconButton,
  Box,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories, addCategory } from "../../redux/categorySlice";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";

const AddProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { categories } = useSelector((state) => state.categories);

  const [product, setProduct] = useState({
    name: "",
    price: "",
    stock: "",
    images: [],
    video: "",
    description: "",
    category: "",
    newCategory: "",
  });

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setProduct((prev) => ({
      ...prev,
      images: [...prev.images, ...files],
    }));
  };

  const handleImageDelete = (index) => {
    const newImages = product.images.filter((_, i) => i !== index);
    setProduct({ ...product, images: newImages });
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProduct({ ...product, video: file });
    }
  };

  const handleAddCategory = () => {
    if (product.newCategory.trim() === "") return;

    dispatch(addCategory({ name: product.newCategory })).then(() => {
      dispatch(fetchCategories());
      setProduct({ ...product, category: product.newCategory, newCategory: "" });
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("price", product.price);
    formData.append("stock", product.stock);
    formData.append("description", product.description);
    formData.append("category", product.category);

    product.images.forEach((image) => {
      formData.append("images", image);
    });

    if (product.video) {
      formData.append("video", product.video);
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      navigate("/");
    } catch (error) {
      console.error("Error adding product:", error.response?.data || error.message);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, p: 3, bgcolor: "var(--white)", borderRadius: "12px", boxShadow: "0px 5px 15px rgba(0,0,0,0.1)" }}>
      <Typography variant="h4" sx={{ textAlign: "center", fontWeight: "bold", color: "var(--primary-color)", mb: 3 }}>
        Add Product
      </Typography>

      <Grid container spacing={2}>
        {/* Product Name */}
        <Grid item xs={12}>
          <TextField fullWidth label="Product Name" name="name" onChange={handleChange} required variant="outlined" />
        </Grid>

        {/* Price & Stock */}
        <Grid item xs={6}>
          <TextField fullWidth label="Price" name="price" type="number" onChange={handleChange} required variant="outlined" />
        </Grid>
        <Grid item xs={6}>
          <TextField fullWidth label="Stock" name="stock" type="number" onChange={handleChange} required variant="outlined" />
        </Grid>

        {/* Description */}
        <Grid item xs={12}>
          <TextField fullWidth label="Description" name="description" onChange={handleChange} required multiline rows={3} variant="outlined" />
        </Grid>

        {/* Category Selection */}
        <Grid item xs={12}>
          <FormControl fullWidth variant="outlined">
            <InputLabel>Category</InputLabel>
            <Select name="category" value={product.category} onChange={handleChange} required>
              {categories.map((cat) => (
                <MenuItem key={cat._id} value={cat._id}>{cat.name}</MenuItem>
              ))}
              <MenuItem value="custom">➕ Add New Category</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* New Category Input */}
        {product.category === "custom" && (
          <Grid item xs={12} sx={{ display: "flex", gap: 2 }}>
            <TextField fullWidth label="New Category" value={product.newCategory} onChange={(e) => setProduct({ ...product, newCategory: e.target.value })} />
            <Button variant="contained" onClick={handleAddCategory} sx={{ bgcolor: "var(--primary-color)", color: "var(--white)", "&:hover": { bgcolor: "var(--sea-nymph)" } }}>
              Add
            </Button>
          </Grid>
        )}

        {/* Image Upload */}
        <Grid item xs={12}>
          <Typography variant="body1" sx={{ fontWeight: "bold" }}>Upload Images</Typography>
          <input type="file" accept="image/*" multiple onChange={handleImageUpload} />
        </Grid>

        {/* Image Preview */}
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {product.images.map((img, index) => (
            <Grid item xs={4} key={index}>
              <Card sx={{ position: "relative" }}>
                <CardMedia component="img" height="140" image={URL.createObjectURL(img)} alt={`Product Image ${index + 1}`} />
                <IconButton
                  sx={{ position: "absolute", top: 5, right: 5, background: "rgba(0,0,0,0.5)" }}
                  onClick={() => handleImageDelete(index)}
                >
                  <DeleteIcon sx={{ color: "white" }} />
                </IconButton>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Video Upload */}
        <Grid item xs={12}>
          <Typography variant="body1" sx={{ fontWeight: "bold" }}>Upload Video</Typography>
          <input type="file" accept="video/*" onChange={handleVideoUpload} />
          {product.video && (
            <Card sx={{ mt: 2 }}>
              <CardMedia component="video" controls height="200" src={URL.createObjectURL(product.video)} />
            </Card>
          )}
        </Grid>

        {/* Submit Button */}
        <Grid item xs={12}>
          <Button fullWidth variant="contained" sx={{ mt: 2, bgcolor: "var(--primary-color)", color: "var(--white)", fontWeight: "bold", "&:hover": { bgcolor: "var(--sea-nymph)" } }} onClick={handleSubmit}>
            Add Product
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AddProduct;
