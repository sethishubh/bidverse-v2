import React, { useState } from "react";
import classes from "./heroCarousel.module.css";

import { useEffect, useContext } from "react";
import { CategoryContext } from "../../store/categoryContext";

const HeroCarousel = () => {
  const [category, setCategory] = useState("");
  const categories = useContext(CategoryContext);

  const setCategpryHandler = (e) => {
    setCategory(e.target.value);
  };

  return (
    <React.Fragment>
      <div className={classes.heroimg} role="image" aria-label="Hero image">
        <div className={classes.hero_text}>
          <div className={classes.hero_inner}>
            <h3 className={classes.hero_heading_primary}>A deal that you will remember</h3>
            <h2 className={classes.hero_heading_main}>True value for your money</h2>

            <div className={classes.hero_buttons}>
              <select className={classes.hero_categories} onChange={setCategpryHandler} value={category}>
                {categories.map((prod) => (
                  <option value={prod}> {prod} </option>
                ))}
              </select>

              <button className={classes.herobid_btn}>See more details</button>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default HeroCarousel;
