import {
    Container,
    Typography,
    TextField,
    Button,
    Box,
    Card,
    CardMedia,
  } from "@mui/material";
  import { useState } from "react";
  import axios from "axios";
  
  const AddCategory = () => {
    const [formData, setFormData] = useState({
      name: "",
      description: "",
      image: null,
    });
  
    const [preview, setPreview] = useState(null);
  
    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };
  
    const handleImageChange = (e) => {
      const file = e.target.files[0];
      setFormData({ ...formData, image: file });
      setPreview(URL.createObjectURL(file));
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      const token = localStorage.getItem("token");
      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("image", formData.image);
  
      try {
        const res = await axios.post("http://localhost:5000/api/", data, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
        alert("Category added!");
        setFormData({ name: "", description: "", image: null });
        setPreview(null);
      } catch (err) {
        console.error(err);
        alert("Failed to add category");
      }
    };
  
    return (
      <Container sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>Add New Category</Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField label="Category Name" name="name" value={formData.name} onChange={handleChange} required />
          <TextField label="Description" name="description" value={formData.description} onChange={handleChange} multiline rows={3} />
          <input type="file" accept="image/*" onChange={handleImageChange} />
          {preview && (
            <Card>
              <CardMedia component="img" height="140" image={preview} alt="Preview" />
            </Card>
          )}
          <Button type="submit" variant="contained">Add Category</Button>
        </Box>
      </Container>
    );
  };
  
  export default AddCategory;
  