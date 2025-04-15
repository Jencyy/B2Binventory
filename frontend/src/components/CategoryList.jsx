import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../redux/categorySlice";
import { Grid, Card, CardMedia, CardContent, Typography, Button } from "@mui/material";
import CategoryBtn from "./CategoryBtn";

const CategoryList = ({ onCategorySelect }) => {
  const dispatch = useDispatch();
  const { categories, loading } = useSelector((state) => state.categories);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const baseUrl = "http://localhost:5000"; // Your backend URL

  return (
    <Grid container spacing={2} sx={{ mt: 2 }}>
    <Grid item style={{ display: "flex", alignItems: "center" }} xs={12} sm={6} md={1.5}>
        <CategoryBtn label="All Categories" onClick={() => onCategorySelect(null)} />
      </Grid>
      {loading && <Typography>Loading...</Typography>}
      {categories.map((category) => (
        <Grid item xs={12} sm={6} md={2} key={category._id}>
          <Card
            onClick={() => onCategorySelect(category.name)}
            sx={{
              cursor: "pointer",
              ":hover": { boxShadow: 6 },
            }}
          >
            <CardMedia
              component="img"
              height="160"
              image={`${baseUrl}${category.image}`}
              alt={category.name}
            />
            <CardContent>
              <Typography variant="h6" align="center">
                {category.name}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default CategoryList;
