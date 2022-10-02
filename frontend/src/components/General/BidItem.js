import React from "react";
import styles from "./biditem.module.css";
import { Link } from "react-router-dom";

const BidItem = ({ description, category, name, closesAt, imgURL, prodId, bPrice }) => {
  // console.log(prodId);
  return (
    <div className={styles.topbid_card}>
      <img src={imgURL} alt={name} className={styles.topbid_card_img} />
      <div className={styles.card_right}>
        <p>{description}</p>

        <div className={styles.icons_grid}>
          <div className={styles.first_icon}>
            <i className="fa-solid fa-circle-info"></i> <strong>Category: {category} </strong>
          </div>
          <div>
            <i className="fa-solid fa-circle-info"></i> <strong>Product: {name}</strong>
          </div>
          <div>
            <i className="fa-solid fa-circle-info"></i> <strong>Base price: {bPrice}</strong>
          </div>
          <div>
            <i className="fa-solid fa-circle-info"></i> <strong>Total bids: </strong>
          </div>
          <div>
            <i className="fa-solid fa-circle-info"></i> <strong>Closes at: {new Date(closesAt).toDateString()} </strong>
          </div>
        </div>

        <Link to={`/products/${prodId}`} className={styles.details_btn}>
          See more details
        </Link>
      </div>
    </div>
  );
};

export default BidItem;
