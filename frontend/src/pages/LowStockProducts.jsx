// pages/LowStockProducts.js
import React, { useEffect, useState } from "react";
import { Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";

const LowStockProducts = () => {
  const [lowStockProducts, setLowStockProducts] = useState([]);

  // Fetch low-stock products data (replace with your API call)
  useEffect(() => {
    const fetchedProducts = JSON.parse(localStorage.getItem("products") || "[]");
    const lowStock = fetchedProducts.filter((product) => product.stock < 10);
    setLowStockProducts(lowStock);
  }, []);

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Low Stock Products
      </Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="low-stock products table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Stock</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {lowStockProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>{product.price}</TableCell>
                <TableCell>{product.stock}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default LowStockProducts;
