import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import "./moreInfo.scss";

const MoreInfo = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const item = location.state;

  useEffect(() => {
    if (!item) {
      navigate("/marketplace");
    }
  }, [item, navigate]);

  if (!item) return null;

  return (
    <div className="more-info">
        <Link to="/marketplace" className="back-button">
            ← Back to Marketplace
        </Link>
      <h2>{item.name} - Details</h2>
      <img className="detail-img" src={item.img} alt={item.name} />
      <p><strong>Price:</strong> {item.price}</p>
      <p><strong>Seller:</strong> {item.seller}</p>
      <p><strong>Product Age:</strong> {item.age}</p>
      <p><strong>Features:</strong></p>
      <ul>
        {item.features.map((f, index) => (
          <li key={index}>{f}</li>
        ))}
      </ul>
      <p><strong>Contact:</strong> example@email.com</p>
      <p><strong>Contact Number:</strong> 9414xxxxxx</p>
    </div>
  );
};

export default MoreInfo;


