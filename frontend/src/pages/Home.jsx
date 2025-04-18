import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, deleteProduct } from "../redux/productSlice";
import { Grid, Typography } from "@mui/material";
import ProductCard from "../components/ProductCard";
import SidebarDrawer from "../components/SidebarDrawer";

const Home = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);

  const [filters, setFilters] = useState({
    search: '',
    inStockOnly: false,
    selectedCategories: [],
  });

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const applyFilters = (product) => {
    const matchSearch = product.name.toLowerCase().includes(filters.search.toLowerCase());
    const matchStock = filters.inStockOnly ? product.stock > 0 : true;
    const matchCategory = filters.selectedCategories.length
      ? filters.selectedCategories.includes(product.category?.name)
      : true;
    return matchSearch && matchStock && matchCategory;
  };

  const filteredProducts = products.filter(applyFilters);

  return (
    <SidebarDrawer onFilterChange={setFilters}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        {filters.selectedCategories.length
          ? `Filtered Products (${filteredProducts.length})`
          : "All Products"}
      </Typography>

      {loading && <Typography>Loading...</Typography>}
      {error && <Typography color="error">{error}</Typography>}

      {!loading && filteredProducts.length === 0 ? (
        <Typography>No products match the selected filters.</Typography>
      ) : (
        <Grid container spacing={3}>
          {filteredProducts.map((product) => (
            <Grid item key={product._id} xs={12} sm={6} md={4}>
              <ProductCard
                product={product}
                onDelete={() => dispatch(deleteProduct(product._id))}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </SidebarDrawer>
  );
};

export default Home;
