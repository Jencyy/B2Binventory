import { Card, CardMedia, CardContent, Typography, Button } from "@mui/material";
import EditProduct from "./EditProduct";

const ProductCard = ({ product, onDelete, onUpdate }) => {

  if (!product) {
    console.error("❌ ProductCard received undefined product");
    return null; // Prevent rendering if product is undefined
  }
  const handleDelete = () => {
    console.log("🛑 Delete button clicked for:", product._id); // ✅ Debugging log
    console.log("🟢 Checking if onDelete exists:", onDelete); // ✅ Debugging log
    if (onDelete) {
      console.log("✅ onDelete function exists, calling it now...");
      onDelete();
    } else {
      console.error("❌ onDelete function is still undefined!");
    }
  };

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardMedia component="img" height="140" image={product.image} alt={product.name} />
      <CardContent>
        <Typography variant="h5">{product.name}</Typography>
        <Typography variant="body2">Price: ${product.price}</Typography>
        <Typography variant="body2">Stock: {product.stock}</Typography>
        <Button
          color="error"
          onClick={() => {
            console.log("🟢 Delete button clicked for:", product._id); // ✅ Should appear
            if (onDelete) {
              console.log("✅ Calling onDelete function");
              onDelete(); // Call delete function
            } else {
              console.error("❌ onDelete function is STILL undefined! Fix your props.");
            }
          }}
        >
          Delete
        </Button>

        <EditProduct product={product} onUpdate={onUpdate} />
      </CardContent>
    </Card>
  );

};

export default ProductCard;
