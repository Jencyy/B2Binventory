import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, deleteProduct } from "../redux/productSlice";
import { Container, Grid, Typography, Box } from "@mui/material";
import ProductCard from "../components/ProductCard";
import CategoryList from "../components/CategoryList";

const Home = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const filteredProducts = selectedCategory
    ? products.filter((product) => product?.category?.name === selectedCategory)
    : products;

  return (
    <Container sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Browse by Category
      </Typography>

      <CategoryList onCategorySelect={setSelectedCategory} />

      <Typography variant="h5" sx={{ mt: 2, mb: 2, p: 3 }}>
        {selectedCategory ? `Products in ${selectedCategory}` : "All Products"}
      </Typography>

      <Grid container spacing={3}>
        {loading && <Typography>Loading...</Typography>}
        {error && <Typography color="error">{error}</Typography>}

        {!loading && filteredProducts.length === 0 ? (
          <Typography>No products found in this category.</Typography>
        ) : (
          filteredProducts.map((product) => (
            <Grid item key={product._id} xs={12} sm={6} md={4}>
              <ProductCard
                product={product}
                onDelete={() => dispatch(deleteProduct(product._id))}
              />
            </Grid>
          ))
        )}
      </Grid>
    </Container>
  );
};

export default Home;
