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
import { fetchCategories } from "../redux/categorySlice";
import { updateProduct } from "../redux/productSlice";  

const EditProduct = ({ product, onUpdate }) => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const { categories = [], loading } = useSelector((state) => state.categories || {});

  // ✅ Check if category is an object or just an ID
  const [updatedProduct, setUpdatedProduct] = useState({
    ...product,
    category: product?.category?._id || product?.category || "", // ✅ Fix: Ensure we store the correct ID
  });
  
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleChange = (e) => {
    setUpdatedProduct((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  useEffect(()=>{
    
  },[updateProduct])

 
  const handleSubmit = async () => {
    try {
      if (!updatedProduct?._id) {
        alert("❌ Error: Product ID is missing.");
        console.error("Product ID is undefined:", updatedProduct);
        return;
      }
  
      console.log("🔍 Updating product with ID:", updatedProduct._id);
  
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:5000/api/products/${updatedProduct._id}`,
        updatedProduct,
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      console.log("✅ Update successful:", response.data);
  
      // ✅ Correctly update Redux store with updated product data
      dispatch(updateProduct(response.data));
  
      // ✅ Trigger parent component update
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
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth  >
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

            {/* Image */}
            <Grid item xs={12}>
              <TextField 
                name="image" 
                label="Image URL" 
                value={updatedProduct.image || ""} 
                onChange={handleChange} 
                fullWidth 
                variant="outlined" 
              />
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

            {/* Video */}
            <Grid item xs={12}>
              <TextField 
                name="video" 
                label="Product Video URL" 
                value={updatedProduct.video || ""} 
                onChange={handleChange} 
                fullWidth 
                variant="outlined" 
              />
            </Grid>

            {/* Category Selection */}
            <Grid item xs={12}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  value={updatedProduct.category} // ✅ Now correctly displaying the selected category
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
