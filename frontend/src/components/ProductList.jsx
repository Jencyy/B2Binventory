import { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../pages/ProductCard";
import { Grid } from "@mui/material";

const ProductList = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const { data } = await axios.get("http://localhost:5000/api/products");
            console.log("Fetched Products:", data);
            setProducts(data);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    const handleDelete = (id) => {
        setProducts(products.filter((product) => product._id !== id));
    };

    const handleUpdate = (updatedProduct) => {
        console.log("✅ handleUpdate called in ProductList");
        setProducts(products.map((product) =>
            product._id === updatedProduct._id ? updatedProduct : product
        ));
    };

    return (
        <Grid container spacing={3}>
            {products.map((product) => (
                <Grid item key={product._id} xs={12} sm={6} md={4}>
                    <ProductCard
                        {...product}
                        onDelete={handleDelete}
                        onUpdate={handleUpdate} // ✅ Make sure this is included
                    />
                </Grid>
            ))}
        </Grid>
    );
};

export default ProductList;
