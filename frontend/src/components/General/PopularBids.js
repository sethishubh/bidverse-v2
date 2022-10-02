import React from "react";
import Cardoverview from "../UI/Cardoverview";
import "./popularBids.css";

const PopularBids = () => {
  return (
    <div className="popularbids">
      <h2>Popular bids</h2>
      <div className="popularbids_flex">
        <Cardoverview
          src="https://images.pexels.com/photos/577769/pexels-photo-577769.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
          category="Electronics"
          productName={"Headphones"}
          totalBids={20}
          basePrice={100}
          closesAt="12/11/2022"
        />
        <Cardoverview
          src="https://images.pexels.com/photos/577769/pexels-photo-577769.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
          category="Electronics"
          productName={"Headphones"}
          totalBids={20}
          basePrice={100}
          closesAt="12/11/2022"
        />
        <Cardoverview
          src="https://images.pexels.com/photos/577769/pexels-photo-577769.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
          category="Electronics"
          productName={"Headphones"}
          totalBids={20}
          basePrice={100}
          closesAt="12/11/2022"
        />
        <Cardoverview
          src="https://images.pexels.com/photos/577769/pexels-photo-577769.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
          category="Electronics"
          productName={"Headphones"}
          totalBids={20}
          basePrice={100}
          closesAt="12/11/2022"
        />
      </div>
    </div>
  );
};

export default PopularBids;
