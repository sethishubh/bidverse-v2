import React from "react";
import { useEffect, useState, useContext } from "react";
import { CategoryContext } from "../store/categoryContext";
import { v4 as uuidv4 } from "uuid";

import axios from "axios";
import { ColorRing as Loader } from "react-loader-spinner";
import HeroGeneral from "../components/UI/HeroGeneral";
import BidItem from "../components/General/BidItem";
import "./bidslist.css";

const BidsList = () => {
  const categories = useContext(CategoryContext);
  const [loading, setLoading] = useState(false);
  const [productsList, setProductsList] = useState([]);
  const [pickedFilterCategory, setpickedFilterCategory] = useState("All");

  // get maximum priced product price
  const maxPricedProductPrice = Math.max(...productsList.map((prod) => prod.basePrice));

  const [minPriceInSlider, setMinPriceInSlider] = useState(0);
  const [maxPriceInSlider, setMaxPriceInSlider] = useState();

  const onMinPriceSliderChangeHandler = (e) => {
    setMinPriceInSlider(e.target.value);
  };

  const onMaxPriceSliderChangeHandler = (e) => {
    setMaxPriceInSlider(e.target.value);
  };

  // fetch all the prodcuts AFTER 1st page render
  useEffect(() => {
    // scroll to top on mount
    window.scrollTo(0, 0);
    setLoading(true);
    axios
      .get(`${process.env.REACT_APP_BACKEND}/api/v1/products`)
      .then((data) => {
        setProductsList(data.data.data.products);
        setMaxPriceInSlider(Math.max(...data.data.data.products.map((prod) => prod.basePrice)));
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  }, []);

  let filteredProducts;

  if (pickedFilterCategory === "All") {
    filteredProducts = productsList.filter(
      (product) => product.basePrice >= minPriceInSlider && product.basePrice <= maxPriceInSlider
    );
  } else {
    filteredProducts = productsList.filter(
      (product) =>
        product.basePrice >= minPriceInSlider &&
        product.basePrice <= maxPriceInSlider &&
        product.category === pickedFilterCategory
    );
  }

  const selectCategoryHandler = (e) => {
    setpickedFilterCategory(e.target.value);
  };

  return (
    <div>
      <HeroGeneral />
      <div className="bidlist_page_content">
        <aside className="filter">
          <h2>Filter by</h2>
          <div className="filterby_cat">
            <h3>Category: </h3>
            <select name="c" id="" onChange={selectCategoryHandler} value={pickedFilterCategory}>
              <option value="All">All</option>
              {categories.map((cat) => (
                <option key={uuidv4()} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div className="filterby_price">
            <h3>
              Start price:{" "}
              <input
                type="range"
                name="minPriceInSlider"
                value={minPriceInSlider}
                min="0"
                max={maxPricedProductPrice}
                onChange={onMinPriceSliderChangeHandler}
              />
              {minPriceInSlider}
            </h3>
            <h3>
              End price:{" "}
              {maxPriceInSlider && (
                <input
                  type="range"
                  name="maxPriceInSlider"
                  value={maxPriceInSlider}
                  min="0"
                  max={maxPricedProductPrice}
                  onChange={onMaxPriceSliderChangeHandler}
                />
              )}
              {maxPriceInSlider || 0}
            </h3>
          </div>
        </aside>
        <div>
          <div className="divlist_grid_main">
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
            {!loading && productsList.length === 0 && "No products found!"}
            {filteredProducts.map((prod) => (
              <BidItem
                key={prod._id}
                description={prod.description}
                category={prod.category}
                name={prod.name}
                closesAt={prod.closesAt}
                imgURL={prod.imageURL}
                prodId={prod._id}
                bPrice={prod.basePrice}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BidsList;
