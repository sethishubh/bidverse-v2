import React from "react";
import { Link } from "react-router-dom";
import "./adminDashboard.css";

const AdminDashboard = () => {
  return (
    <div className="admin_dashboard_main">
      <h1>Admin dashboard</h1>
      <div className="admin_dashboard_grid">
        <Link className="admin_dashboard_main_btn" to="/users/admin/products/create">
          Create a product
        </Link>
        <Link className="admin_dashboard_main_btn" to="/users/admin/products">
          View all products
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
