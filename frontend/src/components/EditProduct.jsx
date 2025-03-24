import { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Grid,
} from "@mui/material";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { fetchCategories } from "../../redux/categorySlice";
import { fetchProducts, updateProduct } from "../../redux/productSlice";  

const EditProduct = ({ product, onUpdate }) => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const { categories = [], loading } = useSelector((state) => state.categories || {});

  console.log("🔥 Product:", product);

  const [updatedProduct, setUpdatedProduct] = useState({
    ...product,
    category: product?.category?._id || product?.category || "",
  });

  const [imagePreview, setImagePreview] = useState(product.image || "");
  const [videoPreview, setVideoPreview] = useState(product.video || "");
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleChange = (e) => {
    setUpdatedProduct((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Handle Image Selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file)); // Show preview
    }
  };

  // Handle Video Selection
  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedVideo(file);
      setVideoPreview(URL.createObjectURL(file)); // Show preview
    }
  };

 const handleSubmit = async () => {
  try {
    if (!updatedProduct?._id) {
      alert("❌ Error: Product ID is missing.");
      return;
    }

    const token = localStorage.getItem("token");
    const formData = new FormData();

    formData.append("name", updatedProduct.name);
    formData.append("price", updatedProduct.price);
    formData.append("stock", updatedProduct.stock);
    formData.append("description", updatedProduct.description);
    formData.append("category", updatedProduct.category);

    if (selectedImage) formData.append("image", selectedImage);
    if (selectedVideo) formData.append("video", selectedVideo);

    const response = await axios.put(
      `http://localhost:5000/api/products/${updatedProduct._id}`,
      formData,
      { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } }
    );

    dispatch(updateProduct(response.data)); // Update Redux state
    dispatch(fetchProducts()); // Fetch updated products

    if (typeof onUpdate === "function") {
      onUpdate(response.data);
    }
    setOpen(false);
  } catch (error) {
    console.error("❌ Update Error:", error);
    alert("Error updating product: " + (error.response?.data?.message || error.message));
  }
};


  return (
    <>
      <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
        ✏️ Edit Product
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ textAlign: "center", fontWeight: "bold", color: "#044333" }}>
          ✨ Edit Product Details
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            {/* Name */}
            <Grid item xs={12}>
              <TextField 
                name="name" 
                label="Product Name" 
                value={updatedProduct.name || ""} 
                onChange={handleChange} 
                fullWidth 
                variant="outlined" 
              />
            </Grid>

            {/* Image Upload */}
            <Grid item xs={12}>
              <input type="file" accept="image/*" onChange={handleImageChange} />
              {imagePreview && <img src={imagePreview} alt="Preview" width="100%" />}
            </Grid>

            {/* Price & Stock */}
            <Grid item xs={6}>
              <TextField 
                name="price" 
                label="Price" 
                type="number" 
                value={updatedProduct.price || ""} 
                onChange={handleChange} 
                fullWidth 
                variant="outlined" 
              />
            </Grid>
            <Grid item xs={6}>
              <TextField 
                name="stock" 
                label="Stock Quantity" 
                type="number" 
                value={updatedProduct.stock || ""} 
                onChange={handleChange} 
                fullWidth 
                variant="outlined" 
              />
            </Grid>

            {/* Description */}
            <Grid item xs={12}>
              <TextField 
                name="description" 
                label="Product Description" 
                value={updatedProduct.description || ""} 
                onChange={handleChange} 
                fullWidth 
                multiline 
                rows={3} 
                variant="outlined" 
              />
            </Grid>

            {/* Video Upload */}
            <Grid item xs={12}>
              <input type="file" accept="video/*" onChange={handleVideoChange} />
              {videoPreview && <video src={videoPreview} width="100%" controls />}
            </Grid>

            {/* Category Selection */}
            <Grid item xs={12}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  value={updatedProduct.category}
                  onChange={handleChange}
                  label="Category"
                >
                  {loading ? (
                    <MenuItem disabled>Loading categories...</MenuItem>
                  ) : (
                    categories.map((cat) => (
                      <MenuItem key={cat._id} value={cat._id}>
                        {cat.name}
                      </MenuItem>
                    ))
                  )}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>

        {/* Dialog Actions */}
        <DialogActions sx={{ padding: "20px" }}>
          <Button onClick={() => setOpen(false)} variant="outlined" color="error">
            ❌ Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            💾 Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EditProduct;
