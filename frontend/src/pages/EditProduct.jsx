import { useState } from "react";
import { TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import axios from "axios";

const EditProduct = ({ product, onUpdate }) => {
    console.log("✅ onUpdate in EditProduct:", onUpdate);
    console.log("Product ID in EditProduct:", product.id);
    const [open, setOpen] = useState(false);
    const [updatedProduct, setUpdatedProduct] = useState(product);

    const handleChange = (e) => {
        setUpdatedProduct({ ...updatedProduct, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        try {
            console.log("Product ID:", product.id);
            if (!product.id) {
                alert("Error: Product ID is missing!");
                return;
            }

            const token = localStorage.getItem("token");
            const { data } = await axios.put(
                `http://localhost:5000/api/products/${product.id}`,
                updatedProduct,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            console.log("Updated Product Response:", data);

            if (!data.updatedProduct) {
                alert("Error updating product: Invalid response from server");
                return;
            }

            onUpdate(); // ✅ This calls `fetchProducts()` in ProductList.jsx
            setOpen(false);
        } catch (error) {
            console.error("Edit error:", error.response?.data || error.message);
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
            <button onClick={() => onUpdate()}>Test Update</button>
        </>
    );
};

export default EditProduct;
