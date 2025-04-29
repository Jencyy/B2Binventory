import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  CircularProgress,
  Card,
  CardMedia,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories, addCategory } from "../redux/categorySlice";
import axios from "axios";

const ManageCategories = () => {
  const dispatch = useDispatch();
  const { categories, loading, error } = useSelector((state) => state.categories);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: null,
  });
  const [preview, setPreview] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

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
    if (formData.image) {
      data.append("image", formData.image);
    }

    try {
      if (editMode) {
        // Editing existing category
        await axios.put(`http://localhost:5000/api/categories/${editingId}`, data, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
        alert("Category updated successfully!");
      } else {
        // Adding new category
        await dispatch(addCategory(data)).unwrap();
        alert("Category added successfully!");
      }
      resetForm();
      dispatch(fetchCategories());
    } catch (error) {
      console.error(error);
      alert("Something went wrong!");
    }
  };

  const resetForm = () => {
    setFormData({ name: "", description: "", image: null });
    setPreview(null);
    setEditMode(false);
    setEditingId(null);
  };

  const handleEdit = (category) => {
    setFormData({
      name: category.name,
      description: category.description,
      image: null, // Don't set old image file
    });
    setPreview(category.image ? `http://localhost:5000${category.image}` : null);
    setEditMode(true);
    setEditingId(category._id);
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this category?");
    if (!confirm) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Category deleted successfully!");
      dispatch(fetchCategories());
    } catch (error) {
      console.error(error);
      alert("Failed to delete category!");
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Manage Categories
      </Typography>

      {/* Form for Add/Edit */}
      <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 4 }}>
        <TextField label="Category Name" name="name" value={formData.name} onChange={handleChange} required />
        <TextField label="Description" name="description" value={formData.description} onChange={handleChange} multiline rows={3} />
        <input type="file" accept="image/*" onChange={handleImageChange} />
        {preview && (
          <Card>
            <CardMedia component="img" height="140" image={preview} alt="Preview" />
          </Card>
        )}
        <Button type="submit" variant="contained">
          {editMode ? "Update Category" : "Add Category"}
        </Button>
        {editMode && (
          <Button variant="outlined" color="secondary" onClick={resetForm}>
            Cancel Editing
          </Button>
        )}
      </Box>

      {/* Categories Table */}
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">Error: {error}</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Image</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category._id}>
                  <TableCell>{category.name}</TableCell>
                  <TableCell>{category.description}</TableCell>
                  <TableCell>
                    {category.image && (
                      <img src={`http://localhost:5000${category.image}`} alt={category.name} width="60" />
                    )}
                  </TableCell>
                  <TableCell>
                    <IconButton color="primary" onClick={() => handleEdit(category)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="secondary" onClick={() => handleDelete(category._id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default ManageCategories;
