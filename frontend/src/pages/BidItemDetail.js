import { useContext, useEffect, useState, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { ColorRing as Loader } from "react-loader-spinner";
import classes from "./biditemDetail.module.css";
import { AuthContext } from "../store/authContext";

const BidItemDetail = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [isProductAlreadyBidByCurrentUser, setIsProductAlreadyBidByCurrentUser] = useState(false);

  const [prodItem, setProdItem] = useState({});
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const { prId } = useParams();

  const isLoggedIn = auth.isLoggedIn;

  const bidValueRef = useRef();
  let redirectTimerId;

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
        setLoading(false);
        const bidIdPlacedByUser = data.data.data.bids[0].product._id;
        // check if user has already placed a bid on this product
        setIsProductAlreadyBidByCurrentUser(bidIdPlacedByUser === prId);
      })
      .catch((err) => {
        console.log(err);
        // toast.error(err.response.data.status);
        setLoading(false);
      });
  }, []);

  const bidPriceSubmitHandler = () => {
    const bidPriceFromUser = bidValueRef.current.value;
    if (bidPriceFromUser < prodItem.basePrice) {
      setError(`Bid price can not be less than base price of ${prodItem.basePrice}`);
      toast.error(`Bid price can not be less than base price of ${prodItem.basePrice}`);
      return;
    }

    setLoading(true);

    axios({
      method: "post",
      url: `${process.env.REACT_APP_BACKEND}/api/v1/bids`,
      data: {
        madeAtPrice: bidPriceFromUser,
        product: prId,
      },
      headers: {
        Authorization: "Bearer " + auth.token,
      },
    })
      .then((data) => {
        toast.info("Bid posted successfully!");
        setLoading(false);

        // // redirect after 2 seconds
        // redirectTimerId = setTimeout(() => {
        navigate("/users/admin/products");
        // }, 2000);
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

  // Get product by id
  useEffect(() => {
    setLoading(true);
    axios({
      method: "get",
      url: `${process.env.REACT_APP_BACKEND}/api/v1/products/${prId}`,
    })
      .then((data) => {
        setLoading(false);
        let product = data.data.data.product;
        const { name, basePrice, category, closesAt, description, imageURL } = product;
        setProdItem({
          name,
          basePrice,
          category,
          closesAt,
          description,
          imageURL,
        });
      })
      .catch((err) => {
        setLoading(false);
      });
    return () => clearTimeout(redirectTimerId);
  }, [prId, redirectTimerId]);

  return (
    <div className={classes.biditem_outer}>
      <h1 className={classes.biditem_outer_title}>Product name: Earphones </h1>
      <div className={classes.biddetail_grid}>
        <div>
          <img className={classes.biddetail_img} src={prodItem.imageURL} alt={prodItem.name} />
        </div>
        {loading ? (
          <Loader
            visible={true}
            height="100"
            width="100"
            ariaLabel="blocks-loading"
            wrapperStyle={{}}
            wrapperClass="blocks-wrapper"
            colors={["#212529"]}
          />
        ) : (
          <div className={classes.biddetail_right}>
            <p>{prodItem.description}</p>
            <div className={classes.biddetail_text}>
              <p>Category: {prodItem.category}</p>
              <p>Total bids: </p>
              <p>Base price: {prodItem.basePrice}</p>
              <p>Closes at: {new Date(prodItem.closesAt).toDateString()} </p>
            </div>
            {isLoggedIn && !isProductAlreadyBidByCurrentUser && !loading && (
              <div className={classes.bid_container}>
                <input
                  type="number"
                  className={classes.bid_container_input}
                  placeholder="Bidding price"
                  ref={bidValueRef}
                  step="0.01"
                  required
                />{" "}
              </div>
            )}

            {isLoggedIn && isProductAlreadyBidByCurrentUser && !loading && (
              <button className={classes.biddetailcard_button} style={{ width: "70%" }}>
                You already placed bid on this product
              </button>
            )}

            {isLoggedIn && !isProductAlreadyBidByCurrentUser && !loading && (
              <button className={classes.biddetailcard_button} style={{ width: "40%" }} onClick={bidPriceSubmitHandler}>
                Place the bid now
              </button>
            )}

            {!isLoggedIn && !loading && (
              <Link to="/login" className={classes.biddetailcard_button}>
                Login to place the bid
              </Link>
            )}
            <ToastContainer />
          </div>
        )}
      </div>
    </div>
  );
};

export default BidItemDetail;
