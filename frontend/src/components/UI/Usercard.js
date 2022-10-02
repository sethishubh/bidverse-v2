import React from "react";
import classes from "./usercard.module.css";

const Usercard = ({ src, moneySpent, totalBids }) => {
  return (
    <div className={classes.topbid_card}>
      <img
        src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
        alt=""
        className={classes.topbid_card_img}
      />
      <div className={classes.card_right}>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis
          eos ex, quibusdam. Lorem ipsum dolor sit amet consectetur adipisicing
          elit. Minus, ipsam!
        </p>

        <div>
          <div>
            <i className="fa-solid fa-dollar-sign"></i>{" "}
            <strong>Total spent: </strong>
          </div>
          <div>
            <i className="fa-solid fa-circle-info"></i>{" "}
            <strong>Total bids: </strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Usercard;
