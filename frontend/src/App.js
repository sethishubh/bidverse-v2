import { useState, useCallback, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { AuthContext } from "./store/authContext";
import { CategoryContext } from "./store/categoryContext";
import axios from "axios";

import Navbar from "./components/UI/Navbar";
import Home from "./pages/Home";
import Footer from "./components/UI/Footer";
import BidsList from "./pages/BidsList";
import BidItemDetail from "./pages/BidItemDetail";
import Login from "./components/General/Login";
import Register from "./components/General/Register";
import AdminDashboard from "./pages/AdminDashboard";
import CreateProduct from "./pages/CreateProduct";
import CreatedProductsList from "./pages/CreatedProductsList";
import UpdateProduct from "./pages/UpdateProduct";

function App() {
  const [token, setToken] = useState(false);
  const [categories, setCategories] = useState([]);

  const login = useCallback((token) => {
    setToken(token);
    localStorage.setItem(
      "userData",
      JSON.stringify({
        token: token,
      })
    );
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    localStorage.removeItem("userData");
  }, []);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    if (storedData && storedData.token) {
      login(storedData.userId, storedData.token);
    }
  }, [login]);

  useEffect(() => {
    // get categories of product
    axios
      .get(`${process.env.REACT_APP_BACKEND}/api/v1/products`)
      .then((data) => {
        const productsData = data.data.data.products;

        const productsCategories = productsData.map((prod) => prod.category);
        setCategories(productsCategories);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <CategoryContext.Provider value={[...new Set(categories)]}>
      <AuthContext.Provider
        value={{
          isLoggedIn: !!token,
          token: token,
          login: login,
          logout: logout,
        }}
      >
        <header>
          <Navbar />
        </header>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/signup" element={<Register />}></Route>
          <Route path="/products" element={<BidsList />}></Route>
          <Route path="/products/:prId" element={<BidItemDetail />}></Route>
          <Route path="/users/admin" element={<AdminDashboard />}></Route>
          <Route path="users/admin/products/create" element={<CreateProduct />}></Route>
          <Route path="users/admin/products" element={<CreatedProductsList />}></Route>
          <Route path="users/admin/products/:productId/edit" element={<UpdateProduct />}></Route>
        </Routes>
        <Footer />
      </AuthContext.Provider>
    </CategoryContext.Provider>
  );
}

export default App;
