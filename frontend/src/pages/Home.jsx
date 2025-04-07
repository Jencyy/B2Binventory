import { Container, Grid, Typography, Button } from "@mui/material";

import ProductCard from "../components/ProductCard";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, deleteProduct, updateProduct } from "../redux/productSlice";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products, loading, error } = useSelector((state) => state.products);
  const isAdmin = localStorage.getItem("role") === "admin";

  useEffect(() => {
    dispatch(fetchProducts()); // Fetch products from Redux
  }, [dispatch]);

  return (
    <>
    
      <Container>
        <Typography variant="h4" sx={{ mt: 4, mb: 2 }}>
          {isAdmin ? "Manage Inventory" : "Available Products"}
        </Typography>

        {isAdmin && (
          <Button variant="contained" color="primary" sx={{ mb: 2 }} onClick={() => navigate("/add-product")}>
            Add New Product
          </Button>
        )}

        {loading && <p>Loading...</p>}
        {error && <p>Error: {error}</p>}

        <Grid container spacing={2}>
          {products.map((product, index) => (
            <Grid item key={product._id || index} xs={12} sm={6} md={4}>
              <ProductCard product={product} onDelete={() => dispatch(deleteProduct(product._id))} />
            </Grid>
          ))}
        </Grid>

      </Container>
    </>
  );
};

export default Home;
