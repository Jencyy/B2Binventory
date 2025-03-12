import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, deleteProduct, updateProduct } from "../redux/productSlice";
import ProductCard from "./ProductCard";
import { Grid } from "@mui/material";

const ProductList = () => {
    const dispatch = useDispatch();
    const { products, loading, error } = useSelector((state) => state.products);

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <Grid container spacing={3}>
            {products.map((product) => {
                console.log("🔥 Rendering Product:", product._id); // ✅ Debugging log
                return (
                    <Grid item key={product._id} xs={12} sm={6} md={4}>
                        <ProductCard
                            product={product}
                            onDelete={() => {
                                console.log("🛑 Delete function triggered for:", product._id); // ✅ Should appear in console
                                dispatch(deleteProduct(product._id)); // ✅ Dispatch delete action
                            }}
                            onUpdate={(updatedData) => dispatch(updateProduct({ id: product._id, updatedData }))}
                        />


                    </Grid>
                );
            })}

        </Grid>
    );
};

export default ProductList;
