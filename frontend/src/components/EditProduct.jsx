import { useState } from "react";
import { TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import axios from "axios";

const EditProduct = ({ product, onUpdate }) => {
  const [open, setOpen] = useState(false);
  const [updatedProduct, setUpdatedProduct] = useState(product);

  const handleChange = (e) => {
    setUpdatedProduct({ ...updatedProduct, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (!product?._id) {
        alert("❌ Error: Product ID is missing.");
        return;
      }
  
      console.log("🔍 Updating product with ID:", product._id); // Debugging
  
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:5000/api/products/${product._id}`,
        updatedProduct,
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      console.log("✅ Update successful:", response.data); // Debugging
  
      if (typeof onUpdate === "function") {
        onUpdate(updatedProduct);
      }
      setOpen(false);
    } catch (error) {
      console.error("❌ Update Error:", error);
      alert("Error updating product: " + (error.response?.data?.message || error.message));
    }
  };
  

  return (
    <>
      <Button color="primary" onClick={() => setOpen(true)}>Edit</Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Edit Product</DialogTitle>
        <DialogContent>
          <TextField name="name" label="Name" value={updatedProduct.name} onChange={handleChange} fullWidth />
          <TextField name="image" label="Image URL" value={updatedProduct.image} onChange={handleChange} fullWidth />
          <TextField name="price" label="Price" type="number" value={updatedProduct.price} onChange={handleChange} fullWidth />
          <TextField name="stock" label="Stock" type="number" value={updatedProduct.stock} onChange={handleChange} fullWidth />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit} color="primary">Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EditProduct;
