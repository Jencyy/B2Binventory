import { Card, CardMedia, CardContent, Typography, Button } from "@mui/material";
import EditProduct from "./EditProduct";
import axios from "axios";

const ProductCard = ({ _id, name, image, price, stock, onDelete, onUpdate }) => {
  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/products/${_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onDelete(_id);
    } catch (error) {
      alert("Error deleting product: " + error.response?.data?.message || error.message);
    }
  };
  console.log("✅ onUpdate in ProductCard:", onUpdate)
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardMedia component="img" height="140" image={image} alt={name} />
      <CardContent>
        <Typography variant="h5">{name}</Typography>
        <Typography variant="body2">Price: ${price}</Typography>
        <Typography variant="body2">Stock: {stock}</Typography>
        <Button color="error" onClick={handleDelete}>Delete</Button>
        <EditProduct product={{ id: _id, name, image, price, stock }} onUpdate={onUpdate} />
      </CardContent>
    </Card>
  );
};

export default ProductCard;
