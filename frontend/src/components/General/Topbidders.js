import React from "react";
import Usercard from "../UI/Usercard";
import "./topBidders.css";

const Topbidders = () => {
  return (
    <div className="topbidders_container">
      <h2>Our top bidders</h2>
      <h3>
        Have a look at the top bidders who have spent most on bids and have won
        numerous bids on our platform
      </h3>

      <div className="topbidders_grid">
        <Usercard />
        <Usercard />
      </div>
    </div>
  );
};

export default Topbidders;
