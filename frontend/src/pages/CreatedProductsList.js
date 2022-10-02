import { useContext, useEffect, useState, useMemo } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";

import { ColorRing as Loader } from "react-loader-spinner";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

import { AuthContext } from "../store/authContext";
import CreatedProductCard from "../components/UI/CreatedProductCard";
import PlacedBidCard from "../components/UI/PlacedBidCard";
import "./productListAdmin.css";

const CreatedProductsList = () => {
  const [loading, setLoading] = useState(false);
  const [productsList, setProductsList] = useState([]);
  const [bidsListProducts, setBidsListProducts] = useState([]);
  const auth = useContext(AuthContext);

  // fetch all the prodcuts AFTER 1st page render
  useEffect(() => {
    setLoading(true);
    axios
      .get(`${process.env.REACT_APP_BACKEND}/api/v1/products`)
      .then((data) => {
        setProductsList(data.data.data.products);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  }, []);

  // fetch all the bids AFTER 1st page render
  useEffect(() => {
    setLoading(true);

    axios({
      method: "get",
      url: `${process.env.REACT_APP_BACKEND}/api/v1/bids/bidsByUser`,
      headers: {
        Authorization: "Bearer " + auth.token,
      },
    })
      .then((data) => {
        // console.log("CreateProductsList.js: ", data);
        // console.log(data.data.data.products);
        const bidsPlaced = data.data.data.bids;
        setBidsListProducts(bidsPlaced);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.response.data.status);
        setLoading(false);
      });
  }, []);

  const productDeleteHandler = (prodId) => {
    setLoading(true);
    axios({
      method: "delete",
      url: `${process.env.REACT_APP_BACKEND}/api/v1/products/${prodId}`,
      headers: {
        Authorization: "Bearer " + auth.token,
      },
    })
      .then((data) => {
        console.log(data);
        setLoading(false);
        setProductsList((prevProdList) => {
          return prevProdList.filter((prod) => prod._id.toString() !== prodId);
        });
        toast.info("Product deleted successfully!");
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        toast.info(
          err.response.data.error,
          {
            position: "top-center",
            autoClose: 5000,
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

  return (
    <div className="admin_product_create_main">
      <ToastContainer />
      <h1>Created products</h1>
      {/* <h1>Placed bids</h1> */}

      <div className="admin_product_list_container">
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

        <div className="products_list_admin">
          {/* show all fetched products */}
          {productsList.map((fetchedProd) => (
            <CreatedProductCard
              key={fetchedProd._id}
              productId={fetchedProd._id}
              name={fetchedProd.name}
              img={fetchedProd.imageURL}
              category={fetchedProd.category}
              basePrice={fetchedProd.basePrice}
              description={fetchedProd.description}
              closesAt={fetchedProd.closesAt}
              createdAt={fetchedProd.createdAt}
              onDelete={productDeleteHandler}
            />
          ))}

          {/* show all fetched placed bids */}
          <h2>Placed bids</h2>
          {bidsListProducts.map((placedBid) => (
            <PlacedBidCard
              key={placedBid._id}
              name={placedBid.product.name}
              img={placedBid.product.imageURL}
              placedAt={placedBid.createdAt}
              category={placedBid.product.category}
              basePrice={placedBid.product.basePrice}
              placedAtPrice={placedBid.madeAtPrice}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CreatedProductsList;
