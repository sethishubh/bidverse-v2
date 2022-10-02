import { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../store/authContext";
import axios from "axios";

import Cardoverview from "../UI/Cardoverview";
import "./popularBids.css";

const Featuredbids = () => {
  const [loading, setLoading] = useState(false);
  const [productsList, setProductsList] = useState([]);
  const auth = useContext(AuthContext);

  const featuredProds = productsList.slice(0, 4);

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
  return (
    <div className="popularbids">
      <h2>
        <Link to="/products">Featured products</Link>
      </h2>
      <div className="popularbids_flex">
        {featuredProds.length > 0 &&
          featuredProds.map((prod) => (
            <Cardoverview
              key={prod._id}
              id={prod._id}
              src={prod.imageURL}
              category={prod.category}
              productName={prod.productName}
              totalBids={20}
              basePrice={prod.basePrice}
              closesAt={prod.closesAt}
            />
          ))}
        {featuredProds.length === 0 && <h1 style={{ marginLeft: "2rem", minHeight: "40vh" }}>No products found!</h1>}
      </div>
    </div>
  );
};

export default Featuredbids;
