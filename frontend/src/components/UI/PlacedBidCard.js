import { Link } from "react-router-dom";
import "./placedBidCard.css";

const PlacedBidCard = ({ name, img, placedAt, category, basePrice, placedAtPrice }) => {
  return (
    <div className="userCreatedProduct_card">
      <img src={img} alt={name} />
      <div className="card_right">
        <div>
          <div>
            <i className="fa-solid fa-hashtag"></i> <strong>Product Name: </strong>
            {name}
          </div>
          <div>
            <i className="fa-solid fa-hashtag"></i> <strong>Category: </strong>
            {category}
          </div>
          <div>
            <i className="fa-solid fa-hashtag"></i> <strong>Product base price: </strong>
            {basePrice}
          </div>
          <div>
            <i className="fa-solid fa-hashtag"></i> <strong>Placed on: </strong>
            {new Date(placedAt).toDateString()}
          </div>
          <div>
            <i className="fa-solid fa-hashtag"></i> <strong>Bid placed for: </strong>
            {placedAtPrice}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlacedBidCard;
