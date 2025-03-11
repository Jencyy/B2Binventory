import { Container, Grid, Typography, Button } from "@mui/material";
import Navbar from "../components/Navbar";
import ProductCard from "./ProductCard";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [products, setProducts] = useState([]);
  const userRole = localStorage.getItem("userRole");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/products");
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products", error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <>
      <Navbar />
      <Container>
        <Typography variant="h4" sx={{ mt: 4, mb: 2 }}>
          {userRole === "admin" ? "Manage Inventory" : "Available Products"}
        </Typography>

        {userRole === "admin" && (
          <Button variant="contained" color="primary" sx={{ mb: 2 }} onClick={() => navigate("/add-product")}>
            Add New Product
          </Button>
        )}

        <Grid container spacing={2}>
          {products.map((product, index) => (
            <Grid item key={index} xs={12} sm={6} md={4}>
              <ProductCard {...product} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
};

export default Home;
