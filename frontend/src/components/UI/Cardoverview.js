import React from "react";
import { useNavigate } from "react-router-dom";
import "./cardOverview.css";

const Card = (props) => {
  const { id, src, awardedAt, category, productName, totalBids, closesAt, basePrice, isActive } = props;

  const navigate = useNavigate();

  const cardOverviewHandler = () => {
    navigate(`/products/${id}`);
  };
  return (
    <div className="cardoverview_container">
      <img src={src} alt="" />

      <div className="cardoverview_inner">
        <h3>{productName}</h3>
        <div className="cardoverview_grid">
          {/* <p>
            <span>
              <i className="fa-regular fa-circle-check"></i>
              <strong>{totalBids}</strong> bids so far
            </span>
          </p> */}
          <p>
            {" "}
            <i className="fa-regular fa-circle-check"></i> Base price: <strong>{basePrice} ₹</strong>
          </p>
          <p>
            <i className="fa-regular fa-circle-check"></i> Closes at: {new Date(closesAt).toDateString()}
          </p>
        </div>
        {awardedAt && <button>Awarded at: {awardedAt} ₹</button>}
        {!awardedAt && <button onClick={cardOverviewHandler}>Place bid now</button>}
      </div>
    </div>
  );
};

export default Card;
