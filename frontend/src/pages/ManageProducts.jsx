import React, { useEffect, useState } from "react";
import { Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, deleteProduct } from "../redux/productSlice";
import { useNavigate } from "react-router-dom"; // Importing the useNavigate hook

const ManageProducts = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Hook for navigation
  const { products, loading, error } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleDeleteProduct = (productId) => {
    dispatch(deleteProduct(productId));
  };

  const handleEditProduct = (productId) => {
    // Navigate to the EditProduct page with the productId
    navigate(`/admin/edit-product/${productId}`);
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography>Error: {error}</Typography>;

  return (
    <Box sx={{ display: "flex" }}>
      <Box sx={{ flexGrow: 1, padding: 3 }}>
        <Typography variant="h4" gutterBottom>
          Manage Products
        </Typography>
        <Button variant="contained" href="/admin/add-product" sx={{ marginBottom: 2 }}>
          Add New Product
        </Button>

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="products table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Image</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product._id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.description}</TableCell>
                  <TableCell>{product.price}</TableCell>
                  <TableCell>
                    {product.images && product.images.length > 0 && (
                      <img
                        src={`http://localhost:5000${product.images[0]}`}
                        alt={product.name}
                        width={50}
                        height={50}
                        style={{ objectFit: "cover" }}
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    <IconButton color="primary" onClick={() => handleEditProduct(product._id)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="secondary" onClick={() => handleDeleteProduct(product._id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default ManageProducts;
