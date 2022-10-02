import React, { useState, useRef, useContext, useEffect } from "react";
import { ColorRing as Loader } from "react-loader-spinner";
import { Link, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import { Routes, Route, useParams } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

import "./createProduct.css";
import { AuthContext } from "../store/authContext";

const UpdateProduct = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    basePrice: "",
    category: "",
    closesAt: "",
    description: "",
    imageURL: "",
  });

  const auth = useContext(AuthContext);

  let redirectTimerId;

  const setFormDataHandler = (e) => {
    e.preventDefault();

    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        [e.target.name]: e.target.value,
      };
    });
  };

  const updateProdHandler = (e) => {
    e.preventDefault();
    setLoading(true);
    axios({
      method: "patch",
      url: `${process.env.REACT_APP_BACKEND}/api/v1/products/${productId}`,
      data: {
        name: formData.name,
        basePrice: formData.basePrice,
        category: formData.category,
        closesAt: formData.closesAt,
        description: formData.description,
        imageURL: formData.imageURL,
      },
      headers: {
        Authorization: "Bearer " + auth.token,
      },
    })
      .then((data) => {
        toast.info("Product updated successfully!");
        setLoading(false);
        setIsUpdated(true);

        // redirect after 3 seconds
        redirectTimerId = setTimeout(() => {
          navigate("/users/admin/products");
        }, 3000);
      })
      .catch((err) => {
        setLoading(false);
        toast.info(
          err.response.data.message,
          {
            position: "top-center",
            autoClose: 2900,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          },
          {
            theme: "dark",
          }
        );
      });
  };

  useEffect(() => {
    setLoading(true);
    axios({
      method: "get",
      url: `${process.env.REACT_APP_BACKEND}/api/v1/products/${productId}`,
    })
      .then((data) => {
        let product = data.data.data.product;
        const { name, basePrice, category, closesAt, description, imageURL } = product;
        setFormData({
          name,
          basePrice,
          category,
          closesAt,
          description,
          imageURL,
        });
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);

        toast.info(
          err.response.data.message,
          {
            position: "top-center",
            autoClose: 2900,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          },
          {
            theme: "dark",
          }
        );
      });
  }, [productId]);

  return (
    <div className="admin_product_create_main">
      <ToastContainer />
      <h1>Update the product</h1>

      <div className="admin_product_create_form">
        {!loading && formData && (
          <form action="" onSubmit={updateProdHandler}>
            <div>
              <label htmlFor="name">Product name: </label>
              <input type="text" id="name" name="name" value={formData.name} onChange={setFormDataHandler} />
            </div>

            <div>
              <label htmlFor="basePrice">Base price: </label>
              <input
                type="number"
                id="basePrice"
                name="basePrice"
                step="0.01"
                value={formData.basePrice}
                onChange={setFormDataHandler}
              />
            </div>
            <div>
              <label htmlFor="cat">Category</label>
              <input type="text" id="cat" name="category" value={formData.category} onChange={setFormDataHandler} />
            </div>

            <div>
              <label htmlFor="expireAt">Will be removed at: </label>
              <input
                type="date"
                id="expireAt"
                name="closesAt"
                //   value={new Date(formData.closesAt).toISOString().slice(0, 10)}
                value={formData.closesAt}
                onChange={setFormDataHandler}
              />
            </div>

            <div>
              <label htmlFor="desc">Description</label>
              <textarea
                id="desc"
                cols="30"
                rows="5"
                name="description"
                value={formData.description}
                onChange={setFormDataHandler}
              ></textarea>
            </div>

            <div>
              <label htmlFor="imageURL">Image</label>
              <input
                type="text"
                id="imageURL"
                name="imageURL"
                value={formData.imageURL}
                onChange={setFormDataHandler}
              />
            </div>

            <button>Update</button>
          </form>
        )}
        {loading && (
          <Loader
            visible={true}
            height="100"
            width="100"
            ariaLabel="blocks-loading"
            wrapperStyle={{}}
            wrapperClass="blocks-wrapper"
            colors={["#212529"]}
          />
        )}
      </div>
    </div>
  );
};

export default UpdateProduct;
