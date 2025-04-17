import React, { useState } from 'react';
import SidebarDrawer from '../components/SidebarDrawer';
import { useSelector } from 'react-redux';
import { Grid, Typography } from '@mui/material';
import ProductCard from '../components/ProductCard';

const Products = () => {
  const { products } = useSelector((state) => state.products);
  const [filters, setFilters] = useState({
    search: '',
    inStockOnly: false,
    selectedCategories: [],
  });

  const applyFilters = (product) => {
    const matchSearch = product.name.toLowerCase().includes(filters.search.toLowerCase());
    const matchStock = filters.inStockOnly ? product.stock > 0 : true;
    const matchCategory = filters.selectedCategories.length
      ? filters.selectedCategories.includes(product.category?.name)
      : true;
    return matchSearch && matchStock && matchCategory;
  };

  return (
    <SidebarDrawer onFilterChange={setFilters}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Products
      </Typography>

      <Grid container spacing={2}>
        {products.filter(applyFilters).map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product._id}>
            <ProductCard product={product} />
          </Grid>
        ))}
      </Grid>
    </SidebarDrawer>
  );
};

export default Products;
