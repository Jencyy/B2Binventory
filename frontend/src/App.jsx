import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyEmail from "./pages/VerifyEmail";
import Orders from "./pages/Orders";
import AddProduct from "./pages/AddProduct";
import CartPage from "./pages/CartPage";
import Navbar from "./components/Navbar";
import Expired from "./pages/Expired";
import AddCategory from "./components/AddCategory";
import WishlistPage from "./pages/WishlistPage";

const App = () => {
  return (
    <>
    
    <Router>
    <Navbar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-email/:token" element={<VerifyEmail />} />
        <Route path="/add-product" element={<AddProduct />} />
        <Route path="/add-category" element={<AddCategory />} />
<Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/expired" element={<Expired />} />
      </Routes>
    </Router>
    </>
);
};

export default App;
