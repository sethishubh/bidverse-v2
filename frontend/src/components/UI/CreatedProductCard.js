import { Link } from "react-router-dom";
import "./createdProductCard.css";

const CreatedProductCard = ({
  productId,
  img,
  name,
  category,
  basePrice,
  description,
  createdAt,
  closesAt,
  onDelete,
}) => {
  const prodDeleteHandler = () => {
    onDelete(productId);
  };

  return (
    <div className="userCreatedProduct_card">
      <img src={img} alt={name} />
      <div className="card_right">
        <p>{description}</p>

        <div>
          <div>
            <i className="fa-solid fa-hashtag"></i> <strong>Name: {name} </strong>
          </div>
          <div>
            <i className="fa-solid fa-hashtag"></i> <strong>Category: {category} </strong>
          </div>
          <div>
            <i className="fa-solid fa-hashtag"></i> <strong>Base price: {basePrice} </strong>
          </div>
          <div>
            <i className="fa-solid fa-hashtag"></i> <strong>Created at: {new Date(createdAt).toDateString()} </strong>
          </div>
          <div>
            <i className="fa-solid fa-hashtag"></i> <strong>Closes at: {new Date(closesAt).toDateString()} </strong>
          </div>
          <div className="btns">
            <Link to={`/users/admin/products/${productId}/edit`} className="product_list_admn_link">
              Edit
            </Link>
            <button onClick={prodDeleteHandler}>Delete</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatedProductCard;
