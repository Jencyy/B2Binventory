import { Card, CardMedia, CardContent, Typography, Button } from "@mui/material";
import EditProduct from "./EditProduct";
// import {  addToCartAsync } from "../redux/cartSlice";
import { useDispatch } from "react-redux";
import { addToCartAsync } from "../redux/cartSlice";

const ProductCard = ({ product, onDelete, onUpdate }) => {
  const dispatch = useDispatch();
  const isAdmin = localStorage.getItem("role") === "admin"; // ✅ Check admin role
  if (!product || !product.name) {
    console.error("❌ ProductCard received an undefined product or missing name:", product);
    return null; // Prevent rendering if product is invalid
  }

  const handleAddToCart = () => {
    dispatch(addToCartAsync({ productId: product._id, quantity: 1 }));
  };


  return (
    <Card sx={{ maxWidth: 345 }}>
      {/* Product Image */}
      <CardMedia component="img" height="140" image={product.image || "/placeholder.jpg"} alt={product.name} />


      <CardContent>
        <Typography variant="h5">{product.name}</Typography>
        <Typography variant="body2">Category: {product.category.name || "N/A"}</Typography>
        <Typography variant="body2">Price: ${product.price}</Typography>
        <Typography variant="body2">Stock: {product.stock}</Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          {product.description || "No description available"}
        </Typography>

        {/* Product Video (if available) */}
        {product.video && (
          <video width="100%" height="140" controls>
            <source src={product.video} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
        <Button onClick={handleAddToCart}> 🛒 Add to Cart</Button>


        {isAdmin && ( // ✅ Only show for admin
          <>
            <Button color="error" onClick={() => onDelete(product._id)}>Delete</Button>
            <EditProduct product={product} onUpdate={onUpdate} />
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductCard;
