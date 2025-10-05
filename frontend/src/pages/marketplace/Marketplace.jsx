import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Laptop from "../../assets/images/laptop.png";
import Chair from "../../assets/images/chair.png";
import Phone from "../../assets/images/phone.jpg";
import Book from "../../assets/images/book.png";
import HeadPhone from "../../assets/images/headphone.png";
import "./marketplace.scss";
import "./moreInfo.scss";
import "./sell.scss";
const Marketplace = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const items = [
    {
      id: 1,
      name: "Laptop",
      price: "₹40,000",
      img: Laptop,
      seller: "Rahul",
      contact: "rahul@example.com",
      age: "1 year",
      features: ["Intel i5", "8GB RAM", "512GB SSD"]
    },
    {
      id: 2,
      name: "Data Science Book",
      price: "₹500",
      img: Book,
      seller: "Priya",
      contact: "priya@example.com",
      age: "6 months",
      features: ["Python", "Machine Learning"]
    },
    {
      id: 3,
      name: "Head Phone",
      price: "₹1,200",
      img: HeadPhone,
      seller: "Amit",
      contact: "amit@example.com",
      age: "2 years",
      features: ["Built in Mic", "Comfortable"]
    },
    {
      id: 4,
      name: "Smartphone",
      price: "₹15,000",
      img: Phone,
      seller: "Sneha",
      contact: "sneha@example.com",
      age: "8 months",
      features: ["64MP Camera", "6GB RAM"]
    }
  ];

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="marketplace">
    <div className="marketplace-header">
  <div className="spacer" />
  <h2 className="title">Marketplace</h2>
  <span className="sell-link" onClick={() => navigate("/marketplace/sell")}>
  Sell Item &gt;
  </span>
</div>

  
      <div className="controls">
        <input
          type="text"
          placeholder="Search items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {/* <button className="sell-button" onClick={() => navigate("/marketplace/sell")}>Sell Item</button> */}
      </div>
      <div className="items-grid">
        {filteredItems.map(item => (
          <div className="item-card" key={item.id}>
            <img src={item.img} alt={item.name} />
            <h3>{item.name}</h3>
            <p className="price">{item.price}</p>
            <button onClick={() => navigate(`/marketplace/item/${item.id}`, { state: item })}>More Info</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Marketplace;