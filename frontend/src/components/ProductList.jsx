import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, deleteProduct, updateProduct } from "../redux/productSlice";
import ProductCard from "./ProductCard";
import { Grid, Typography } from "@mui/material";
import Sidebar from "./Sidebar";

const ProductList = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleDelete = (id) => {
    dispatch(deleteProduct(id));
  };

  if (loading) return <Typography sx={{ textAlign: "center", mt: 5 }}>Loading...</Typography>;
  if (error) return <Typography sx={{ textAlign: "center", mt: 5, color: "red" }}>Error: {error}</Typography>;

  return (
    <Grid sx={{ marginLeft: "250px", padding: "20px" }} container spacing={3}  >
      <Sidebar
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
      {products.map((product) => (
        <Grid item key={product._id} xs={12} sm={6} md={4} lg={3}>
          <ProductCard
            product={product}
            onDelete={handleDelete}
            onUpdate={(updatedData) => dispatch(updateProduct({ id: product._id, updatedData }))}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default ProductList;
