import {
    Box,
    Typography,
    Divider,
    List,
    ListItem,
    ListItemText,
    FormControlLabel,
    Checkbox,
  } from "@mui/material";
  import { useState } from "react";
  
  const categories = [
    "All Categories",
    "Electronics",
    "Footwear",
    "Home Appliances",
    "Clothing",
  ];
  
  const brands = ["Apple", "Samsung", "Nike", "Adidas", "Zara"];
  
  const Sidebar = ({ selectedCategory, setSelectedCategory }) => {
    const [selectedBrands, setSelectedBrands] = useState([]);
  
    const handleBrandToggle = (brand) => {
      if (selectedBrands.includes(brand)) {
        setSelectedBrands(selectedBrands.filter((b) => b !== brand));
      } else {
        setSelectedBrands([...selectedBrands, brand]);
      }
    };
  
    return (
      <Box
        sx={{
          width: "250px",
          backgroundColor: "#fff",
          borderRight: "1px solid #ddd",
          padding: "16px",
          height: "100vh",
          overflowY: "auto",
          position: "sticky",
          top: 0,
        }}
      >
        {/* Category Filter */}
        <Typography variant="h6" gutterBottom>
          Categories
        </Typography>
        <List>
          {categories.map((category) => (
            <ListItem
              key={category}
              button
              onClick={() => setSelectedCategory(category)}
              selected={selectedCategory === category}
            >
              <ListItemText primary={category} />
            </ListItem>
          ))}
        </List>
  
        <Divider sx={{ my: 2 }} />
  
        {/* Brand Filter */}
        <Typography variant="h6" gutterBottom>
          Brands
        </Typography>
        <Box>
          {brands.map((brand) => (
            <FormControlLabel
              key={brand}
              control={
                <Checkbox
                  checked={selectedBrands.includes(brand)}
                  onChange={() => handleBrandToggle(brand)}
                />
              }
              label={brand}
            />
          ))}
        </Box>
      </Box>
    );
  };
  
  export default Sidebar;
  