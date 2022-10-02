import React, { useState, useRef, useContext, useEffect } from "react";
import { ColorRing as Loader } from "react-loader-spinner";
import { Link, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

import "./createProduct.css";
import { AuthContext } from "../store/authContext";

const CreateProduct = () => {
  const nameRef = useRef();
  const basePriceRef = useRef();
  const categoryRef = useRef();
  const expireAtRef = useRef();
  const descRef = useRef();
  const imageURLRef = useRef();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [isCreated, setIsCreated] = useState(false);

  const auth = useContext(AuthContext);

  let name, basePrice, category, closesAt, description, imageURL;
  let redirectTimerId;

  const createProdFormSubmitHandler = (e) => {
    e.preventDefault();

    // Get values
    name = nameRef.current.value;
    basePrice = basePriceRef.current.value;
    category = categoryRef.current.value;
    closesAt = expireAtRef.current.value;
    description = descRef.current.value;
    imageURL = imageURLRef.current.value;

    setLoading(true);

    axios({
      method: "post",
      url: `${process.env.REACT_APP_BACKEND}/api/v1/products`,
      data: {
        name,
        basePrice,
        category,
        closesAt,
        description,
        imageURL,
      },
      headers: {
        Authorization: "Bearer " + auth.token,
      },
    })
      .then((data) => {
        toast.info("Product created successfully!");
        setLoading(false);

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
    return () => clearTimeout(redirectTimerId);
  }, []);

  return (
    <div className="admin_product_create_main">
      <ToastContainer />
      <h1>Create a product</h1>

      <div className="admin_product_create_form">
        <form action="" onSubmit={createProdFormSubmitHandler}>
          <div>
            <label htmlFor="name">Product name: </label>
            <input type="text" id="name" ref={nameRef} />
          </div>

          <div>
            <label htmlFor="basePrice">Base price: </label>
            <input type="number" id="basePrice" step="0.01" ref={basePriceRef} />
          </div>
          <div>
            <label htmlFor="cat">Category</label>
            <input type="text" id="cat" ref={categoryRef} />
          </div>

          <div>
            <label htmlFor="expireAt">Will be removed at: </label>
            <input type="date" id="expireAt" ref={expireAtRef} />
          </div>

          <div>
            <label htmlFor="desc">Description</label>
            <textarea id="desc" cols="30" rows="5" ref={descRef}></textarea>
          </div>

          <div>
            <label htmlFor="imageURL">Image URL</label>
            <input type="text" id="imageURL" ref={imageURLRef} />
          </div>

          <button>Create</button>
        </form>
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

export default CreateProduct;
