import { 
  Container, TextField, Button, Typography, Select, MenuItem, 
  InputLabel, FormControl, Card, CardMedia, Grid, IconButton, Box 
} from "@mui/material";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories, addCategory } from "../redux/categorySlice"; // Ensure addCategory exists in categorySlice
import { addProduct } from "../redux/productSlice";
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
    newCategory: "", // New category input
  });

  useEffect(() => {
    dispatch(fetchCategories()); // Fetch categories when component loads
  }, [dispatch]);

  // ✅ Handle Input Change
  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  // ✅ Handle Image Upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => URL.createObjectURL(file));
    setProduct({ ...product, images: [...product.images, ...newImages] });
  };

  // ✅ Handle Image Delete
  const handleImageDelete = (index) => {
    const newImages = product.images.filter((_, i) => i !== index);
    setProduct({ ...product, images: newImages });
  };

  // ✅ Handle Video Upload
  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const videoUrl = URL.createObjectURL(file);
      setProduct({ ...product, video: videoUrl });
    }
  };

  // ✅ Handle Category Addition
  const handleAddCategory = () => {
    if (product.newCategory.trim() === "") return;
    
    dispatch(addCategory({ name: product.newCategory })).then(() => {
      dispatch(fetchCategories()); // Refresh categories after adding
      setProduct({ ...product, category: product.newCategory, newCategory: "" });
    });
  };

  // ✅ Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("price", product.price);
    formData.append("stock", product.stock);
    formData.append("description", product.description);
    formData.append("category", product.category);
    
  
    product.images.forEach((image) => {
      formData.append("images", image); // ✅ Append actual files
    });
  
    if (product.video) {
      formData.append("video", product.video); // ✅ Append video file
    }
  
    console.log("Submitting Product:", formData);
  
    dispatch(addProduct(formData))
      .unwrap()
      .then(() => {
        alert("Product added successfully!");
        navigate("/"); // Redirect after success
      })
      .catch((error) => {
        alert("Error adding product: " + error.message);
      });
  };
  

  return (
    <Container maxWidth="md">
      <Typography variant="h4" sx={{ mt: 4, mb: 2 }}>Add Product</Typography>

      <TextField fullWidth label="Product Name" name="name" margin="normal" onChange={handleChange} required />
      <TextField fullWidth label="Price" name="price" margin="normal" type="number" onChange={handleChange} required />
      <TextField fullWidth label="Stock" name="stock" margin="normal" type="number" onChange={handleChange} required />
      <TextField fullWidth label="Description" name="description" margin="normal" onChange={handleChange} required />

      {/* ✅ Category Selection & Adding New Category */}
      <FormControl fullWidth margin="normal">
        <InputLabel>Category</InputLabel>
        <Select name="category" value={product.category} onChange={handleChange} required>
          {categories.map((cat) => (
            <MenuItem key={cat._id} value={cat._id}>{cat.name}</MenuItem>
          ))}
          <MenuItem value="custom">➕ Add New Category</MenuItem>
        </Select>
      </FormControl>

      {product.category === "custom" && (
        <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
          <TextField fullWidth label="New Category" value={product.newCategory} onChange={(e) => setProduct({ ...product, newCategory: e.target.value })} />
          <Button variant="contained" onClick={handleAddCategory}>Add</Button>
        </Box>
      )}

      {/* ✅ Image Upload */}
      <input type="file" accept="image/*" multiple onChange={handleImageUpload} />
      <Grid container spacing={2} sx={{ mt: 2 }}>
        {product.images.map((img, index) => (
          <Grid item xs={4} key={index}>
            <Card sx={{ position: "relative" }}>
              <CardMedia component="img" height="140" image={img} alt={`Product Image ${index + 1}`} />
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

      {/* ✅ Video Upload */}
      <input type="file" accept="video/*" onChange={handleVideoUpload} />
      {product.video && (
        <Card sx={{ mt: 2 }}>
          <CardMedia component="video" controls height="200" src={product.video} />
        </Card>
      )}

      <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleSubmit}>Add Product</Button>
    </Container>
  );
};

export default AddProduct;
